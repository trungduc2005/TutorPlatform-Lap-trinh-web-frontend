import ClassCard from "./ClassCard";
import ClassFilter from "./ClassFilter";
import "./ClassListing.css";
import { useClassListing } from "../../features/classes/hooks/useClassListing";
import type { SearchClassesParams } from "../../features/classes/api/classApi";
import { useState } from "react";


function ClassListing(){
    const [params, setParams] = useState<SearchClassesParams>({
        subjectId: undefined,
        gradeId: undefined,
        minFee: undefined,
        maxFee: undefined,
        durationId: undefined,
        locationId: undefined,
        page: 0
    })

    const handleFilterChange = (filterParams: Partial<SearchClassesParams>) => {
        setParams(prev => ({
            ...prev,
            ...filterParams,
            page: 0 // Reset Page when filter applies
        }));
    };

    const {classes, loading, error} = useClassListing(params);
    
    return (
        <div className="class-listing-container">
            <div className="listing-breadcrumb">Trang chủ / Danh sách lớp mới</div>

            <div className="listing-header">
                <h1>Danh sách lớp mới</h1>
                <div className="listing-meta">(Đang có {classes.length} lớp)</div>
            </div>

            <div className="listing-search-row">
                <input
                    className="listing-search-input"
                    placeholder="Tìm kiếm lớp gia sư ..."
                    aria-label="Tìm kiếm lớp"
                />
                <button className="listing-search-btn" type="button">Tìm kiếm</button>
            </div>

            <div className="class-layout">
                <div className="filter-section">
                    <ClassFilter onSearch={handleFilterChange} />
                </div>

                <div className="list-section">
                    {loading && <p className="listing-message">Đang tải danh sách lớp...</p>}
                    {error && <p className="listing-message listing-error">{error}</p>}
                    <div className="class-grid">
                        {!loading && !error && classes.map((item) => (
                            <ClassCard 
                                key={item.id}
                                {...item}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="listing-pagination" aria-hidden="true">
                <span className="page-item page-active">1</span>
                <span className="page-item">2</span>
                <span className="page-item">3</span>
            </div>
        </div>
    );
}

export default ClassListing;
