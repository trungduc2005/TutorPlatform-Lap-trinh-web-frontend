import { Button, Card, Modal, Pagination, Popconfirm, Select, Space, Table, Tag, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    cancelClassSelection,
    getGradeOptions,
    getHirerClassApplications,
    getHirerClasses,
    getSubjectOptions,
    selectClassApplication,
    type FilterOption,
    type HirerClassApplicationResponse,
    type HirerClassDTO,
} from "../../features/classes/api/classApi";
import { getPublicTutorProfileById } from "../../features/tutor/api/tutorApi";
import type { PublicTutorProfileDTO } from "../../features/tutor/model/tutorTypes";
import { ApiError } from "../../shared/api/axiosClient";
import "./HirerApplicationManagement.css";

type ApplicationStatus =
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED"
    | "CANCELLED"
    | "SELECTED_AWAITING_PAYMENT"
    | "PAYMENT_EXPIRED";

const APP_STATUS_LABELS: Record<ApplicationStatus, string> = {
    PENDING: "Chờ duyệt",
    ACCEPTED: "Đã chọn",
    REJECTED: "Đã từ chối",
    CANCELLED: "Đã hủy",
    SELECTED_AWAITING_PAYMENT: "Đã chọn - chờ thanh toán",
    PAYMENT_EXPIRED: "Hết hạn thanh toán",
};

const APP_STATUS_COLORS: Record<ApplicationStatus, string> = {
    PENDING: "gold",
    ACCEPTED: "green",
    REJECTED: "red",
    CANCELLED: "default",
    SELECTED_AWAITING_PAYMENT: "blue",
    PAYMENT_EXPIRED: "volcano",
};

function getAppStatus(item: HirerClassApplicationResponse): ApplicationStatus {
    const rawStatus = (item.classApplicationStatus || item.status || "PENDING").toUpperCase();
    if (rawStatus in APP_STATUS_LABELS) {
        return rawStatus as ApplicationStatus;
    }

    return "PENDING";
}

