import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Breadcrumb, Spin, Empty, Modal, Input, message as antMessage } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { ClassItem } from '../../features/classes/model/classTypes';
import { getPublicClassById, applyClass } from '../../features/classes/api/classApi';
import 'leaflet/dist/leaflet.css';
import './ClassDetail.css';

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
    const [classData, setClassData] = useState<ClassItem | null>(stateClassData ?? null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState('');
    const [submittingApplication, setSubmittingApplication] = useState(false);
    const [mapCenter, setMapCenter] = useState<GeocodePoint>(DEFAULT_MAP_CENTER);
    const [mapLoading, setMapLoading] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClassDetail = async () => {
            const classId = Number(id);

            if (!id || Number.isNaN(classId)) {
                setClassData(null);
                setError('Mã lớp không hợp lệ');
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
                    setError('Không tìm thấy lớp học này');
                }
            } catch (err) {
                setClassData(null);
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        void fetchClassDetail();
    }, [id, stateClassData]);

    useEffect(() => {
        const address = [classData?.locationName, classData?.locationCity]
            .filter(Boolean)
            .join(', ')
            .trim();

        if (!address) {
            setMapCenter(DEFAULT_MAP_CENTER);
            setMapError('Không có địa chỉ để hiển thị bản đồ');
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
                            'Accept-Language': 'vi',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Không thể tải dữ liệu bản đồ');
                }

                const result = await response.json() as Array<{ lat: string; lon: string }>;

                if (!result.length) {
                    setMapCenter(DEFAULT_MAP_CENTER);
                    setMapError('Không tìm thấy vị trí chính xác cho địa chỉ này');
                    return;
                }

                const lat = Number(result[0].lat);
                const lon = Number(result[0].lon);

                if (Number.isNaN(lat) || Number.isNaN(lon)) {
                    throw new Error('Dữ liệu tọa độ không hợp lệ');
                }

                setMapCenter([lat, lon]);
            } catch (err) {
                if ((err as Error).name === 'AbortError') {
                    return;
                }
                setMapCenter(DEFAULT_MAP_CENTER);
                setMapError('Không thể định vị địa chỉ, đang hiển thị vị trí mặc định');
            } finally {
                setMapLoading(false);
            }
        };

        void geocodeAddress();

        return () => {
            controller.abort();
        };
    }, [classData?.locationCity, classData?.locationName]);

    const classId = classData ? "E" + classData.id.toString().padStart(5, "0") : "";

    const handleOpenApplyModal = () => {
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
            antMessage.warning('Vui lòng nhập lời nhắn ứng tuyển');
            return;
        }

        try {
            setSubmittingApplication(true);
            await applyClass({
                classId: classData.id,
                message: trimmedMessage,
            });
            antMessage.success('Ứng tuyển thành công');
            setIsApplyModalOpen(false);
            setApplicationMessage('');
        } catch (err) {
            antMessage.error(err instanceof Error ? err.message : 'Ứng tuyển thất bại');
        } finally {
            setSubmittingApplication(false);
        }
    };

    if (loading) {
        return (
            <div className="class-detail-container" style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error || !classData) {
        return (
            <div className="class-detail-container" style={{ padding: '50px' }}>
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/classes')}
                    style={{ marginBottom: '20px' }}
                >
                    Quay lại
                </Button>
                <Empty description={error || 'Không tìm thấy lớp học'} />
            </div>
        );
    }

    return (
        <div className="class-detail-container">
            <div className="class-detail-header">
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/classes')}
                >
                    Quay lại
                </Button>
                <Breadcrumb
                    items={[
                        { title: 'Danh sách lớp mới' },
                        { title: classId }
                    ]}
                />
            </div>

            <div className="class-detail-content">
                <div className="detail-main">
                    <h1>Chi tiết lớp {classId}</h1>
                    <div className="class-status">
                        <span className="status-badge">Đang còn</span>
                    </div>

                    <div className="detail-section">
                        <h3>Thông tin lớp học</h3>
                        <div className="info-row">
                            <span className="label">Môn học - Lớp:</span>
                            <span className="value">{classData.subjectName} - {classData.gradeName}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Địa điểm:</span>
                            <span className="value">{classData.locationName}, {classData.locationCity}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Học phí:</span>
                            <span className="value">{Math.floor(classData.fee).toLocaleString()} đ/buổi</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Thời lượng:</span>
                            <span className="value">{classData.durationName}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Yêu cầu:</span>
                            <span className="value">{classData.requirements}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Lưu ý:</span>
                            <span className="value">{classData.note}</span>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Đặc điểm học sinh</h3>
                        <div className="info-row">
                            <span className="label">Giới tính:</span>
                            <span className="value">
                                {classData.studentGender === 'MALE' ? 'Nam' : classData.studentGender === 'FEMALE' ? 'Nữ' : 'Không xác định'}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="label">Mô tả:</span>
                            <span className="value">{classData.studentDescription}</span>
                        </div>
                    </div>

                    <div className="detail-actions">
                        <Button
                            type="primary"
                            size="large"
                            className="register-btn"
                            onClick={handleOpenApplyModal}
                        >
                            Đăng ký nhận lớp
                        </Button>
                    </div>
                </div>

                <aside className="detail-map-panel">
                    <h3>Bản đồ lớp học</h3>
                    <p className="map-address">
                        {[classData.locationName, classData.locationCity].filter(Boolean).join(', ') || 'Chưa có địa chỉ'}
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
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <CircleMarker center={mapCenter} radius={10} pathOptions={{ color: '#ff7a45' }}>
                                <Popup>
                                    {[classData.locationName, classData.locationCity].filter(Boolean).join(', ')}
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
