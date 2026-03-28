import { useEffect, useState } from "react";
import { adminApi } from "../../../features/admin/api/adminApi";
import type { UnregisteredClassType } from "../../../features/admin/model/statisticsType";
import "./UnregisteredClassMana.css";
import { Card } from "antd";

const formatCurrency = (value: number) => 
    new Intl.NumberFormat("vi-VN").format(value) + "đ"; 

export default function UnregisteredClassMana() {
    
    const [keyword, setKeyword] = useState("");
    const [subject, setSubject] = useState("");
    const [grade, setGrade] = useState("");
    const [location, setLocation] = useState("");
    const [duration, setDuration] = useState("");
    const [locationCity, setLocationCity] = useState("");


    const [classes, setClasses] = useState<UnregisteredClassType[]>([]); 
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalClass, setTotalClass] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false); 


    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const res = await adminApi.getUnregisteredClasses(currentPage, pageSize);
                
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
    }, [currentPage, pageSize]);

    return (
        <div className="unregistered-class-mana-page">
            <div className="unregistered-class-mana-page__header">
                <h1>Danh sách lớp học</h1>
                <p>Đang có: {totalClass} lớp</p>
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
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
                            
                                <button>Xem chi tiết</button>
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
        </div>
    )
}