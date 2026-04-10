import { DollarOutlined, EnvironmentOutlined, TeamOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import type { ClassItem } from "../../features/classes/model/classTypes";
import "./ClassCard.css";

function getSubjectDecor(subjectName: string) {
    const normalized = subjectName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (normalized.includes("toan")) {
        return { icon: "📐", label: "Math icon", tone: "math" };
    }
    if (normalized.includes("ly") || normalized.includes("vat ly")) {
        return { icon: "⚛️", label: "Physics icon", tone: "physics" };
    }
    if (normalized.includes("hoa") || normalized.includes("hoa hoc")) {
        return { icon: "🧪", label: "Chemistry icon", tone: "science" };
    }
    if (normalized.includes("sinh") || normalized.includes("sinh hoc")) {
        return { icon: "🧬", label: "Biology icon", tone: "science" };
    }
    if (normalized.includes("anh") || normalized.includes("english")) {
        return { icon: "🕰️", label: "English icon", tone: "language" };
    }
    if (normalized.includes("van") || normalized.includes("ngu van")) {
        return { icon: "🖋️", label: "Literature icon", tone: "language" };
    }
    if (normalized.includes("su") || normalized.includes("lich su")) {
        return { icon: "🏛️", label: "History icon", tone: "social" };
    }
    if (normalized.includes("dia") || normalized.includes("dia ly")) {
        return { icon: "🗺️", label: "Geography icon", tone: "social" };
    }
    if (normalized.includes("tin") || normalized.includes("tin hoc") || normalized.includes("it")) {
        return { icon: "💻", label: "Informatics icon", tone: "tech" };
    }
    if (normalized.includes("gdcd") || normalized.includes("cong dan")) {
        return { icon: "⚖️", label: "Civics icon", tone: "social" };
    }

    return { icon: "📘", label: "Subject icon", tone: "default" };
}

function ClassCard(props: ClassItem) {
    const navigate = useNavigate();
    const classId = `E${props.id.toString().padStart(5, "0")}`;
    const subjectDecor = getSubjectDecor(props.subjectName || "");

    const handleViewDetail = () => {
        navigate(`/class/${props.id}`);
    };

    return (
        <article className="class-card-container">
            <div
                className={`class-subject-decor class-subject-decor-${subjectDecor.tone}`}
                aria-label={subjectDecor.label}
            >
                <span>{subjectDecor.icon}</span>
            </div>

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
