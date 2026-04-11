import {
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Pagination,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    message,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import {
    deleteHirerClass,
    getDurationOptions,
    getGradeOptions,
    getHirerClassById,
    getHirerClasses,
    getLocationOptions,
    getSubjectOptions,
    updateHirerClass,
    type FilterOption,
    type HirerClassDTO,
} from "../../features/classes/api/classApi";
import "./HirerClassManagement.css";

type EditValues = {
    subjectId: number;
    gradeId: number;
    locationId: number;
    durationId: number;
    fee: number;
    requirements: string;
    note: string;
    studentGender: "MALE" | "FEMALE" | "OTHER";
    studentDescription: string;
};

const fallbackDurationOptions: FilterOption[] = [
    { id: 1, name: "60 phút" },
    { id: 2, name: "90 phút" },
    { id: 3, name: "120 phút" },
    { id: 4, name: "150 phút" },
];

function HirerClassManagement() {
    const [form] = Form.useForm<EditValues>();
    const pageSize = 8;

    const [items, setItems] = useState<HirerClassDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [bootstrapping, setBootstrapping] = useState(true);

    const [subjects, setSubjects] = useState<FilterOption[]>([]);
    const [grades, setGrades] = useState<FilterOption[]>([]);
    const [locations, setLocations] = useState<FilterOption[]>([]);
    const [durations, setDurations] = useState<FilterOption[]>([]);

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailItem, setDetailItem] = useState<HirerClassDTO | null>(null);

    const [editOpen, setEditOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<HirerClassDTO | null>(null);
    const [saving, setSaving] = useState(false);

    const durationOptions = durations.length > 0 ? durations : fallbackDurationOptions;
    const paginatedItems = useMemo(
        () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
        [items, currentPage]
    );

    const subjectMap = useMemo(() => new Map(subjects.map((item) => [item.id, item.name])), [subjects]);
    const gradeMap = useMemo(() => new Map(grades.map((item) => [item.id, item.name])), [grades]);
    const locationMap = useMemo(() => new Map(locations.map((item) => [item.id, item.name])), [locations]);
    const durationMap = useMemo(() => new Map(durationOptions.map((item) => [item.id, item.name])), [durationOptions]);

    const getLabel = (mapping: Map<number, string>, id: number) => mapping.get(id) || `#${id}`;

    const fetchClasses = async (isRefreshing = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getHirerClasses();
            setItems(data);
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Không thể tải danh sách lớp");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setBootstrapping(true);

            const [classRes, subjectRes, gradeRes, locationRes, durationRes] = await Promise.allSettled([
                getHirerClasses(),
                getSubjectOptions(),
                getGradeOptions(),
                getLocationOptions(),
                getDurationOptions(),
            ]);

            if (classRes.status === "fulfilled") {
                setItems(classRes.value);
            } else {
                message.error(classRes.reason instanceof Error ? classRes.reason.message : "Không thể tải danh sách lớp");
            }

            if (subjectRes.status === "fulfilled") {
                setSubjects(subjectRes.value);
            }
            if (gradeRes.status === "fulfilled") {
                setGrades(gradeRes.value);
            }
            if (locationRes.status === "fulfilled") {
                setLocations(locationRes.value);
            }
            if (durationRes.status === "fulfilled") {
                setDurations(durationRes.value);
            }

            setBootstrapping(false);
        };

        void loadInitialData();
    }, []);

    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [items, currentPage]);

    const handleOpenDetail = async (id: number) => {
        try {
            setDetailLoading(true);
            setDetailOpen(true);
            const data = await getHirerClassById(id);
            setDetailItem(data);
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Không thể tải chi tiết lớp");
            setDetailOpen(false);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleOpenEdit = (item: HirerClassDTO) => {
        setEditingItem(item);
        form.setFieldsValue({
            subjectId: item.subjectId,
            gradeId: item.gradeId,
            locationId: item.locationId,
            durationId: item.durationId,
            fee: item.fee,
            requirements: item.requirements,
            note: item.note,
            studentGender: item.studentGender,
            studentDescription: item.studentDescription,
        });
        setEditOpen(true);
    };

    const handleUpdate = async (values: EditValues) => {
        if (!editingItem) {
            return;
        }

        try {
            setSaving(true);
            await updateHirerClass(editingItem.id, {
                subjectId: values.subjectId,
                gradeId: values.gradeId,
                locationId: values.locationId,
                durationId: values.durationId,
                fee: values.fee,
                requirements: values.requirements.trim(),
                note: values.note.trim(),
                studentGender: values.studentGender,
                studentDescription: values.studentDescription.trim(),
            });
            message.success("Cập nhật lớp thành công");
            setEditOpen(false);
            setEditingItem(null);
            await fetchClasses(true);
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Không thể cập nhật lớp");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteHirerClass(id);
            message.success("Đã xóa lớp");
            await fetchClasses(true);
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Không thể xóa lớp");
        }
    };

    const columns: ColumnsType<HirerClassDTO> = [
        {
            title: "Mã lớp",
            dataIndex: "id",
            width: 90,
            render: (id: number) => <span className="hirer-class-code">E{id.toString().padStart(4, "0")}</span>,
        },
        {
            title: "Môn học / Khối",
            key: "subject-grade",
            render: (_, record) => (
                <span>
                    {getLabel(subjectMap, record.subjectId)} - {getLabel(gradeMap, record.gradeId)}
                </span>
            ),
        },
        {
            title: "Khu vực",
            dataIndex: "locationId",
            render: (value: number) => getLabel(locationMap, value),
        },
        {
            title: "Học phí",
            dataIndex: "fee",
            width: 150,
            render: (value: number) => `${Number(value).toLocaleString("vi-VN")} đ`,
        },
        {
            title: "Trạng thái HS",
            dataIndex: "studentGender",
            width: 130,
            render: (value: HirerClassDTO["studentGender"]) => {
                const color = value === "MALE" ? "blue" : value === "FEMALE" ? "magenta" : "default";
                return <Tag color={color}>{value}</Tag>;
            },
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 220,
            render: (_, record) => (
                <Space size={8}>
                    <Button size="small" onClick={() => void handleOpenDetail(record.id)}>
                        Chi tiết
                    </Button>
                    <Button size="small" type="primary" onClick={() => handleOpenEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa bài đăng lớp?"
                        description="Hành động này không thể hoàn tác."
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => void handleDelete(record.id)}
                    >
                        <Button size="small" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="hirer-class-page">
            <div className="hirer-class-header">
                <Typography.Title level={2}>Quản lý lớp học</Typography.Title>
                <Button onClick={() => void fetchClasses(true)} loading={refreshing}>
                    Làm mới
                </Button>
            </div>

            <p className="hirer-class-subtitle">Danh sách các lớp học bạn đã đăng trên hệ thống.</p>

            <div className="hirer-class-table-wrap">
                <Table
                    rowKey="id"
                    loading={loading || bootstrapping}
                    columns={columns}
                    dataSource={paginatedItems}
                    pagination={false}
                />
            </div>

            <div className="hirer-class-pagination-wrap">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={items.length}
                    showSizeChanger={false}
                    onChange={setCurrentPage}
                />
            </div>

            <Modal
                title={detailItem ? `Chi tiết lớp E${detailItem.id.toString().padStart(4, "0")}` : "Chi tiết lớp"}
                open={detailOpen}
                onCancel={() => {
                    setDetailOpen(false);
                    setDetailItem(null);
                }}
                footer={null}
                confirmLoading={detailLoading}
            >
                {detailLoading ? (
                    <p>Đang tải chi tiết...</p>
                ) : detailItem ? (
                    <div className="hirer-class-detail">
                        <p><strong>Môn học:</strong> {getLabel(subjectMap, detailItem.subjectId)}</p>
                        <p><strong>Khối/Lớp:</strong> {getLabel(gradeMap, detailItem.gradeId)}</p>
                        <p><strong>Khu vực:</strong> {getLabel(locationMap, detailItem.locationId)}</p>
                        <p><strong>Thời lượng:</strong> {getLabel(durationMap, detailItem.durationId)}</p>
                        <p><strong>Học phí:</strong> {Number(detailItem.fee).toLocaleString("vi-VN")} đ / buổi</p>
                        <p><strong>Giới tính học sinh:</strong> {detailItem.studentGender}</p>
                        <p><strong>Yêu cầu gia sư:</strong> {detailItem.requirements}</p>
                        <p><strong>Mô tả học sinh:</strong> {detailItem.studentDescription}</p>
                        <p><strong>Ghi chú:</strong> {detailItem.note}</p>
                    </div>
                ) : null}
            </Modal>

            <Modal
                title={editingItem ? `Cập nhật lớp E${editingItem.id.toString().padStart(4, "0")}` : "Cập nhật lớp"}
                open={editOpen}
                onCancel={() => {
                    setEditOpen(false);
                    setEditingItem(null);
                    form.resetFields();
                }}
                onOk={() => void form.submit()}
                okText="Lưu cập nhật"
                cancelText="Hủy"
                confirmLoading={saving}
                width={760}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                    <div className="hirer-class-edit-grid">
                        <Form.Item name="subjectId" label="Môn học" rules={[{ required: true, message: "Chọn môn học" }]}>
                            <Select options={subjects.map((item) => ({ label: item.name, value: item.id }))} />
                        </Form.Item>
                        <Form.Item name="gradeId" label="Khối/Lớp" rules={[{ required: true, message: "Chọn khối/lớp" }]}>
                            <Select options={grades.map((item) => ({ label: item.name, value: item.id }))} />
                        </Form.Item>
                        <Form.Item name="locationId" label="Khu vực" rules={[{ required: true, message: "Chọn khu vực" }]}>
                            <Select options={locations.map((item) => ({ label: item.name, value: item.id }))} />
                        </Form.Item>
                        <Form.Item name="durationId" label="Thời lượng" rules={[{ required: true, message: "Chọn thời lượng" }]}>
                            <Select options={durationOptions.map((item) => ({ label: item.name, value: item.id }))} />
                        </Form.Item>
                        <Form.Item name="fee" label="Học phí/buổi" rules={[{ required: true, message: "Nhập học phí" }]}>
                            <InputNumber min={0} className="hirer-class-fee" />
                        </Form.Item>
                        <Form.Item name="studentGender" label="Giới tính học sinh" rules={[{ required: true, message: "Chọn giới tính" }]}>
                            <Select
                                options={[
                                    { label: "Nam", value: "MALE" },
                                    { label: "Nữ", value: "FEMALE" },
                                    { label: "Khác", value: "OTHER" },
                                ]}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item name="requirements" label="Yêu cầu gia sư" rules={[{ required: true, message: "Nhập yêu cầu" }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="studentDescription" label="Mô tả học sinh" rules={[{ required: true, message: "Nhập mô tả" }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="note" label="Ghi chú thêm" rules={[{ required: true, message: "Nhập ghi chú" }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default HirerClassManagement;
