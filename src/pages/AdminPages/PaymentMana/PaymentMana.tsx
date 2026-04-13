import { useEffect, useState } from "react";
import { Table, Tag, Typography, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { PaymentHistoryType } from "../../../features/admin/model/PaymentHistoryType";
import { adminApi } from "../../../features/admin/api/adminApi";
import "./PaymentMana.css";

const { Link } = Typography;

export default function PaymentMana() {
    const [data, setData] = useState<PaymentHistoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRaw, setSelectedRaw] = useState<string | null>(null);

    useEffect(() => {
    const fetchPayments = async () => {
        setLoading(true);
            try {
                const res = await adminApi.getAllPaymentHistory(); 
                message.success("Lấy danh sách thanh toán thành công");
                setData(res);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
    fetchPayments();
    }, []);

  const formatDate = (arr: number[] | null) => {
    if (!arr) return "-";
    return new Date(
      arr[0],
      arr[1] - 1,
      arr[2],
      arr[3] || 0,
      arr[4] || 0,
      arr[5] || 0
    ).toLocaleString();
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <Tag color="green">SUCCESS</Tag>;
      case "PENDING":
        return <Tag color="orange">PENDING</Tag>;
      case "EXPIRED":
        return <Tag color="red">EXPIRED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

    const columns: ColumnsType<PaymentHistoryType> = [
        { title: "ID", dataIndex: "id" },

        { title: "Class ID", dataIndex: "classId" },

        { title: "Application ID", dataIndex: "classApplicationId" },

        { title: "Tutor", dataIndex: "tutorId" },

        {
            title: "Amount",
            dataIndex: "amount",
            render: (value) =>
            value.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
            }),
        },

        { title: "Provider", dataIndex: "provider" },

        { title: "TxnRef", dataIndex: "txnRef" },

        {
            title: "Status",
            dataIndex: "status",
            render: (status) => getStatusTag(status),
        },

        {
            title: "Expires At",
            dataIndex: "expiresAt",
            render: (value) => formatDate(value),
        },

        {
            title: "Paid At",
            dataIndex: "paidAt",
            render: (value) => formatDate(value),
        },

        {
            title: "Created",
            dataIndex: "createdAt",
            render: (value) => formatDate(value),
        },

        {
            title: "Updated",
            dataIndex: "updatedAt",
            render: (value) => formatDate(value),
        },

        {
            title: "VNP Txn",
            dataIndex: "vnpTransactionNo",
            render: (val) => val || "-",
        },

        {
            title: "Payment URL",
            dataIndex: "paymentUrl",
            render: (url) => (
            <Link href={url} target="_blank">
                Open
            </Link>
            ),
        },

        {
            title: "Action",
            render: (_, record) => (
            <a onClick={() => setSelectedRaw(record.rawResponse)}>
                View Raw
            </a>
            ),
        },
    ];

  return (
    <div className="payment-container">
      <h2>Danh sách thanh toán</h2>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        bordered
      />

      <Modal
        open={!!selectedRaw}
        onCancel={() => setSelectedRaw(null)}
        footer={null}
        title="Raw Response"
      >
        <pre className="raw-box">
          {selectedRaw && JSON.stringify(JSON.parse(selectedRaw), null, 2)}
        </pre>
      </Modal>
    </div>
  );
};