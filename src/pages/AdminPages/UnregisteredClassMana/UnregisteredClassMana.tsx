import { useEffect, useState } from "react";
import { adminApi } from "../../../features/admin/api/adminApi";
import type { FilterOptionType, UnregisteredClassType } from "../../../features/admin/model/statisticsType";
import "./UnregisteredClassMana.css";
import { Card, Empty, message, Modal, Select } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const formatCurrency = (value: number) => 
    new Intl.NumberFormat("vi-VN").format(value) + "đ"; 

export default function UnregisteredClassMana() {
    const [subjects, setSubjects] = useState<FilterOptionType[]>([]);
    const [grades, setGrades] = useState<FilterOptionType[]>([]);   
    const [locations, setLocations] = useState<FilterOptionType[]>([]);

    const [subjectId, setSubjectId] = useState<number | undefined>(undefined);
    const [gradeId, setGradeId] = useState<number | undefined>(undefined);
    const [locationId, setLocationId] = useState<number | undefined>(undefined);

    const [isModalOpen, setIsMocalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<UnregisteredClassType | null>(null);

    const [classes, setClasses] = useState<UnregisteredClassType[]>([]); 
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalClass, setTotalClass] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false); 
    
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [subjectRes, gradeRes, locationRes] = await Promise.all([
                    adminApi.getSubjectOption(),
                    adminApi.getGradeOption(),
                    adminApi.getLocationOption()
                ])
                setSubjects(subjectRes || []);
                setGrades(gradeRes || []);
                setLocations(locationRes || []);
                console.log("Filter Options: ", {subjectRes, gradeRes, locationRes});
            }
            catch (error) {
                console.log("Failed to fetch filter options", error);
            }
        }
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const res = await adminApi.getUnregisteredClasses(
                    currentPage, 
                    pageSize,
                    subjectId,
                    gradeId,
                    locationId);
                
                setClasses(res.items || [])
                setTotalClass(res.totalItems || 0);
                setTotalPages(res.totalPages || 0);
                console.log("Unregistered Classes: ", res);
            }
            catch (error) {
                console.log("Failed to fetch unregisterd class", error);
            }
            finally{
                setLoading(false);
            }
        }
        fetchClassData();
    }, [currentPage, pageSize, subjectId, gradeId, locationId, loading]);

    const deleteUnregisteredClass = async (classId: number | null) => {
        if(!classId) return;

        try {
            const res = await adminApi.deleteUnregisteredClass(classId);
            console.log("Delete class response: ", res);
            setLoading(true);
            message.success("Xóa lớp học thành công");
            handleModalDeleteClose();
        }
        catch(error) {
            console.log("Failed to delete class: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectChange = (value: number | undefined) => {
        setSubjectId(value);
        setCurrentPage(0);
    };

    const handleGradeChange = (value: number | undefined) => {
        setGradeId(value);
        setCurrentPage(0);
    };  

    const handleLocationChange = (value: number | undefined) => {
        setLocationId(value);
        setCurrentPage(0);
    }

    const handleClearFilters = () => {
        setSubjectId(undefined);
        setGradeId(undefined);
        setLocationId(undefined);
        setCurrentPage(0);
    };

    const handleModalOpen = (item: UnregisteredClassType) => {
        setIsMocalOpen(true);
        setSelectedClass(item);
    };
    const handleModalClose = () => {
        setIsMocalOpen(false);
        setSelectedClass(null);
    };

    const handleModalDeleteOpen = (item: UnregisteredClassType) => {
        setIsModalDeleteOpen(true);
        setSelectedClass(item);
    }

    const handleModalDeleteClose = () => {
        setIsModalDeleteOpen(false);
        setSelectedClass(null);
    }

    return (
        <div className="unregistered-class-mana-page">
            <div className="unregistered-class-mana-page__header">
                <h1>Danh sách lớp học</h1>
                <p>Đang có: {totalClass} lớp</p>
            </div>

            <div className="unregistered-class-mana-filters">
                <Select
                    placeholder="Chọn môn học"
                    allowClear
                    value={subjectId}
                    onChange={handleSubjectChange}
                    className="filter-select"
                    options={subjects.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }))}
                />

                <Select
                    placeholder="Chọn lớp"
                    allowClear
                    value={gradeId}
                    onChange={handleGradeChange}
                    className="filter-select"
                    options={grades.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }))}
                />

                <Select
                    placeholder="Chọn khu vực"
                    allowClear
                    value={locationId}
                    onChange={handleLocationChange}
                    className="filter-select"
                    options={locations.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }))}
                />

                <button
                    type="button"
                    className="clear-filter-btn"
                    onClick={handleClearFilters}
                >
                    Xóa bộ lọc
                </button>
                <ReloadOutlined 
                    onClick={() => setLoading(true)}
                    style={{border: "1px solid", borderRadius: "50%", padding: "4px", fontSize: "18px", cursor: "pointer", background: "white"}}
                />
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) :
                (classes.length === 0) ? (
                    <Empty description="Không có dữ liệu lớp học" />
                )
            : (
                <>
                    <div className="unregistered-class-mana-grid">
                        {classes.map((item) => (
                            <Card key={item.id} className="unregistered-class-card">
                                <div className="unregistered-class-card__code">
                                    E{String(item.id).padStart(4, "0")}
                                </div>
                                <h3>
                                    {item.subjectName} - {item.gradeName}
                                </h3>
                                <p>📍  {item.locationCity}</p>
                                <p>$  {formatCurrency(item.fee)}, {item.durationName}</p>
                                <p>🎓 {item.requirements}</p>
                                <p>Người tạo: {item.createdByName}</p>
                                
                                <div className="card-button">
                                    <div>
                                        <button 
                                        onClick={() => handleModalOpen(item)}
                                        style={{marginTop: "auto"}}
                                        >Xem chi tiết</button>
                                    </div>
                                    <div>
                                        <button
                                            onClick = {() => handleModalDeleteOpen(item)}
                                            style={{background: "#ff4d4f", color: "white", borderRadius: "2px", marginTop: "auto"}}
                                        >
                                                Xóa Lớp
                                    </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            {"<"}
                        </button>

                        {Array.from({length: totalPages}, (_, i) => (
                            <button
                                key={i}
                                className = {currentPage === i ? "active" : ""}
                                onClick={() => setCurrentPage(i)}
                            >
                                {i+1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages - 1}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            {">"}
                        </button>
                    </div>
                </>
                )
            }

            <Modal
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                centered
                width={650}
                className="class-detail-modal"
            >
                {selectedClass && (
                    <div className="unregistered-class-detail-content">
                        <div className="class-detail__header">
                            <div className="class-detail__code">
                                E{String(selectedClass.id).padStart(4, "0")}
                            </div>
                            <h2>
                                {selectedClass.subjectName} - {selectedClass.gradeName}
                            </h2>
                            <div className="class-detail__grid">
                                <div className="class-detail__item">
                                    <span className="label">Môn học</span>
                                    <span className="value">{selectedClass.subjectName}</span>
                                </div>
                                <div className="class-detail__item">
                                    <span className="label">Lớp</span>
                                    <span className="value">{selectedClass.gradeName}</span>
                                </div>
                                <div className="class-detail__item">
                                    <span className="label">Khu vực</span>
                                    <span className="value">{selectedClass.locationName}, {selectedClass.locationCity}</span>
                                </div>
                                <div className="class-detail__item">
                                    <span className="label">Thời lượng</span>
                                    <span className="value">{selectedClass.durationName} - {selectedClass.durationMinutes} phút</span>
                                </div>
                                <div className="class-detail__item">
                                    <span className="label">Học phí</span>
                                    <span className="value">{formatCurrency(selectedClass.fee)}/tháng</span>
                                </div>

                                <div className="class-detail__item">
                                    <span className="label">Người tạo</span>
                                    <span className="value">{selectedClass.createdByName}</span>
                                </div>
                                <div className="class-detail__item">
                                    <span className="label">Giới tính học viên</span>
                                    <span className="value">{(selectedClass.studentGender == "MALE") ? "Nam" : "Nữ"}</span>
                                </div>

                                <div className="class-detail__item">
                                    <span className="label">Học lực học viên</span>
                                    <span className="value">{selectedClass.studentDescription}</span>
                                </div>
                            </div>
                            <div className="class-detail__section">
                                <h3>Yêu cầu</h3>
                                <p>{selectedClass.requirements || "Không có yêu cầu"}</p>
                            </div>

                            <div className="class-detail__section">
                                <h3>Ghi chú</h3>
                                <p>{selectedClass.note || "Không có ghi chú"}</p>
                            </div>

                            <div className="class-detail__actions">
                                <button
                                    type="button"
                                    className="class-detail__close-btn"
                                    onClick={handleModalClose}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
            <Modal
                open={isModalDeleteOpen}
                onCancel={() => setIsModalDeleteOpen(false)}
                footer={null}
                centered
            >
                {selectedClass && (
                    <div
                        className="modal-delete"
                    >
                        <div className="modal-delete__content">
                            Bạn có chắc chắn muốn xóa lớp học {" "}
                            <b>E{String(selectedClass.id).padStart(4, "0")}</b> 
                        </div>
                        <div className="modal-delete__actions">
                            <button 
                                className="btn btn-cancel"
                                onClick={() => handleModalDeleteClose()}>
                                Hủy
                            </button>
                            <button 
                                className="btn btn-danger"
                                onClick={() => {deleteUnregisteredClass(selectedClass.id); setLoading(true); setIsModalDeleteOpen(false)}}>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}