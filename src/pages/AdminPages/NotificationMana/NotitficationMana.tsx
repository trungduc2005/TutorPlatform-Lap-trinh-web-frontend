import { useEffect, useState } from "react";
import { Card, Input, Select, Button, message } from "antd";
import "./NotificationMana.css";
import { adminApi } from "../../../features/admin/api/adminApi";
import type { NotificationPayload } from "../../../features/admin/model/notificationType";
import type { AccountType } from "../../../features/admin/model/accountType";

const { TextArea } = Input;

export default function AdminNotificationPage() {
  const [loading, setLoading] = useState(false);
  const [userAccounts, setUserAccounts] = useState<AccountType[]>([]);
  const [payload, setPayload] = useState<NotificationPayload>({
    title: "",
    body: "",
    userIds: [],
    roles: [],
  });

  useEffect(() => {
    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getAllAccounts();
            message.success("Lấy danh sách tk người dùng thành công.");
            setUserAccounts(res);
        } catch(error) {
            message.error("Lấy danh sách tk người dùng thất bại.");
        } finally{
            setLoading(false);
        }
    }
    fetchAccounts();
  }, [])

  const userOptions = userAccounts.map((user) => ({
    label: user.fullName,
    value: user.id,
  }))

  const roleOptions = [
    { label: "Tutor", value: "TUTOR" },
    { label: "Hirer", value: "HIRER" },
  ];

  const handleSend = async () => {
    if (!payload.title || !payload.body) {
      message.warning("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    if (payload.userIds.length === 0 && payload.roles.length === 0) {
      message.warning("Chọn user hoặc role để gửi");
      return;
    }

    try {
      setLoading(true);

      await adminApi.sendNotification(payload);

      message.success("Gửi thông báo thành công");

      setPayload({
        title: "",
        body: "",
        userIds: [],
        roles: [],
      });
    } catch (err) {
      console.error(err);
      message.error("Gửi thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-page">
      <Card title="Gửi thông báo" className="notification-card">

        <div className="form-group">
          <label>Tiêu đề</label>
          <Input
            value={payload.title}
            onChange={(e) =>
              setPayload({ ...payload, title: e.target.value })
            }
            placeholder="Nhập tiêu đề..."
          />
        </div>

        <div className="form-group">
          <label>Nội dung</label>
          <TextArea
            rows={4}
            value={payload.body}
            onChange={(e) =>
              setPayload({ ...payload, body: e.target.value })
            }
            placeholder="Nhập nội dung thông báo..."
          />
        </div>

        <div className="form-group">
          <label>Chọn người nhận (userIds)</label>
          <Select
            mode="multiple"
            allowClear
            options={userOptions}
            value={payload.userIds}
            onChange={(value) =>
              setPayload({ ...payload, userIds: value })
            }
            placeholder="Chọn user..."
          />
        </div>

        <div className="form-group">
          <label>Hoặc chọn theo role</label>
          <Select
            mode="multiple"
            allowClear
            options={roleOptions}
            value={payload.roles}
            onChange={(value) =>
              setPayload({ ...payload, roles: value })
            }
            placeholder="Chọn role..."
          />
        </div>

        <div className="actions">
          <Button
            type="primary"
            loading={loading}
            onClick={handleSend}
          >
            Gửi thông báo
          </Button>
        </div>

      </Card>
    </div>
  );
}