import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Breadcrumb, Spin, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ClassItem } from '../../features/classes/model/classTypes';
import { searchClass } from '../../features/classes/api/classApi';
import './ClassDetail.css';

function ClassDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [classData, setClassData] = useState<ClassItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClassDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await searchClass({ page: 0 });
                const foundClass = response.items.find(item => item.id === Number(id));
                
                if (foundClass) {
                    setClassData(foundClass);
                } else {
                    setError('Không tìm thấy lớp học này');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchClassDetail();
        }
    }, [id]);

    const classId = classData ? "E" + classData.id.toString().padStart(5, "0") : "";

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

                    <div className="detail-section">
                        <h3>Gia sư hướng dẫn</h3>
                        <div className="info-row">
                            <span className="label">Tên gia sư:</span>
                            <span className="value">{classData.createdByName}</span>
                        </div>
                    </div>

                    <div className="detail-actions">
                        <Button type="primary" size="large" className="register-btn">
                            Đăng ký nhân lớp
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClassDetail;
