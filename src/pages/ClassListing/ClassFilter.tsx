import { Button, Form, Select, Slider } from "antd";
import { useEffect, useState } from "react";
import "./ClassFilter.css";
import {
    getDurationOptions,
    getGradeOptions,
    getLocationOptions,
    getSubjectOptions,
    type FilterOption,
    type SearchClassesParams,
} from "../../features/classes/api/classApi";

const fallbackDurationOptions = [
    { label: "1h/buổi", value: 1 },
    { label: "1.5h/buổi", value: 2 },
    { label: "2h/buổi", value: 3 },
    { label: "2.5h/buổi", value: 4 },
];

type FilterValues = {
    subjectId?: number;
    gradeId?: number;
    fee?: [number, number];
    durationId?: number;
    locationId?: number;
};

type ClassFilterProps = {
    onSearch: (params: SearchClassesParams) => void;
};

const DEFAULT_FEE_RANGE: [number, number] = [0, 5000000];

function formatCurrency(value: number) {
    return value.toLocaleString("vi-VN");
}

function ClassFilter({ onSearch }: ClassFilterProps) {
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
                console.error("Không thể tải dữ liệu bộ lọc", error);
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
            size: 12,
        };

        onSearch(params);
    };

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
            size: 12,
        });
    };

    return (
        <Form
            className="class-filter-form"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ fee: DEFAULT_FEE_RANGE }}
        >
            <div className="class-filter-header">
                <h3 className="class-filter-title">Bộ lọc</h3>
            </div>

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
                        onChange={(value) => {
                            if (Array.isArray(value)) {
                                const nextRange = value as [number, number];
                                setFeeRange(nextRange);
                                form.setFieldValue("fee", nextRange);
                            }
                        }}
                    />
                </Form.Item>

                <p className="fee-range-text">
                    Từ {formatCurrency(feeRange[0])}đ đến {formatCurrency(feeRange[1])}đ
                </p>
            </div>

            <div className="filter-actions">
                <Button type="primary" htmlType="submit">
                    Áp dụng
                </Button>
                <Button onClick={onReset}>Thiết lập lại</Button>
            </div>
        </Form>
    );
}

export default ClassFilter;