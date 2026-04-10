import { Button, Form, Input, InputNumber, Radio, Select, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
    createHirerClass,
    getDurationOptions,
    getGradeOptions,
    getLocationOptions,
    getSubjectOptions,
    type FilterOption,
} from "../../features/classes/api/classApi";
import "./HireTutor.css";

type HireTutorFormValues = {
    subjectId?: number;
    gradeId?: number;
    locationId?: number;
    durationId?: number;
    fee?: number;
    requirements?: string;
    note?: string;
    studentGender?: "MALE" | "FEMALE" | "OTHER";
    studentDescription?: string;
};

const fallbackDurationOptions: FilterOption[] = [
    { id: 1, name: "60 phút" },
    { id: 2, name: "90 phút" },
    { id: 3, name: "120 phút" },
    { id: 4, name: "150 phút" },
];

function HireTutor() {
    const [form] = Form.useForm<HireTutorFormValues>();
    const [submitting, setSubmitting] = useState(false);

    const [subjects, setSubjects] = useState<FilterOption[]>([]);
    const [grades, setGrades] = useState<FilterOption[]>([]);
    const [locations, setLocations] = useState<FilterOption[]>([]);
    const [durations, setDurations] = useState<FilterOption[]>([]);

    const durationOptions = useMemo(
        () => (durations.length > 0 ? durations : fallbackDurationOptions),
        [durations]
    );

    useEffect(() => {
        const loadOptions = async () => {
            const [subjectRes, gradeRes, locationRes, durationRes] = await Promise.allSettled([
                getSubjectOptions(),
                getGradeOptions(),
                getLocationOptions(),
                getDurationOptions(),
            ]);

            if (subjectRes.status === "fulfilled") {
                setSubjects(subjectRes.value);
            }
            if (gradeRes.status === "fulfilled") {
                setGrades(gradeRes.value);
            }
            if (locationRes.status === "fulfilled") {
                setLocations(locationRes.value);
            }
            if (durationRes.status === "fulfilled") {
                setDurations(durationRes.value);
            }
        };

        void loadOptions();
    }, []);

    const handleSubmit = async (values: HireTutorFormValues) => {
        if (
            values.subjectId === undefined ||
            values.gradeId === undefined ||
            values.locationId === undefined ||
            values.durationId === undefined ||
            values.fee === undefined ||
            !values.requirements ||
            !values.note ||
            !values.studentGender ||
            !values.studentDescription
        ) {
            message.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        try {
            setSubmitting(true);
            await createHirerClass({
                subjectId: values.subjectId,
                gradeId: values.gradeId,
                locationId: values.locationId,
                durationId: values.durationId,
                fee: values.fee,
                requirements: values.requirements.trim(),
                note: values.note.trim(),
                studentGender: values.studentGender,
                studentDescription: values.studentDescription.trim(),
            });

            message.success("Đăng ký thuê gia sư thành công");
            form.resetFields();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Không thể tạo lớp";
            message.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="hire-tutor-page">
            <div className="hire-tutor-card">
                <h1>Đăng ký thuê gia sư</h1>

                <Form
                    form={form}
                    layout="vertical"
                    className="hire-tutor-form"
                    onFinish={handleSubmit}
                    initialValues={{ studentGender: "OTHER" }}
                >
                    <Form.Item label="Giới tính học sinh" name="studentGender" rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}>
                        <Radio.Group>
                            <Radio value="MALE">Nam</Radio>
                            <Radio value="FEMALE">Nữ</Radio>
                            <Radio value="OTHER">Khác</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <div className="hire-tutor-form-grid">
                        <Form.Item label="Môn học" name="subjectId" rules={[{ required: true, message: "Vui lòng chọn môn học" }]}>
                            <Select
                                placeholder="Chọn môn học"
                                options={subjects.map((item) => ({ label: item.name, value: item.id }))}
                            />
                        </Form.Item>

                        <Form.Item label="Khối/Lớp" name="gradeId" rules={[{ required: true, message: "Vui lòng chọn khối/lớp" }]}>
                            <Select
                                placeholder="Chọn khối/lớp"
                                options={grades.map((item) => ({ label: item.name, value: item.id }))}
                            />
                        </Form.Item>

                        <Form.Item label="Khu vực" name="locationId" rules={[{ required: true, message: "Vui lòng chọn khu vực" }]}>
                            <Select
                                placeholder="Chọn khu vực"
                                options={locations.map((item) => ({ label: item.name, value: item.id }))}
                            />
                        </Form.Item>

                        <Form.Item label="Thời lượng" name="durationId" rules={[{ required: true, message: "Vui lòng chọn thời lượng" }]}>
                            <Select
                                placeholder="Chọn thời lượng"
                                options={durationOptions.map((item) => ({ label: item.name, value: item.id }))}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item label="Học phí/buổi" name="fee" rules={[{ required: true, message: "Vui lòng nhập học phí" }]}>
                        <InputNumber className="hire-tutor-input-number" min={0} step={50000} placeholder="Ví dụ: 250000" />
                    </Form.Item>

                    <Form.Item label="Yêu cầu gia sư" name="requirements" rules={[{ required: true, message: "Vui lòng nhập yêu cầu gia sư" }]}>
                        <Input.TextArea rows={3} placeholder="Ví dụ: Cần gia sư có kinh nghiệm dạy mất gốc" />
                    </Form.Item>

                    <Form.Item label="Mô tả học sinh" name="studentDescription" rules={[{ required: true, message: "Vui lòng nhập mô tả học sinh" }]}>
                        <Input.TextArea rows={3} placeholder="Ví dụ: Học sinh lớp 10, mất căn bản" />
                    </Form.Item>

                    <Form.Item label="Ghi chú thêm" name="note" rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}>
                        <Input.TextArea rows={3} placeholder="Ví dụ: Học buổi tối" />
                    </Form.Item>

                    <div className="hire-tutor-submit">
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            Đăng Ký Ngay
                        </Button>
                    </div>
                </Form>

                <p className="hire-tutor-note">
                    Đây là form đăng ký dành cho phụ huynh và học viên. Gia sư nếu muốn đăng ký nhận lớp,
                    vui lòng vào Danh sách lớp mới.
                </p>
            </div>
        </div>
    );
}

export default HireTutor;
