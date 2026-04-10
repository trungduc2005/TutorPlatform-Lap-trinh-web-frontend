import { EnvironmentOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import "./ClassCard.css"
import type { ClassItem } from '../../features/classes/model/classTypes';

function ClassCard(props: ClassItem){
    const navigate = useNavigate();
    const classId = "E" + props.id.toString().padStart(5, "0");

    const handleViewDetail = () => {
        navigate(`/class/${props.id}`);
    };

    return (
        <div className='class-card-container'>
            <span className='class-id'>{classId}</span>
            <p className='class-card-title'>{props.subjectName} - {props.gradeName}</p>
            <div>
                <EnvironmentOutlined className='infor-icon'></EnvironmentOutlined> 
                <span className='class-infor'>{" "}{props.locationName}</span>
            </div>
            <div>
                <DollarOutlined className='infor-icon'></DollarOutlined>
                <span className='class-infor'>
                    <span>{Math.floor(props.fee)}</span>
                    <span>{"/"+props.durationName}</span>
                </span>
            </div>
            <div>
                <TeamOutlined className='infor-icon'></TeamOutlined>
                <span className='class-infor'>{"Yêu cầu: "}</span>
            </div>
            <Button type='primary' className="more-detail-btn" onClick={handleViewDetail}>Xem chi tiết {">"}</Button>
        </div>
    )
}

export default ClassCard;