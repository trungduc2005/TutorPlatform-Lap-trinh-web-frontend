import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Breadcrumb, Spin, Empty, Modal, Input, message as antMessage } from "antd";
import {
    ArrowLeftOutlined,
    BookOutlined,
    EnvironmentOutlined,
    DollarOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { ClassItem } from "../../features/classes/model/classTypes";
import { getPublicClassById, applyClass } from "../../features/classes/api/classApi";
import "leaflet/dist/leaflet.css";
import "./ClassDetail.css";
import { useAppSelector } from "../../app/store/hooks";
type GeocodePoint = [number, number];

const DEFAULT_MAP_CENTER: GeocodePoint = [21.028511, 105.804817];

type ClassDetailLocationState = {
    classData?: ClassItem;
};

function ClassDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const stateClassData = (location.state as ClassDetailLocationState | null)?.classData;
    const { status: authStatus, user, hasTutorProfile } = useAppSelector((state) => state.auth);
    const [classData, setClassData] = useState<ClassItem | null>(stateClassData ?? null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState("");
    const [submittingApplication, setSubmittingApplication] = useState(false);
    const [mapCenter, setMapCenter] = useState<GeocodePoint>(DEFAULT_MAP_CENTER);
    const [mapLoading, setMapLoading] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClassDetail = async () => {
            const classId = Number(id);

            if (!id || Number.isNaN(classId)) {
                setClassData(null);
                setError("Mã lớp không hợp lệ");
                setLoading(false);
                return;
            }

            if (stateClassData?.id === classId) {
                setClassData(stateClassData);
                setError(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const foundClass = await getPublicClassById(classId);

                if (foundClass) {
                    setClassData(foundClass);
                } else {
                    setClassData(null);
                    setError("Không tìm thấy lớp học này");
                }
            } catch (err) {
                setClassData(null);
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        };

        void fetchClassDetail();
    }, [id, stateClassData]);

    useEffect(() => {
        const address = [classData?.locationName, classData?.locationCity]
            .filter(Boolean)
            .join(", ")
            .trim();

        if (!address) {
            setMapCenter(DEFAULT_MAP_CENTER);
            setMapError("Không có địa chỉ để hiển thị bản đồ");
            return;
        }

        const controller = new AbortController();

        const geocodeAddress = async () => {
            try {
                setMapLoading(true);
                setMapError(null);

                const query = encodeURIComponent(`${address}, Vietnam`);
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`,
                    {
                        signal: controller.signal,
                        headers: {
                            "Accept-Language": "vi",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Không thể tải dữ liệu bản đồ");
                }

                const result = (await response.json()) as Array<{ lat: string; lon: string }>;

                if (!result.length) {
                    setMapCenter(DEFAULT_MAP_CENTER);
                    setMapError("Không tìm thấy vị trí chính xác cho địa chỉ này");
                    return;
                }

                const lat = Number(result[0].lat);
                const lon = Number(result[0].lon);

                if (Number.isNaN(lat) || Number.isNaN(lon)) {
                    throw new Error("Dữ liệu tọa độ không hợp lệ");
                }

                setMapCenter([lat, lon]);
            } catch (err) {
                if ((err as Error).name === "AbortError") {
                    return;
                }
                setMapCenter(DEFAULT_MAP_CENTER);
                setMapError("Không thể định vị địa chỉ, đang hiển thị vị trí mặc định");
            } finally {
                setMapLoading(false);
            }
        };

        void geocodeAddress();

        return () => {
            controller.abort();
        };
    }, [classData?.locationCity, classData?.locationName]);

    const classId = classData ? `E${classData.id.toString().padStart(5, "0")}` : "";

    const handleOpenApplyModal = () => {
        if (authStatus !== 'AUTHENTICATED') {
            navigate('/login', { state: { from: location } });
            return;
        }

        if (user?.role === 'TUTOR' && hasTutorProfile === false) {
            Modal.confirm({
                title: 'Bạn chưa cập nhật hồ sơ gia sư',
                content: 'Vui lòng cập nhật hồ sơ trước khi đăng ký nhận lớp.',
                okText: 'Đi tới cập nhật thông tin',
                cancelText: 'Tắt thông báo',
                onOk: () => navigate('/profile/tutor'),
            });
            return;
        }

        setIsApplyModalOpen(true);
    };

    const handleCloseApplyModal = () => {
        if (!submittingApplication) {
            setIsApplyModalOpen(false);
        }
    };

    const handleSubmitApplication = async () => {
        if (!classData) {
            return;
        }

        const trimmedMessage = applicationMessage.trim();

        if (!trimmedMessage) {
            antMessage.warning("Vui lòng nhập lời nhắn ứng tuyển");
            return;
        }

        try {
            setSubmittingApplication(true);
            await applyClass({
                classId: classData.id,
                message: trimmedMessage,
            });
            antMessage.success("Ứng tuyển thành công");
            setIsApplyModalOpen(false);
            setApplicationMessage("");
        } catch (err) {
            antMessage.error(err instanceof Error ? err.message : "Ứng tuyển thất bại");
        } finally {
            setSubmittingApplication(false);
        }
    };

    if (loading) {
        return (
            <div className="class-detail-container" style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error || !classData) {
        return (
            <div className="class-detail-container" style={{ padding: "50px" }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/classes")}
                    style={{ marginBottom: "20px" }}
                >
                    Quay lại
                </Button>
                <Empty description={error || "Không tìm thấy lớp học"} />
            </div>
        );
    }

    return (
        <div className="class-detail-container">
            <div className="class-detail-header">
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/classes")}>
                    Quay lại
                </Button>
                <Breadcrumb
                    items={[
                        { title: "Danh sách lớp mới" },
                        { title: classId },
                    ]}
                />
            </div>

            <div className="class-detail-content">
                <div className="detail-main">
                    <div className="detail-hero">
                        <div>
                            <h1>Chi tiết lớp {classId}</h1>
                            <div className="class-status">
                                <span className="status-badge">Đang còn</span>
                            </div>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            className="register-btn"
                            onClick={handleOpenApplyModal}
                        >
                            Đăng ký nhận lớp
                        </Button>
                    </div>

                    <section className="detail-section detail-block">
                        <h3>Thông tin chính</h3>
                        <div className="main-info-grid">
                            <div className="main-info-item">
                                <span className="main-info-icon" aria-hidden="true">
                                    <BookOutlined />
                                </span>
                                <div>
                                    <div className="main-info-label">Môn học - Lớp</div>
                                    <div className="main-info-value">{classData.subjectName} - {classData.gradeName}</div>
                                </div>
                            </div>

                            <div className="main-info-item">
                                <span className="main-info-icon" aria-hidden="true">
                                    <EnvironmentOutlined />
                                </span>
                                <div>
                                    <div className="main-info-label">Địa điểm</div>
                                    <div className="main-info-value">{classData.locationName}, {classData.locationCity}</div>
                                </div>
                            </div>

                            <div className="main-info-item">
                                <span className="main-info-icon" aria-hidden="true">
                                    <DollarOutlined />
                                </span>
                                <div>
                                    <div className="main-info-label">Học phí</div>
                                    <div className="main-info-value">{Math.floor(classData.fee).toLocaleString("vi-VN")}đ / buổi</div>
                                </div>
                            </div>

                            <div className="main-info-item">
                                <span className="main-info-icon" aria-hidden="true">
                                    <ClockCircleOutlined />
                                </span>
                                <div>
                                    <div className="main-info-label">Thời lượng</div>
                                    <div className="main-info-value">{classData.durationName}</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="detail-section detail-block">
                        <h3>Yêu cầu lớp học</h3>
                        <div className="description-box">
                            <p className="description-title">Yêu cầu</p>
                            <p className="description-text">{classData.requirements?.trim() || "Không có"}</p>
                        </div>
                        <div className="description-box">
                            <p className="description-title">Lưu ý</p>
                            <p className="description-text">{classData.note?.trim() || "Không có"}</p>
                        </div>
                    </section>

                    <section className="detail-section detail-block">
                        <h3>Đặc điểm học sinh</h3>
                        <div className="mini-info-row">
                            <span className="mini-info-label">Giới tính</span>
                            <span className="mini-info-value">
                                {classData.studentGender === "MALE"
                                    ? "Nam"
                                    : classData.studentGender === "FEMALE"
                                      ? "Nữ"
                                      : "Không xác định"}
                            </span>
                        </div>
                        <div className="description-box">
                            <p className="description-title">Mô tả thêm</p>
                            <p className="description-text">{classData.studentDescription?.trim() || "Không có"}</p>
                        </div>
                    </section>
                </div>

                <aside className="detail-map-panel">
                    <h3>Bản đồ lớp học</h3>
                    <p className="map-address">
                        {[classData.locationName, classData.locationCity].filter(Boolean).join(", ") || "Chưa có địa chỉ"}
                    </p>

                    <div className="map-wrapper">
                        {mapLoading && (
                            <div className="map-overlay">
                                <Spin size="small" />
                                <span>Đang tải bản đồ...</span>
                            </div>
                        )}

                        <MapContainer
                            key={`${mapCenter[0]}-${mapCenter[1]}`}
                            center={mapCenter}
                            zoom={14}
                            scrollWheelZoom
                            className="class-detail-map"
                        >
                            <TileLayer
                                attribution="&copy; OpenStreetMap contributors"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <CircleMarker center={mapCenter} radius={10} pathOptions={{ color: "#ff7a45" }}>
                                <Popup>
                                    {[classData.locationName, classData.locationCity].filter(Boolean).join(", ")}
                                </Popup>
                            </CircleMarker>
                        </MapContainer>
                    </div>

                    {mapError && <p className="map-error">{mapError}</p>}
                </aside>
            </div>

            <Modal
                title="Ứng tuyển lớp học"
                open={isApplyModalOpen}
                wrapClassName="class-apply-modal"
                onOk={handleSubmitApplication}
                onCancel={handleCloseApplyModal}
                okText="Xác nhận ứng tuyển"
                cancelText="Hủy"
                confirmLoading={submittingApplication}
                destroyOnClose
            >
                <Input.TextArea
                    value={applicationMessage}
                    onChange={(event) => setApplicationMessage(event.target.value)}
                    placeholder="Nhập lời nhắn ứng tuyển"
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    maxLength={500}
                    showCount
                />
            </Modal>
        </div>
    );
}

export default ClassDetail;

