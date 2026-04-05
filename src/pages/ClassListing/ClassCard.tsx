import { EnvironmentOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import "./ClassCard.css"


function ClassCard(props: ClassCardProps){
    let gradeSplit = props.gradeLevel.split("_");
    let grade: string = "Lớp " + gradeSplit[1];
    let classId = "E" + props.id.toString().padStart(5, "0")

    return (
        <div className='class-card-container'>
            <span className='class-id'>{classId}</span>
            <p className='class-card-title'>{props.subject} -  {grade}</p>
            <div>
                <EnvironmentOutlined className='infor-icon'></EnvironmentOutlined> 
                <span className='class-infor'>{" "}{props.location}</span>
            </div>
            <div>
                <DollarOutlined className='infor-icon'></DollarOutlined>
                <span className='class-infor'>
                    <span>{Math.floor(props.fee)}</span>
                    <span>{"/"+props.duration}</span>
                </span>
            </div>
            <div>
                <TeamOutlined className='infor-icon'></TeamOutlined>
                <span className='class-infor'>{"Yêu cầu: "}</span>
            </div>
            <Button type='primary' className="more-detail-btn">Xem chi tiết {">"}</Button>
        </div>
    )
}

type ClassCardProps = {
    id: number,
    subject: string,
    gradeLevel: string,
    fee: number,
    duration: string,
    location: string
}

export default ClassCard;