import ClassCard from "./ClassCard";
import ClassFilter from "./ClassFilter";
import "./ClassListing.css";
import { useClassListing } from "../../features/classes/hooks/useClassListing";
import type { SearchClassesParams } from "../../features/classes/api/classApi";
import { useState } from "react";


function ClassListing(){
    const [params, setParams] = useState<SearchClassesParams>({
        subject: "",
        gradeLevel: undefined,
        minFee: undefined,
        maxFee: undefined,
        duration: undefined,
        location: undefined,
        page: 0
    })

    const {classes, loading, error} = useClassListing(params);
    
    return (
        <div className="class-listing-container">
            <h1>Danh sách lớp mới</h1>
            <p>Hiện có {classes.length} lớp học</p>

            <div className="class-layout">
                <div className="filter-section">
                    <ClassFilter onSearch={setParams}></ClassFilter>
                </div>

                <div className="list-section">
                    {loading && <p>Đang tải danh sách lớp...</p>}
                    {error && <p style={{color:'red'}}>{error}</p>}
                    <div className="class-grid">
                        {!loading && !error && classes.map((item) => (
                            <ClassCard 
                                key={item.id}
                                id={item.id}
                                subject={item.subject}
                                gradeLevel={item.gradeLevel}
                                fee={item.fee}
                                duration={item.duration}
                                location={item.location}
                            ></ClassCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClassListing;
