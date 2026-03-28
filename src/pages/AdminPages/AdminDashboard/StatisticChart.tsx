import {ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, CartesianGrid, Legend, ComposedChart, Line } from "recharts";
import type { StatisticsItemType } from "../../../features/admin/model/statisticsType";

type Props = {
    title: string;
    data: StatisticsItemType[];
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);

export default function StatisticsChart({ title, data }: Props) {
    return (
        <div
            style={{
                width: "100%",
                height: 500,
                marginBottom: 32,
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
        >
            <h3 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>
                {title}
            </h3>

            <ResponsiveContainer width="100%" height="85%">
                <ComposedChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    
                    <YAxis
                        yAxisId="left"
                        allowDecimals={false}
                        label={{
                            value: "Số lớp",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}tr`}
                        label={{
                            value: "Doanh thu",
                            angle: 90,
                            position: "insideRight",
                        }}
                    />

                    <Tooltip
                        formatter={(value, name) => {
                            if (name === "Doanh thu" && typeof value === "number") {
                                return [formatCurrency(value), name];
                            }
                            return [value ?? 0, name];
                        }}
                    />

                    <Legend />

                    <Bar
                        yAxisId="left"
                        dataKey="totalClasses"
                        name="Tổng lớp"
                        radius={[6, 6, 0, 0]}
                        fill="#7c83fd"
                        barSize={40}
                    />

                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="totalRevenue"
                        name="Doanh thu"
                        stroke="#4caf50"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}