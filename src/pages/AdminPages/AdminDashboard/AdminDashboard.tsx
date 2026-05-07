import { useEffect, useState } from "react";
import { message } from "antd";

import type {
    StatisticsItemType,
    TutorStatItemType,
} from "../../../features/admin/model/statisticsType";

import { adminApi } from "../../../features/admin/api/adminApi";

import StatisticsChart from "./StatisticChart";
import TutorStatisticsChart from "./TutorStatisticsChart";

export default function AdminDashboard() {

    const currentYear = new Date().getFullYear();

    const years = Array.from(
        { length: 5 },
        (_, i) => currentYear - i
    );

    const [statItem, setStatItem] = useState<string>("subject");

    const [year, setYear] = useState<number>(currentYear);

    const [statistics, setStatistics] = useState<StatisticsItemType[]>([]);

    const [tutorStatistics, setTutorStatistics] = useState<TutorStatItemType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);

                if (statItem === "tutor") {

                    const tutorRes =
                        await adminApi.getTutorStats(year);
                    setTutorStatistics(tutorRes);
                    message.success("Lấy thống kê gia sư thành công.")
                    return;
                }

                let res;
                if (statItem === "subject") {
                    res = await adminApi.getSubjectStats(year);
                    message.success("Lấy thống kê theo môn học thành công.")
                }
                else if (statItem === "grade") {
                    res = await adminApi.getGradeStats(year);
                    message.success("Lấy thống kê theo lớp học thành công.")
                }
                else {
                    res = await adminApi.getLocationStats(year);
                    message.success("Lấy thống kê theo khu vực thành công.")
                }
                setStatistics(res);

            }
            catch (error) {
                console.error(error);
                message.error("Không thể tải thống kê");
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [year, statItem]);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "24px",
            }}
        >
            <div
                style={{
                    maxWidth: 1400,
                    margin: "0 auto",
                }}
            >

                {/* HEADER */}
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
                                color: "#1f2937",
                            }}
                        >
                            Admin Dashboard
                        </h2>

                        <p
                            style={{
                                marginTop: 8,
                                color: "#6b7280",
                            }}
                        >
                            Theo dõi thống kê hệ thống
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap",
                        }}
                    >

                        {/* SELECT THỐNG KÊ */}
                        <div
                            style={{
                                background: "#fff",
                                padding: "12px 16px",
                                borderRadius: 12,
                                boxShadow:
                                    "0 4px 12px rgba(0,0,0,0.06)",
                            }}
                        >
                            <label
                                style={{
                                    marginRight: 10,
                                    fontWeight: 600,
                                }}
                            >
                                Loại thống kê:
                            </label>

                            <select
                                value={statItem}
                                onChange={(e) =>
                                    setStatItem(e.target.value)
                                }
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #d1d5db",
                                }}
                            >
                                <option value="subject">
                                    Môn học
                                </option>

                                <option value="grade">
                                    Khối lớp
                                </option>

                                <option value="location">
                                    Khu vực
                                </option>

                                <option value="tutor">
                                    Gia sư
                                </option>
                            </select>
                        </div>

                        {/* CHỌN NĂM */}
      
                        <div
                            style={{
                                background: "#fff",
                                padding: "12px 16px",
                                borderRadius: 12,
                                boxShadow:
                                    "0 4px 12px rgba(0,0,0,0.06)",
                            }}
                        >
                            <label
                                style={{
                                    marginRight: 10,
                                    fontWeight: 600,
                                }}
                            >
                                Năm:
                            </label>

                            <select
                                value={year}
                                onChange={(e) =>
                                    setYear(
                                        parseInt(e.target.value)
                                    )
                                }
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border:
                                        "1px solid #d1d5db",
                                }}
                            >
                                {years.map((y) => (
                                    <option
                                        key={y}
                                        value={y}
                                    >
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: 30,
                        }}
                    >
                        Đang tải dữ liệu...
                    </div>
                )}

                {/* CHART */}
                {!loading && statItem !== "tutor" && (
                    <StatisticsChart
                        title={
                            statItem === "subject"
                                ? `Thống kê theo môn học năm ${year}`
                                : statItem === "grade"
                                    ? `Thống kê theo khối lớp năm ${year}`
                                    : `Thống kê theo khu vực năm ${year}`
                        }
                        data={statistics}
                    />
                )}

                {/* TUTOR CHART */}
                {!loading && statItem === "tutor" && (
                    <TutorStatisticsChart
                        title={`Thống kế số lượng lớp gia sư đã nhận năm ${year}`}
                        data={tutorStatistics}
                    />
                )}
            </div>
        </div>
    );
}