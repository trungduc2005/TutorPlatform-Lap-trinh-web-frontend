import React, {useEffect, useMemo, useRef, useState} from "react";
import {Card, Button, Space, Typography, Input, message, Divider} from "antd";
import {PhoneOutlined, ShareAltOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { firestore } from "../../shared/lib/firebase";

const {Title, Text} = Typography;

const servers: RTCConfiguration = {
    iceServers: [{urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"]}],
    iceCandidatePoolSize: 10,
}

export default function ClassroomCallingPage(){
    const pc = useMemo(() => new RTCPeerConnection(servers), []);

    const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const [classId, setClassId] = useState("");
    const [createdId, setCreatedId] = useState<string | null>(null);

    const [starting, setStarting] = useState(false);
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [hangupEnabled, setHangupEnabled] = useState(false);

    //Attach remote tracks once
    // Lắng nghe khi peer gửi media
    // Nhận track (audio/video)
    // Thêm vào một MediaStream
    // Lưu stream đó vào React state
    useEffect(() => {
        pc.ontrack = (event) => {
            setRemoteStream((prev) => {
                const rs = prev ?? new MediaStream();
                event.streams[0].getTracks().forEach((t) => rs.addTrack(t));
                return rs;
            });
        };
        
        return () => {
            pc.ontrack = null;
        };
    }, [pc]);

    //Bind streams to <video>
    useEffect(() => {
        if (webcamVideoRef.current) webcamVideoRef.current.srcObject = localStream;
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    }, [remoteStream]);

    const startWebcam = async () => {
        try{
            setStarting(true);
            const ls = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            const rs = new MediaStream();

            //push local tracks 
            ls.getTracks().forEach((track) => pc.addTrack(track, ls));

            setLocalStream(ls);
            setRemoteStream(rs);

            message.success("Đã bật camera/mic");
        } catch (e: any){
            message.error(e?.message || "Không thể bậc camera/mic");
        } finally {
            setStarting(false);
        }
    };

    // ICE: địac chỉ mạng khả thi để 2 máy có thể kết nối với nhau
    // SDP: là bản mô tả phiên kết nối
    const createClass = async () => {
        if(!localStream) return message.warning("Bạn cần bấm Start Webcam trước");
        
        setCreating(true);
        try{
            const callDoc = firestore.collection("calls").doc();
            const offerCandidates = callDoc.collection("offerCandidates");
            const answerCandidates = callDoc.collection("answerCandidates");

            //ICE 
            pc.onicecandidate = (event) => {
                if(event.candidate) offerCandidates.add(event.candidate.toJSON());
            };

            //Offer
            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);
            const offer = {type: offerDescription.type, sdp: offerDescription.sdp};
            await callDoc.set({offer, createdAt: Date.now()});

            setCreatedId(callDoc.id);
            setClassId(callDoc.id);
            setHangupEnabled(true);

            //Listen answer
            callDoc.onSnapshot((snapshot) => {
                const data = snapshot.data() as any;
                if(!pc.currentRemoteDescription && data?.answer){
                    pc.setRemoteDescription(new RTCSessionDescription(data.answer));
                }
            });

            //Answer candidates -> add
            answerCandidates.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if(change.type === "added") {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        pc.addIceCandidate(candidate);
                    }
                });
            });

            message.success("Đã tạo lớp học. Gửi Class ID cho học sinh để tham gia.");
        } catch(e: any){
            message.error(e?.message || "Tạo lớp học thất bại");
        } finally {
            setCreating(false);
        }
    };

    const joinClass = async () => {
        if(!localStream) return message.warning("Bạn cần bấm Start Webcam trước");
        if(!classId.trim()) return message.warning("Nhập Class ID");

        setJoining(true);
        try{
            const callDoc = firestore.collection("calls").doc(classId.trim());
            const answerCandidates = callDoc.collection("answerCandidates");
            const offerCandidates = callDoc.collection("offerCandidates");

            pc.onicecandidate = (event) => {
                if(event.candidate) answerCandidates.add(event.candidate.toJSON());
            };

            const callData = (await callDoc.get()).data() as any;
            if(!callData.offer) {
                message.error("Class ID không tồn tại hoặc chưa có offer");
                return;
            }

            await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));

            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            const answer = {type: answerDescription.type, sdp: answerDescription.sdp};
            await callDoc.update({answer});

            //Offer candidates -> add
            offerCandidates.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if(change.type === "added"){
                        pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                    }
                });
            });

            setHangupEnabled(true);
            message.success("Đã tham gia lớp học!");
        } catch (e: any){
            message.error(e?.message || "Tham gia thất bại");
        } finally {
            setJoining(false);
        }
    };

    const copyClassId = async () => {
        if(!createdId) return;
        await navigator.clipboard.writeText(createdId);
        message.success("Đã copy Class ID");
    };

    const hangup = async () => {
        try {
            pc.getSenders().forEach((s) => s.track && s.track.stop());
            pc.getReceivers().forEach((r) => r.track && r.track.stop());
            pc.close();

            setLocalStream(null);
            setRemoteStream(null);
            setCreatedId(null);
            setHangupEnabled(false);

            message.success("Đã dừng cuộc họp");

        } catch {
            window.location.reload();
        }
    };

    return (
        <div style={{maxWidth: 1750, margin: "24px auto", padding: "0 16px"}}>
            <Title level={3} style={{marginBottom: 8}}>
                Lớp học trực tuyến
            </Title>
            <Text type="secondary">
                Gia sư: Start Webcam → Tạo lớp học → gửi Class ID. Sinh viên: Start Webcam → nhập Class ID → Tham gia.
            </Text>

            <Divider/>

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18}}>
                <Card title="Local (Bạn)" bodyStyle={{padding: 12}}>
                    <video ref={webcamVideoRef} autoPlay playsInline muted style={{width: "100%", borderRadius: 8, transform: "scaleX(-1)"}}></video>
                </Card>
                <Card title="Remote (Đối phương)" bodyStyle={{padding: 12}}>
                    <video ref={remoteVideoRef} autoPlay playsInline style={{width: "100%", borderRadius: 8, transform: "scaleX(-1)"}}></video>
                </Card>
            </div>

            <Divider/>

            <Card>
                <Space wrap>
                    <Button
                        icon={<VideoCameraOutlined/>}
                        onClick={startWebcam}
                        loading={starting}
                        disabled={!!localStream}
                    >
                        Start Webcam
                    </Button>

                    <Button type="primary" onClick={createClass} loading={creating} disabled={!localStream}>
                        Tạo lớp học (Create Offer)
                    </Button>

                    <Space.Compact style={{gap: 8}}>
                        <input 
                            style={{width: 320}}
                            placeholder="Nhập Class ID để tham gia"
                            value={classId}
                            onChange={(e) => setClassId(e.target.value)}
                        />
                        <Button onClick={joinClass} loading={joining} disabled={!localStream}>
                            Tham gia (Answer)
                        </Button>
                    </Space.Compact>
                    {createdId && (
                        <Button icon={<ShareAltOutlined/>} onClick={copyClassId}>
                            Copy Class ID
                        </Button>
                    )}

                    <Button
                        danger
                        icon={<PhoneOutlined/>}
                        onClick={hangup}
                        disabled={!hangupEnabled}
                    >
                        Hangup
                    </Button>
                </Space>
                {createdId && (
                    <div style={{marginTop: 16}}>
                        <Text strong>Class ID:</Text> <Text code style={{fontSize: 17}}>{createdId}</Text>
                    </div>
                )}
            </Card>
        </div>
    )
}