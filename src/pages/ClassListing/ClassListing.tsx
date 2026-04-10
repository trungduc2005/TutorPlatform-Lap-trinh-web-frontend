import { useState } from "react";
import type { SearchClassesParams } from "../../features/classes/api/classApi";
import { useClassListing } from "../../features/classes/hooks/useClassListing";
import ClassCard from "./ClassCard";
import ClassFilter from "./ClassFilter";
import "./ClassListing.css";

function ClassListing() {
    const [params, setParams] = useState<SearchClassesParams>({
        subject: "",
        gradeLevel: undefined,
        minFee: undefined,
        maxFee: undefined,
        duration: undefined,
        location: undefined,
        page: 0,
    });

    const { classes, loading, error } = useClassListing(params);
    const hasData = !loading && !error && classes.length > 0;
    const isEmpty = !loading && !error && classes.length === 0;

    return (
        <section className="class-listing-container">
            <div className="class-listing-header">
                <h1 className="class-listing-title">Danh sách lớp mới</h1>
                <p className="class-listing-subtitle">
                    Khám phá các lớp phù hợp và kết nối với phụ huynh ngay hôm nay.
                </p>
                <div className="class-count-badge">Hiện có {classes.length} lớp học</div>
            </div>

            <div className="class-layout">
                <aside className="filter-section">
                    <ClassFilter onSearch={setParams}></ClassFilter>
                </aside>

                <div className="list-section">
                    {loading ? <div className="class-feedback">Đang tải danh sách lớp...</div> : null}

                    {error ? <div className="class-feedback class-feedback--error">{error}</div> : null}

                    {isEmpty ? (
                        <div className="class-feedback class-feedback--empty">
                            Chưa có lớp phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh tiêu chí nhé.
                        </div>
                    ) : null}

                    {hasData ? (
                        <div className="class-grid">
                            {classes.map((item) => (
                                <ClassCard
                                    key={item.id}
                                    {...item}
                                ></ClassCard>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default ClassListing;
