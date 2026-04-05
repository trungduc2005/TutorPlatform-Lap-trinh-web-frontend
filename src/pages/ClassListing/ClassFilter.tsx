import {Form, Button, Select, Slider} from "antd";
import "./ClassFilter.css"
import type { SearchClassesParams } from "../../features/classes/api/classApi";

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

const durationOptions = [
    { label: '1h/buổi', value: '1' },
    { label: '1.5h/buổi', value: '1.5' },
    { label: '2h/buổi', value: '2' },
    { label: '2.5h/buổi', value: '2.5' },
];

const locationOptions = [
    'Ba Đình',
    'Hoàn Kiếm',
    'Tây Hồ',
    'Long Biên',
    'Cầu Giấy',
    'Đống Đa',
    'Hai Bà Trưng',
    'Hoàng Mai',
    'Thanh Xuân',
    'Hà Đông',
    'Nam Từ Liêm',
    'Bắc Từ Liêm',
].map(item => ({ label: item, value: item }));

type FilterValues = {
    subject?: string;
    gradeLevel?: string;
    fee?: [number, number];
    duration?: string;
    location?: string;
}

type ClassFilterProps = {
    onSearch: (params: SearchClassesParams) => void
}


function ClassFilter({onSearch}: ClassFilterProps){
    const [form] = Form.useForm<FilterValues>();

    const onFinish = (values: FilterValues) => {
        const params = {
            subject: values.subject || "",
            gradeLevel: values.gradeLevel,
            minFee: values.fee?.[0],
            maxFee: values.fee?.[1],
            duration: values.duration,
            location: values.location,
        };
        onSearch(params)
        console.log(params)
    }

    const onReset = () => {
        form.resetFields();

        onSearch({
            subject: "",
            gradeLevel: undefined,
            minFee: undefined,
            maxFee: undefined,
            duration: undefined,
            location: undefined,
        });
    };

    return (
        <Form
            className="class-filter-form"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{fee: [0, 5000000]}}
        >
            <div className="filter-fields">
                <Form.Item name="subject" label="Môn học">
                    <Select allowClear placeholder="Chọn môn" options={subjects} />
                </Form.Item>

                <Form.Item name="gradeLevel" label="Khối">
                    <Select allowClear placeholder="Chọn khối" options={grades} />
                </Form.Item>

                <Form.Item name="duration" label="Thời lượng">
                    <Select allowClear placeholder="Chọn thời lượng" options={durationOptions} />
                </Form.Item>

                <Form.Item name="location" label="Địa điểm">
                    <Select allowClear placeholder="Chọn địa điểm" options={locationOptions} />
                </Form.Item>
            </div>

            <div className="fee-filter">
                <Form.Item name="fee" label="Học phí">
                    <Slider range min={0} max={5000000} step={100000} />
                </Form.Item>
            </div>

            <div className="filter-actions">
                <Button type="primary" htmlType="submit">
                    Lọc
                </Button>
                <Button onClick={onReset}>Xóa lọc</Button>
            </div>
        </Form>
    )
}

export default ClassFilter;
