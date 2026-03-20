import {Card, Collapse, Select} from "antd";
import React from "react";
import "./ClassFilter.css"

const grades = [
    { value: "GRADE_1", label: "Lớp 1" },
    { value: "GRADE_2", label: "Lớp 2" },
    { value: "GRADE_3", label: "Lớp 3" },
    { value: "GRADE_4", label: "Lớp 4" },
    { value: "GRADE_5", label: "Lớp 5" },
    { value: "GRADE_6", label: "Lớp 6" },
    { value: "GRADE_7", label: "Lớp 7" },
    { value: "GRADE_8", label: "Lớp 8" },
    { value: "GRADE_9", label: "Lớp 9" },
    { value: "GRADE_10", label: "Lớp 10" },
    { value: "GRADE_11", label: "Lớp 11" },
    { value: "GRADE_12", label: "Lớp 12" },
]

const subjects = [
    { value: "TOAN", label: "Toán" },
    { value: "VAT_LY", label: "Vật Lý" },
    { value: "TIENG_ANH", label: "Tiếng Anh" },
    { value: "NGU_VAN", label: "Ngữ Văn" },
    { value: "HOA", label: "Hóa" },
    { value: "TIN_HOC", label: "Tin học" }
]

function ClassFilter({grade, setGrade}){
    const handleChange = (value) => setGrade(value);
    return (
        <Card title="Bộ lọc" className="class-filter-container">
            <Collapse ghost defaultActiveKey={["1", "2"]}>
                <Select
                options={grades}
                defaultValue={"All"}
                onChange={handleChange}
                allowClear
                style={{width: "100px", height: "30px"}}
                />
            </Collapse>
        </Card>
    )
}

export default ClassFilter;