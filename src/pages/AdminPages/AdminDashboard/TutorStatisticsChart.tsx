import {
    ResponsiveContainer, XAxis, YAxis, Tooltip,
    Bar, CartesianGrid, Legend, BarChart, Cell,
} from "recharts";

type TutorStatItemType = {
    id: number;
    fullName: string;
    totalReceivedClasses: number;
};

type Props = {
    title: string;
    data: TutorStatItemType[];
};

const COLORS = [
    "#29b6f6", "#29b6f6", "#29b6f6", "#29b6f6", "#29b6f6",
    "#29b6f6", "#29b6f6", "#29b6f6", "#29b6f6", "#29b6f6",
    "#29b6f6", "#29b6f6", "#29b6f6", "#29b6f6", "#29b6f6",
];

export default function TutorStatisticsChart({ title, data }: Props) {
    // Sort descending so top tutors appear first
    const sorted = [...data].sort((a, b) => b.totalReceivedClasses - a.totalReceivedClasses);

    return (
        <div style={{
            width: "100%",
            marginBottom: 32,
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}>
            <h3 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>
                {title}
            </h3>

            <ResponsiveContainer width="100%" height={Math.max(400, sorted.length * 36)}>
                <BarChart
                    layout="vertical"
                    data={sorted}
                    margin={{ top: 10, right: 40, left: 120, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                        type="number"
                        allowDecimals={false}
                        label={{ value: "Số lớp nhận", position: "insideBottom", offset: -2 }}
                    />
                    <YAxis
                        type="category"
                        dataKey="fullName"
                        width={115}
                        tick={{ fontSize: 13 }}
                    />
                    <Tooltip
                        formatter={(value, name) => [value, "Số lớp nhận"]}
                        labelFormatter={(label) => `Gia sư: ${label}`}
                    />
                    <Legend
                        formatter={() => (
                            <span style={{ color: "black" }}>
                                Số lớp nhận
                            </span>
                        )}
                    />

                    <Bar
                        dataKey="totalReceivedClasses"
                        fill="#29b6f6"
                        name="Số lớp nhận"
                        radius={[0, 6, 6, 0]}
                        barSize={22}
                    >
                        {sorted.map((_, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}