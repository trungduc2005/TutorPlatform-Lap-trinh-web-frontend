import { useEffect, useState } from "react";
import type { FilterOptionType, GradeOptionRequestType, LocationOptionRequestType, SubjectOptionRequestType } from "../../../features/admin/model/statisticsType";
import { adminApi } from "../../../features/admin/api/adminApi";
import { Button, message, Modal, Popconfirm, Table } from "antd";

function FilterOptionMana() {
    // const [subjectData, setSubjectData] = useState<FilterOptionType[]>([]);
    // const [editingSubjectItem, setEditingSubjectItem] = useState<SubjectOptionRequestType | null>(null);
    // const [gradeData, setGradeData] = useState<FilterOptionType[]>([]);
    // const [editingGradeItem, setEditingGradeItem] = useState<GradeOptionRequestType | null>(null);
    // const [locationData, setLocationData] = useState<FilterOptionType[]>([]);
    // const [editingLocationItem, setEditingLocationItem] = useState<LocationOptionRequestType | null>(null);
    // const [loading, setLoading] = useState(false);

    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [name, setName] = useState("");

    // const fetchSubjectData = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await adminApi.getSubjectOption(); 
    //         setSubjectData(res);
    //     } catch {
    //         message.error("Lỗi tải dữ liệu lớp học");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    // const fetchGradeData = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await adminApi.getGradeOption(); 
    //         setGradeData(res);
    //     } catch {
    //         message.error("Lỗi tải dữ liệu lớp học");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    // const fetchLocationData = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await adminApi.getLocationOption(); 
    //         setLocationData(res);
    //     } catch {
    //         message.error("Lỗi tải dữ liệu lớp học");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchSubjectData();
    // }, [subjectData]);

    // const handleSubjectAdd = () => {
    //     setEditingSubjectItem(null);
    //     setName("");
    //     setIsModalOpen(true);
    // };

    // const handleEdit = (item: FilterItem) => {
    //     setEditingItem(item);
    //     setName(item.name);
    //     setIsModalOpen(true);
    // };

    // // 💾 submit
    // const handleSubmit = async () => {
    //     if (!name.trim()) {
    //     message.warning("Không được để trống");
    //     return;
    //     }

    //     try {
    //         if (editingItem) {
    //             await adminApi.updateSubject(editingItem.id, { name });
    //             message.success("Cập nhật thành công");
    //     } else {
    //         await adminApi.createSubject({ name });
    //         message.success("Tạo mới thành công");
    //     }

    //     setIsModalOpen(false);
    //     fetchData();
    //     } catch {
    //     message.error("Thao tác thất bại");
    //     }
    // };

    // // 🗑️ delete
    // const handleDelete = async (id: number) => {
    //     try {
    //         await adminApi.deleteSubject(id);
    //         message.success("Xóa thành công");
    //         fetchData();
    //     } catch {
    //         message.error("Xóa thất bại");
    //     }
    // };

    // const columns = [
    //     {
    //     title: "ID",
    //     dataIndex: "id",
    //     width: 80,
    //     },
    //     {
    //     title: "Tên",
    //     dataIndex: "name",
    //     },
    //     {
    //     title: "Hành động",
    //     render: (_: any, record: FilterOptionType) => (
    //         <div style={{ display: "flex", gap: 8 }}>
    //         <Button onClick={() => handleEdit(record)}>Sửa</Button>

    //         <Popconfirm
    //             title="Xóa mục này?"
    //             onConfirm={() => handleDelete(record.id)}
    //         >
    //             <Button danger>Xóa</Button>
    //         </Popconfirm>
    //         </div>
    //     ),
    //     },
    // ];

    // return (
    //     <div className="filter-page">
    //     <div className="filter-header">
    //         <h2>Quản lý bộ lọc</h2>
    //         <Button type="primary" onClick={handleAdd}>
    //         Thêm mới
    //         </Button>
    //     </div>

    //     <Table
    //         dataSource={data}
    //         columns={columns}
    //         rowKey="id"
    //         loading={loading}
    //     />

    //     <Modal
    //         title={editingItem ? "Chỉnh sửa" : "Thêm mới"}
    //         open={isModalOpen}
    //         onCancel={() => setIsModalOpen(false)}
    //         onOk={handleSubmit}
    //     >
    //         <Input
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //         placeholder="Nhập tên..."
    //         />
    //     </Modal>
    //     </div>
    // );
    return (
        <>
            
        </>
    )
}

export default FilterOptionMana;