import {Form, Button, Select, Slider} from "antd";
import { useEffect, useState } from "react";
import "./ClassFilter.css"
import {
    getDurationOptions,
    getGradeOptions,
    getLocationOptions,
    getSubjectOptions,
    type FilterOption,
    type SearchClassesParams,
} from "../../features/classes/api/classApi";

const fallbackDurationOptions = [
    { label: '1h/buổi', value: 1 },
    { label: '1.5h/buổi', value: 2 },
    { label: '2h/buổi', value: 3 },
    { label: '2.5h/buổi', value: 4 },
];

type FilterValues = {
    subjectId?: number;
    gradeId?: number;
    fee?: [number, number];
    durationId?: number;
    locationId?: number;
}

type ClassFilterProps = {
    onSearch: (params: SearchClassesParams) => void
}

const DEFAULT_FEE_RANGE: [number, number] = [0, 5000000];


function ClassFilter({onSearch}: ClassFilterProps){
    const [form] = Form.useForm<FilterValues>();
    const [subjects, setSubjects] = useState<FilterOption[]>([]);
    const [grades, setGrades] = useState<FilterOption[]>([]);
    const [locations, setLocations] = useState<FilterOption[]>([]);
    const [durations, setDurations] = useState<FilterOption[]>([]);
    const [feeRange, setFeeRange] = useState<[number, number]>(DEFAULT_FEE_RANGE);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
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
            } catch (error) {
                console.error("Khong the tai du lieu bo loc", error);
            }
        };

        fetchFilterOptions();
    }, []);

    const onFinish = (values: FilterValues) => {
        const params: SearchClassesParams = {
            subjectId: values.subjectId,
            gradeId: values.gradeId,
            minFee: values.fee?.[0],
            maxFee: values.fee?.[1],
            durationId: values.durationId,
            locationId: values.locationId,
            page: 0,
            size: 10,
        };
        onSearch(params)
        console.log("Tìm kiếm với params:", params)
    }

    const onReset = () => {
        setFeeRange(DEFAULT_FEE_RANGE);
        form.setFieldValue("fee", DEFAULT_FEE_RANGE);
        form.resetFields();

        onSearch({
            subjectId: undefined,
            gradeId: undefined,
            minFee: undefined,
            maxFee: undefined,
            durationId: undefined,
            locationId: undefined,
            page: 0,
            size: 10,
        });
    };

    return (
        <Form
            className="class-filter-form"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{fee: DEFAULT_FEE_RANGE}}
        >
            <div className="filter-fields">
                <Form.Item name="subjectId" label="Môn học">
                    <Select
                        allowClear
                        placeholder="Chọn môn"
                        options={subjects.map((item) => ({ label: item.name, value: item.id }))}
                    />
                </Form.Item>

                <Form.Item name="gradeId" label="Khối">
                    <Select
                        allowClear
                        placeholder="Chọn khối"
                        options={grades.map((item) => ({ label: item.name, value: item.id }))}
                    />
                </Form.Item>

                <Form.Item name="durationId" label="Thời lượng">
                    <Select
                        allowClear
                        placeholder="Chọn thời lượng"
                        options={
                            durations.length > 0
                                ? durations.map((item) => ({ label: item.name, value: item.id }))
                                : fallbackDurationOptions
                        }
                    />
                </Form.Item>

                <Form.Item name="locationId" label="Địa điểm">
                    <Select
                        allowClear
                        placeholder="Chọn địa điểm"
                        options={locations.map((item) => ({ label: item.name, value: item.id }))}
                    />
                </Form.Item>
            </div>

            <div className="fee-filter">
                <Form.Item name="fee" label="Học phí">
                    <Slider
                        range
                        value={feeRange}
                        min={0}
                        max={5000000}
                        step={100000}
                        marks={{
                            0: '0đ',
                            5000000: '5.000.000đ',
                        }}
                        tooltip={{
                            formatter: (value) => `${(value ?? 0).toLocaleString('vi-VN')}đ`,
                        }}
                        onChange={(value) => {
                            if (Array.isArray(value)) {
                                const nextRange = value as [number, number];
                                setFeeRange(nextRange);
                                form.setFieldValue("fee", nextRange);
                            }
                        }}
                    />
                    <div className="fee-range-labels">
                        <span>{feeRange[0].toLocaleString('vi-VN')}đ</span>
                        <span>{feeRange[1].toLocaleString('vi-VN')}đ</span>
                    </div>
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
