import { useEffect, useState } from "react"
import { adminApi } from "../../../features/admin/api/adminApi";
import type { FeaturedTutorType, UpdateFeaturedTutorPayload} from "../../../features/admin/model/featuredTutorType";
import { Button, Card, Form, Input, InputNumber, message, Modal, Popconfirm } from "antd";
import kittyLogo from "../../../assets/hello-kitty-logo.svg";
import "./FeaturedTutorMana.css";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";

export default function FeaturedTutorMana() {
    const [loading, setLoading] = useState(false);
    const [featuredTutors, setFeaturedTutors] = useState<FeaturedTutorType[]>([]);
    const [selectedFeturedTutor, setSelectedFeaturedTutor] = useState<FeaturedTutorType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [updatingTutorData, setUpdatingTutorData] = useState<UpdateFeaturedTutorPayload>({
        title: "",
        note: "",
        displayOrder: 0
    });

    const [form] = Form.useForm();

    useEffect(() => {
        const fetchFeaturedTutors = async () => {
            try {
                const res = await adminApi.getFeaturedTutors();
                message.success("Lấy danh sách gia sư tiêu biểu thành công");
                setFeaturedTutors(res);
                console.log("Featured Tutors:", res);
            }
            catch (error) {
                console.error("Không thể lấy danh sách gia sư tiêu biểu:", error);
                message.error("Lấy danh sách gia sư tiêu biểu thất bại");
            }
            finally {
                setLoading(false);
            }
        }
        fetchFeaturedTutors();
    }, [loading]);

    const handleCreateFeaturedTutor = async (tutorData: Payload) => {
        try {
            await adminApi.createFeaturedTutor(tutorData);
            message.success("Tạo gia sư tiêu biểu thành công");
            handleCreateModalClose();
            setLoading(true);
        } catch (error) {
            console.error("Không thể tạo gia sư tiêu biểu:", error);
            message.error("Tạo gia sư tiêu biểu thất bại");
        }
    };

    const handleUpdateFeaturedTutor = async (tutorData: UpdateFeaturedTutorPayload) => {
        if (!selectedFeturedTutor) return;
        try {
            await adminApi.updateFeaturedTutor(selectedFeturedTutor.id, tutorData);
            message.success("Cập nhật gia sư tiêu biểu thành công");
            setIsEditing(false);
            setLoading(true);
        } catch (error) {
            console.error("Không thể cập nhật gia sư tiêu biểu:", error);
            message.error("Cập nhật gia sư tiêu biểu thất bại");
        }
    };

    const handleDeleteFeaturedTutor = async () => {
        if (!selectedFeturedTutor) return;
        try{
            await adminApi.deleteFeaturedTutor(selectedFeturedTutor.id);
            message.success("Xóa gia sư tiêu biểu thành công");
            handleModalClose();
            setLoading(true);
        } catch (error) {
            console.error("Không thể xóa gia sư tiêu biểu:", error);
            message.error("Xóa gia sư tiêu biểu thất bại");
        }
    }

    const handleEdit = () => {
        if(!selectedFeturedTutor) return;

        setUpdatingTutorData({
            title: selectedFeturedTutor.title,
            note: selectedFeturedTutor.note,
            displayOrder: selectedFeturedTutor.displayOrder
        });
        setIsEditing(true);
    }

    const handleModalOpen = () => {
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedFeaturedTutor(null);
    }

    const handleModalCreateOpen = () => {
        setIsCreateModalOpen(true);
    }
    
    const handleCreateModalClose = () => {
        setIsCreateModalOpen(false);
    }


    return (
        <div
            className="featured-tutor-page"
        >
            <div className="featured-tutor__header"
            >
                <h1>Quản lý gia sư tiêu biểu</h1>
                <div
                    style={{display: "flex", justifyContent: "center", width: "100%"}}
                >
                    <button className="featured-tutor__create-btn" onClick={handleModalCreateOpen}>
                        Tạo mới
                    </button>
                </div>
            </div>
            
            {featuredTutors && (
                <div
                    className="featured-tutor-grid"
                >
                    {featuredTutors.map((tutor) => (
                        <Card className="featured-tutor-card">
                            <div className="featured-tutor-avatar">
                                <img src={tutor.avatarUrl ?? kittyLogo} />
                            </div>

                            <div className="featured-tutor-info">
                                <h3>{tutor.fullName}</h3>
                                <p>{tutor.school}</p>

                                <p>🏆 {tutor.title}</p>
                                <p>📘 {tutor.bio}</p>
                            </div>
                            
                            <button onClick={() => {
                                setSelectedFeaturedTutor(tutor);
                                handleModalOpen();
                            }}>
                                Xem hồ sơ
                            </button>
                        </Card>
                    ))}
                </div>
            )}
            <Modal
                title={`Chi tiết gia sư ${selectedFeturedTutor?.fullName ?? ""}`}
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                centered
                width={750}
                className="featured-tutor-modal"
            >
                {!isEditing ? (
                    <>
                        {selectedFeturedTutor && (
                            <div className="tutor-modal-card">
                                <div className="tutor-modal-header">
                                    <img
                                    className="tutor-modal-avatar"
                                    src={selectedFeturedTutor.avatarUrl ?? kittyLogo}
                                    alt={selectedFeturedTutor.fullName}
                                    />

                                    <div className="tutor-modal-info">
                                    <p><strong>Mã số:</strong> E{String(selectedFeturedTutor.id).padStart(4, "0")}</p>
                                    <p><strong>Gia sư:</strong> {selectedFeturedTutor.fullName}</p>
                                    <p><strong>Trường:</strong> {selectedFeturedTutor.school}</p>
                                    <p><strong>Tiêu đề:</strong> {selectedFeturedTutor.title}</p>
                                    <p><strong>Giới thiệu:</strong> {selectedFeturedTutor.bio}</p>
                                    </div>
                                </div>

                                <div className="tutor-modal-body">
                                    <p><strong>Ghi chú:</strong> {selectedFeturedTutor.note}</p>
                                    <p><strong>Kinh nghiệm:</strong> {selectedFeturedTutor.experience}</p>
                                    <p><strong>Thành tích:</strong> {selectedFeturedTutor.achievements}</p>
                                    <p><strong>Khu vực:</strong> {selectedFeturedTutor.teaching_area}</p>
                                    <p><strong>Thời gian rảnh:</strong> {selectedFeturedTutor.availableTime}</p>
                                </div>

                                <div className="tutor-modal-footer">
                                    <Popconfirm
                                        title="Bạn có chắc muốn xóa?"
                                        description="Hành động này không thể hoàn tác"
                                        onConfirm={() => handleDeleteFeaturedTutor()}
                                        okText="Xóa"
                                        cancelText="Hủy"
                                    >
                                        <button className="tutor-delete-btn">Xóa</button>
                                    </Popconfirm>
                                    <button className="tutor-update-btn" onClick={() => handleEdit()}>Chỉnh sửa thông tin</button>
                                </div>
                            </div>
                        )}
                    </>
                    ) : (
                    <div className="tutor-edit-card">
                        {selectedFeturedTutor && (
                            <div className="tutor-modal-header">
                            <img
                            className="tutor-modal-avatar"
                            src={selectedFeturedTutor.avatarUrl ?? kittyLogo}
                            alt={selectedFeturedTutor.fullName}
                            />

                            <div className="tutor-modal-info">
                            <p><strong>Mã số:</strong> E{String(selectedFeturedTutor.id).padStart(4, "0")}</p>
                            <p><strong>Gia sư:</strong> {selectedFeturedTutor.fullName}</p>
                            <p><strong>Trường:</strong> {selectedFeturedTutor.school}</p>
                            <p><strong>Tiêu đề:</strong> {selectedFeturedTutor.title}</p>
                            <p><strong>Giới thiệu:</strong> {selectedFeturedTutor.bio}</p>
                            </div>
                        </div>
                        )}
                        <Input
                            value={updatingTutorData?.title}
                            onChange={(e) =>
                                setUpdatingTutorData((prev) => prev ? ({ ...prev, title: e.target.value }) : prev)
                            }
                        />
                        <Input
                            value={updatingTutorData?.note}
                            onChange={(e) => {
                                setUpdatingTutorData((prev) => prev ? ({...prev, note: e.target.value}) : prev)
                            }}
                        />
                        <Input
                            value={updatingTutorData?.displayOrder}
                            onChange={(e) =>
                                setUpdatingTutorData((prev) => prev ? ({ ...prev, displayOrder: Number(e.target.value) }) : prev)
                            }
                        />
                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                            <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                            <Button type="primary" onClick={() => handleUpdateFeaturedTutor(updatingTutorData)}>
                                Lưu
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
            <Modal
                title="Thêm gia sư nổi bật"
                open={isCreateModalOpen}
                onCancel={handleCreateModalClose}
                footer={null}
                centered
                width={750}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateFeaturedTutor}
                >
                    <Form.Item
                    label="ID tài khoản gia sư"
                    name="tutorUserId"
                    rules={[{ required: true, message: "Vui lòng nhập Tutor User Id" }]}
                    >
                    <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                    label="Ghi chú"
                    name="note"
                    rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
                    >
                    <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                    label="Thứ tự hiển thị"
                    name="displayOrder"
                    rules={[{ required: true, message: "Vui lòng nhập displayOrder" }]}
                    >
                    <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item>
                    <div style={{ textAlign: "right" }}>
                        <Button
                        style={{ marginRight: 10 }}
                        onClick={handleCreateModalClose}
                        >
                        Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                        Tạo
                        </Button>
                    </div>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    )
}