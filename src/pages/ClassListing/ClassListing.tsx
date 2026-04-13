import { useState } from "react";
import type { SearchClassesParams } from "../../features/classes/api/classApi";
import { useClassListing } from "../../features/classes/hooks/useClassListing";
import ClassCard from "./ClassCard";
import ClassFilter from "./ClassFilter";
import "./ClassListing.css";

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

function ClassListing() {
    const [params, setParams] = useState<SearchClassesParams>({
        subjectId: undefined,
        gradeId: undefined,
        minFee: undefined,
        maxFee: undefined,
        durationId: undefined,
        locationId: undefined,
        page: 0,
        size: 12,
    });

    const handleFilterChange = (filterParams: Partial<SearchClassesParams>) => {
        setParams((prev) => ({
            ...prev,
            ...filterParams,
            page: 0,
        }));
    };

    const { classes, loading, error, pagination } = useClassListing(params);

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
    const hasData = !loading && !error && classes.length > 0;
    const isEmpty = !loading && !error && classes.length === 0;

    return (
        <section className="class-listing-container">
            <div className="class-listing-header">
                <h1 className="class-listing-title">Danh sách lớp mới</h1>
                <p className="class-listing-subtitle">
                    Khám phá các lớp phù hợp và kết nối với phụ huynh ngay hôm nay.
                </p>
                <div className="class-count-badge">
                    Hiện có {pagination.totalItems} lớp học
                </div>
            </div>

            <div className="class-layout">
                <aside className="filter-section">
                    <ClassFilter onSearch={handleFilterChange} />
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
                                <ClassCard key={item.id} {...item} />
                            ))}
                        </div>
                    ) : null}
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
                                <span
                                    key={`ellipsis-${index}`}
                                    className="page-item page-ellipsis"
                                    aria-hidden="true"
                                >
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
        </section>
    );
}

export default ClassListing;