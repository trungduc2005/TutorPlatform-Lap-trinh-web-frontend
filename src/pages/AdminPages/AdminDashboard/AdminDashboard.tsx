import { useEffect, useState } from "react";
import type { StatisticsItem } from "../../../features/admin/model/statisticsType";
import { adminApi } from "../../../features/admin/api/adminApi";
import { Statistic } from "antd";
import StatisticsChart from "./StatisticChart";

export default function AdminDashboard() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const currentItem = "subject";
    const [statItem, setStatItem] = useState<string>(currentItem);

    const [year, setYear] = useState<number>(currentYear);
    const [statistics, setStatistics] = useState<StatisticsItem[]>([]);

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(parseInt(e.target.value));
    };

    const handleStatItemChange = (item: string) => {
        setStatItem(item);
    }
    
    useEffect(() =>{
        const fetchData = async () => {
            try{
                let res;
                if(statItem === "subject"){
                    res = await adminApi.getSubjectStats(year);
                }
                else if(statItem === "grade"){
                    res = await adminApi.getGradeStats(year);
                }
                else{
                    res = await adminApi.getLocationStats(year);
                }
                setStatistics(res);
            }
            catch(error) {
                console.error("Failed to fetch statistics: ", error);  
            }
        }
        fetchData();
    }, [year, statItem]);
    
    return (
        <div
            style={{
                minHeight: "80vh",
                background: "#f5f7fb",
                padding: "24px",
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                        flexWrap: "wrap",
                        gap: 12,
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 32,
                                fontWeight: 700,
                                color: "#1f2d3d",
                            }}
                        >
                            Admin Dashboard
                        </h2>
                        <p
                            style={{
                                marginTop: 8,
                                color: "#6b7280",
                                fontSize: 15,
                            }}
                        >
                            Theo dõi số lớp và doanh thu theo {statItem === "subject" ? "môn học" : statItem === "grade" ? "khối lớp" : "khu vực" }
                        </p>
                    </div>

                    <div
                        style={{
                            background: "#fff",
                            padding:"12px 16px",
                            borderRadius: 12,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        }}
                    >
                        <label 
                            htmlFor="item-select"
                            style={{
                                marginRight: 10,
                                fontWeight: 600,
                                color: "#374251",
                            }}>
                            Chọn Loại thống kê:
                        </label>
                        <select 
                            id="item-select"
                            value={statItem}
                            onChange={(e) => handleStatItemChange(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                borderRadius: 9,
                                border: "1px solid #d1d5db",
                                fontSize: 14,
                                outline: "none",
                                cursor: "pointer",
                            }}
                        >
                            <option value='subject'> Môn học</option>
                            <option value='grade'> Khối lớp</option>
                            <option value='location'> Khu vực</option>
                        </select>
                    </div>

                    <div
                        style={{
                            background: "#fff",
                            padding: "12px 16px",
                            borderRadius: 12,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        }}
                    >
                        <label
                            htmlFor="year-select"
                            style={{
                                marginRight: 10,
                                fontWeight: 600,
                                color: "#374151",
                            }}
                        >
                            Chọn năm:
                        </label>
                        <select
                            id="year-select"
                            value={year}
                            onChange={handleYearChange}
                            style={{
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "1px solid #d1d5db",
                                fontSize: 14,
                                outline: "none",
                                cursor: "pointer",
                            }}
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <StatisticsChart
                    title={`Thống kê theo môn học năm ${year}`}
                    data={statistics}
                />
            </div>
        </div>
    )
}
