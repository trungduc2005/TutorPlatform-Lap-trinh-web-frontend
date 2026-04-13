import { useEffect, useState } from "react";
import { adminApi } from "../../../features/admin/api/adminApi";
import type { AccountType } from "../../../features/admin/model/accountType";
import "./AccountMana.css";
import { Button, message, Modal } from "antd";

export default function AccountMana() {
    const [accounts, setAccounts] = useState<AccountType[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(null);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getAllAccounts();
            message.success("Lấy danh sách tài khoản user thành công");
            setAccounts(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleConfirm = async (acc: AccountType | null) => {
        if (!acc) return;

        const newStatus = acc.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        try {
            setUpdatingId(acc.id);

            await adminApi.updateAccountStatus(acc.id, newStatus);

            setAccounts(prev =>
                prev.map(item =>
                    item.id === acc.id
                        ? { ...item, status: newStatus }
                        : item
                )
            );
            message.success(`Tài khoản ${acc.fullName} đã được ${newStatus === "ACTIVE" ? "mở khóa" : "khóa"} thành công`);
        } finally {
            setUpdatingId(null);
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedAccount(null);
    }

    return (
        <div className="account-page">
            <h2 className="account-title">Quản lý tài khoản</h2>

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="table-wrapper">
                    <table className="account-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {accounts.map(acc => (
                                <tr key={acc.id}>
                                    <td>{acc.id}</td>
                                    <td>{acc.username}</td>
                                    <td>{acc.fullName}</td>
                                    <td>{acc.email}</td>
                                    <td>
                                        <span className={`role ${acc.role.toLowerCase()}`}>
                                            {acc.role}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`status ${
                                                acc.status === "ACTIVE"
                                                    ? "active"
                                                    : "locked"
                                            }`}
                                        >
                                            {acc.status}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className={`action-btn ${
                                                acc.status === "ACTIVE"
                                                    ? "lock"
                                                    : "unlock"
                                            }`}
                                            disabled={updatingId === acc.id}
                                            onClick={() => {setSelectedAccount(acc); 
                                                            setModalOpen(true);}}
                                        >
                                            {updatingId === acc.id
                                                ? "Đang xử lý..."
                                                : acc.status === "ACTIVE"
                                                ? "Khóa"
                                                : "Mở"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal
                open={modalOpen}
                onCancel={handleCloseModal}
                footer={null}
                centered
            >
                <div className="modal-content">
                    <p>
                        Bạn có chắc muốn{" "}
                        {selectedAccount?.status === "ACTIVE" ? "khóa" : "mở"} tài khoản{" "}
                        <strong>{selectedAccount?.fullName}</strong>?
                    </p>

                    <div style={{ display: "flex", gap: 10, marginTop: 16 , justifyContent: "flex-end"}}>
                        <Button onClick={handleCloseModal}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            danger={selectedAccount?.status === "ACTIVE"}
                            onClick={() => handleConfirm(selectedAccount)}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}