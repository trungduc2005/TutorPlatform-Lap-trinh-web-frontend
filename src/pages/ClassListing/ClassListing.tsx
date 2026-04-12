import ClassCard from "./ClassCard";
import ClassFilter from "./ClassFilter";
import "./ClassListing.css";
import { useClassListing } from "../../features/classes/hooks/useClassListing";
import type { SearchClassesParams } from "../../features/classes/api/classApi";
import { useState } from "react";

type PageToken = number | "ellipsis";

const getCompactPageTokens = (currentPage: number, totalPages: number): PageToken[] => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index);
    }

    const pages = new Set<number>([
        0,
        totalPages - 1,
        currentPage - 1,
        currentPage,
        currentPage + 1,
    ]);

    const sortedPages = Array.from(pages)
        .filter((page) => page >= 0 && page < totalPages)
        .sort((a, b) => a - b);

    const tokens: PageToken[] = [];

    sortedPages.forEach((page, index) => {
        if (index > 0) {
            const prevPage = sortedPages[index - 1];
            if (page - prevPage === 2) {
                tokens.push(prevPage + 1);
            } else if (page - prevPage > 2) {
                tokens.push("ellipsis");
            }
        }

        tokens.push(page);
    });

    return tokens;
};


function ClassListing(){
    const [params, setParams] = useState<SearchClassesParams>({
        subjectId: undefined,
        gradeId: undefined,
        minFee: undefined,
        maxFee: undefined,
        durationId: undefined,
        locationId: undefined,
        page: 0,
        size: 12,
    })

    const handleFilterChange = (filterParams: Partial<SearchClassesParams>) => {
        setParams(prev => ({
            ...prev,
            ...filterParams,
            page: 0 // Reset Page when filter applies
        }));
    };

    const {classes, loading, error, pagination} = useClassListing(params);

    const handlePageChange = (page: number) => {
        if (page < 0 || page >= pagination.totalPages || page === pagination.currentPage) {
            return;
        }

        setParams((prev) => ({
            ...prev,
            page,
        }));
    };

    const pageTokens = getCompactPageTokens(pagination.currentPage, pagination.totalPages);
    
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

            {pagination.totalPages > 0 && (
                <div className="listing-pagination" aria-label="Phân trang danh sách lớp">
                    <button
                        type="button"
                        className="page-item page-arrow"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 0}
                        aria-label="Trang trước"
                    >
                        &lt;
                    </button>

                    {pageTokens.map((token, index) => {
                        if (token === "ellipsis") {
                            return (
                                <span key={`ellipsis-${index}`} className="page-item page-ellipsis" aria-hidden="true">
                                    ...
                                </span>
                            );
                        }

                        const page = token;

                        return (
                            <button
                                key={page}
                                type="button"
                                className={`page-item ${page === pagination.currentPage ? "page-active" : ""}`}
                                onClick={() => handlePageChange(page)}
                                aria-label={`Trang ${page + 1}`}
                                aria-current={page === pagination.currentPage ? "page" : undefined}
                            >
                                {page + 1}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        className="page-item page-arrow"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage >= pagination.totalPages - 1}
                        aria-label="Trang sau"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
}

export default ClassListing;
