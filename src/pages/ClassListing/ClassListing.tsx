import ClassCard from "./ClassCard";
import ClassFilter from "./ClassFilter";
import "./ClassListing.css";
import { useClassListing } from "./useClassListing";
import { SearchClassesParams } from "../../features/classes/api/classApi";
import { useMemo, useState } from "react";


function ClassListing(){
    const [grade, setGrade] = useState<string | undefined>(undefined);

    const params: SearchClassesParams = useMemo(
        () => ({
            subject: "",
            gradeLevel: grade,
        }),
        [grade]
    );

    const {classes, loading, error} = useClassListing(params);
    
    return (
        <div className="class-listing-container">
            <h1>Danh sách lớp mới</h1>
            <p>Hiện có {classes.length} lớp học</p>

            <div className="class-layout">
                <div className="filter-section">
                    <ClassFilter grade={grade} setGrade={setGrade}></ClassFilter>
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