function HirerApplicationManagement() {
    const initializedRef = useRef(false);
    const pageSize = 8;

    const [classes, setClasses] = useState<HirerClassDTO[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | undefined>(undefined);
    const [applications, setApplications] = useState<HirerClassApplicationResponse[]>([]);

    const [subjects, setSubjects] = useState<FilterOption[]>([]);
    const [grades, setGrades] = useState<FilterOption[]>([]);

    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingApplications, setLoadingApplications] = useState(false);
    const [submittingAction, setSubmittingAction] = useState(false);
    const [bootstrapping, setBootstrapping] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isTutorDetailModalOpen, setIsTutorDetailModalOpen] = useState(false);
    const [selectedTutorDetail, setSelectedTutorDetail] = useState<PublicTutorProfileDTO | null>(null);
    const [loadingTutorDetail, setLoadingTutorDetail] = useState(false);

    const subjectMap = useMemo(() => new Map(subjects.map((item) => [item.id, item.name])), [subjects]);
    const gradeMap = useMemo(() => new Map(grades.map((item) => [item.id, item.name])), [grades]);

    const selectedClass = useMemo(
        () => classes.find((item) => item.id === selectedClassId),
        [classes, selectedClassId]
    );

    const acceptedApplication = useMemo(
        () =>
            applications.find((item) => {
                const status = getAppStatus(item);
                return status === "ACCEPTED" || status === "SELECTED_AWAITING_PAYMENT";
            }),
        [applications]
    );

    const paginatedApplications = useMemo(
        () => applications.slice((currentPage - 1) * pageSize, currentPage * pageSize),
        [applications, currentPage]
    );

    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(applications.length / pageSize));
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [applications, currentPage]);

    const fetchApplications = async (classId: number) => {
        try {
            setLoadingApplications(true);
            const data = await getHirerClassApplications(classId);
            setApplications(data);
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Không thể tải danh sách ứng tuyển");
        } finally {
            setLoadingApplications(false);
        }
    };

    useEffect(() => {
        if (initializedRef.current) {
            return;
        }
        initializedRef.current = true;

        const bootstrap = async () => {
            try {
                setBootstrapping(true);
                setLoadingClasses(true);
                const [classRes, subjectRes, gradeRes] = await Promise.allSettled([
                    getHirerClasses(),
                    getSubjectOptions(),
                    getGradeOptions(),
                ]);

                if (classRes.status === "fulfilled") {
                    setClasses(classRes.value);
                    if (classRes.value.length > 0) {
                        const firstClassId = classRes.value[0].id;
                        setSelectedClassId(firstClassId);
                        await fetchApplications(firstClassId);
                    } else {
                        setApplications([]);
                    }
                } else {
                    message.error(classRes.reason instanceof Error ? classRes.reason.message : "Không thể tải danh sách lớp");
                }

                if (subjectRes.status === "fulfilled") {
                    setSubjects(subjectRes.value);
                }
                if (gradeRes.status === "fulfilled") {
                    setGrades(gradeRes.value);
                }
            } finally {
                setLoadingClasses(false);
                setBootstrapping(false);
            }
        };

        void bootstrap();
    }, []);

    const handleChangeClass = async (value: number) => {
        setSelectedClassId(value);
        setCurrentPage(1);
        await fetchApplications(value);
    };

    const handleSelectApplication = async (applicationId: number) => {
        if (!selectedClassId) {
            return;
        }

        try {
            setSubmittingAction(true);
            await selectClassApplication(selectedClassId, applicationId);
            message.success("Đã chọn gia sư cho lớp");
            await fetchApplications(selectedClassId);
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Không thể chọn gia sư");
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleCancelSelection = async () => {
        if (!selectedClassId) {
            return;
        }

        try {
            setSubmittingAction(true);
            await cancelClassSelection(selectedClassId);
            message.success("Đã hủy lựa chọn gia sư");
            await fetchApplications(selectedClassId);
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Không thể hủy lựa chọn");
        } finally {
            setSubmittingAction(false);
        }
    };

    const parseId = (value: unknown): number | undefined => {
        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }

        if (typeof value === "string" && value.trim()) {
            const parsed = Number(value);
            if (Number.isFinite(parsed)) {
                return parsed;
            }
        }

        return undefined;
    };

    const getTutorIdFromApplication = (item: HirerClassApplicationResponse) => {
        return parseId(item.tutorId) ?? parseId(item.tutorUserId) ?? parseId(item.userId);
    };

    const handleOpenTutorDetail = async (item: HirerClassApplicationResponse) => {
        const tutorId = getTutorIdFromApplication(item);
        if (!tutorId) {
            message.error("Không tìm thấy mã gia sư để xem chi tiết");
            return;
        }

        try {
            setLoadingTutorDetail(true);
            setIsTutorDetailModalOpen(true);
            const data = await getPublicTutorProfileById(tutorId);
            setSelectedTutorDetail(data);
        } catch (error) {
            setIsTutorDetailModalOpen(false);
            if (error instanceof ApiError && error.status === 404) {
                message.error(`Không tìm thấy thông tin gia sư với id = ${tutorId}`);
                return;
            }
            message.error(error instanceof Error ? error.message : "Không thể tải thông tin gia sư");
        } finally {
            setLoadingTutorDetail(false);
        }
    };

    const handleCloseTutorDetail = () => {
        setIsTutorDetailModalOpen(false);
        setSelectedTutorDetail(null);
    };

    const columns: ColumnsType<HirerClassApplicationResponse> = [
        {
            title: "Mã đơn",
            dataIndex: "id",
            width: 110,
            render: (id: number) => <span className="hirer-application-code">AP{id}</span>,
        },
        {
            title: "Gia sư",
            dataIndex: "tutorName",
            render: (value?: string) => value || "Chưa rõ",
        },
        {
            title: "Nội dung ứng tuyển",
            dataIndex: "message",
            render: (value?: string) => value || "(Không có)",
        },
        {
            title: "Trạng thái",
            key: "status",
            width: 130,
            render: (_, item) => {
                const status = getAppStatus(item);
                const label = APP_STATUS_LABELS[status] ?? status;
                const color = APP_STATUS_COLORS[status] ?? "default";
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 260,
            render: (_, item) => {
                const status = getAppStatus(item);
                return (
                    <Space wrap>
                        <Button
                            type="default"
                            size="small"
                            onClick={() => void handleOpenTutorDetail(item)}
                        >
                            Xem thông tin
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            disabled={status === "ACCEPTED" || submittingAction}
                            onClick={() => void handleSelectApplication(item.id)}
                        >
                            Chọn gia sư
                        </Button>
                    </Space>
                );
            },
        },
    ];

    return (
        <div className="hirer-application-page">
            <div className="hirer-application-header">
                <Typography.Title level={2}>Quản lý ứng tuyển</Typography.Title>
                <Space>
                    <Select
                        className="hirer-application-class-select"
                        placeholder="Chọn lớp học"
                        value={selectedClassId}
                        onChange={(value) => void handleChangeClass(value)}
                        loading={loadingClasses}
                        options={classes.map((item) => ({
                            value: item.id,
                            label: `E${item.id.toString().padStart(4, "0")} - ${subjectMap.get(item.subjectId) || `Môn #${item.subjectId}`} / ${gradeMap.get(item.gradeId) || `Khối #${item.gradeId}`}`,
                        }))}
                    />
                    <Button
                        onClick={() => selectedClassId && void fetchApplications(selectedClassId)}
                        loading={loadingApplications}
                        disabled={!selectedClassId}
                    >
                        Làm mới
                    </Button>
                </Space>
            </div>

            <p className="hirer-application-subtitle">
                Quản lý các đơn ứng tuyển của gia sư theo từng lớp và chọn gia sư phù hợp.
            </p>

            <Card className="hirer-application-summary" bordered>
                {selectedClass ? (
                    <>
                        <p>
                            <strong>Lớp đang chọn:</strong> E{selectedClass.id.toString().padStart(4, "0")} - {subjectMap.get(selectedClass.subjectId) || `Môn #${selectedClass.subjectId}`} / {gradeMap.get(selectedClass.gradeId) || `Khối #${selectedClass.gradeId}`}
                        </p>
                        <p>
                            <strong>Gia sư đã chọn:</strong> {acceptedApplication?.tutorName || "Chưa chọn"}
                        </p>
                        <Popconfirm
                            title="Hủy gia sư đã chọn?"
                            description="Bạn có thể chọn lại gia sư khác sau khi hủy."
                            okText="Hủy chọn"
                            cancelText="Đóng"
                            disabled={!acceptedApplication || submittingAction}
                            onConfirm={() => void handleCancelSelection()}
                        >
                            <Button danger disabled={!acceptedApplication || submittingAction}>
                                Hủy lựa chọn hiện tại
                            </Button>
                        </Popconfirm>
                    </>
                ) : (
                    <p>Bạn chưa có lớp nào để quản lý ứng tuyển.</p>
                )}
            </Card>

            <div className="hirer-application-table-wrap">
                <Table
                    rowKey="id"
                    columns={columns}
                    loading={loadingApplications || bootstrapping}
                    dataSource={paginatedApplications}
                    pagination={false}
                    locale={{ emptyText: "Chưa có đơn ứng tuyển cho lớp này" }}
                />
            </div>

            <div className="hirer-application-pagination-wrap">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={applications.length}
                    showSizeChanger={false}
                    onChange={setCurrentPage}
                />
            </div>

            <Modal
                title="Thông tin chi tiết gia sư"
                open={isTutorDetailModalOpen}
                onCancel={handleCloseTutorDetail}
                footer={null}
                destroyOnClose
            >
                {loadingTutorDetail ? (
                    <p>Đang tải thông tin gia sư...</p>
                ) : selectedTutorDetail ? (
                    <div className="hirer-tutor-detail">
                        <Typography.Title level={4} className="hirer-tutor-detail-name">
                            Gia sư: {selectedTutorDetail.fullName || "Chưa cập nhật tên gia sư"}
                        </Typography.Title>

                        <div className="hirer-tutor-detail-grid">
                            <p><strong>Trường:</strong> {selectedTutorDetail.school || "Chưa cập nhật"}</p>
                            <p><strong>Khu vực dạy:</strong> {selectedTutorDetail.teachingArea || "Chưa cập nhật"}</p>
                            <p><strong>Kinh nghiệm:</strong> {selectedTutorDetail.experience || "Chưa cập nhật"}</p>
                            <p><strong>Thời gian rảnh:</strong> {selectedTutorDetail.availableTime || "Chưa cập nhật"}</p>
                        </div>

                        <div className="hirer-tutor-detail-section">
                            <p><strong>Thành tích:</strong> {selectedTutorDetail.achievements || "Chưa cập nhật"}</p>
                            <p><strong>Giới thiệu:</strong> {selectedTutorDetail.bio || "Chưa cập nhật"}</p>
                        </div>
                    </div>
                ) : (
                    <p>Không có dữ liệu gia sư.</p>
                )}
            </Modal>
        </div>
    );
}

export default HirerApplicationManagement;
