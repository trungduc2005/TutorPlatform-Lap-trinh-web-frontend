import { DollarOutlined, EnvironmentOutlined, TeamOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import type { ClassItem } from "../../features/classes/model/classTypes";
import "./ClassCard.css";

function ClassCard(props: ClassItem) {
    const navigate = useNavigate();
    const classId = `E${props.id.toString().padStart(5, "0")}`;

    const handleViewDetail = () => {
        navigate(`/class/${props.id}`);
    };

    return (
        <article className="class-card-container">
            <div className="class-card-top">
                <span className="class-id">{classId}</span>
            </div>

            <h3 className="class-card-title">{props.subjectName} - {props.gradeName}</h3>

            <div className="class-info-row">
                <EnvironmentOutlined className="info-icon"></EnvironmentOutlined>
                <span className="class-info-text">{props.locationName}</span>
            </div>

            <div className="class-info-row">
                <DollarOutlined className="info-icon"></DollarOutlined>
                <span className="class-info-text">
                    Học phí: {Math.floor(props.fee).toLocaleString("vi-VN")}đ / {props.durationName}
                </span>
            </div>

            <div className="class-info-row">
                <TeamOutlined className="info-icon"></TeamOutlined>
                <span className="class-info-text">
                    Yêu cầu: {props.requirements?.trim() ? props.requirements : "Không có"}
                </span>
            </div>

            <Button type="primary" className="more-detail-btn" onClick={handleViewDetail}>
                Xem chi tiết
            </Button>
        </article>
    );
}

export default ClassCard;