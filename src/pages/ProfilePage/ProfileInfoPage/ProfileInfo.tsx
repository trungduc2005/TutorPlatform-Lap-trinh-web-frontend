import { useEffect, useState, type ChangeEvent } from "react";
import { FiCamera, FiLogOut, FiMail, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import { useAppSelector } from "../../../app/store/hooks";
import { useLogin } from "../../../features/auth/hooks/useLogin";
import { useProfileForm } from "../../../features/profile/hooks/useProfileForm";
import { uploadAvatarToCloudinary } from "../../../shared/api/cloudinaryApi";
import "./ProfileInfo.css";

function getAvatarFallbackLabel(...values: Array<string | undefined>) {
  const source = values.find((value) => value?.trim())?.trim();
  if (!source) return "AV";

  const parts = source.split(/\s+/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || source.slice(0, 2).toUpperCase();
}

function getGenderLabel(gender: string) {
  if (gender === "MALE") return "Nam";
  if (gender === "FEMALE") return "Nữ";
  return "Khác";
}

function getRoleLabel(role: string) {
  if (role === "ADMIN") return "Quản trị viên";
  if (role === "TUTOR") return "Gia sư";
  return "Người thuê gia sư";
}

function ProfileInfo() {
  const user = useAppSelector((state) => state.auth.user);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState("");
  const { handleLogout } = useLogin();

  if (!user) {
    return <div>Không có thông tin người dùng</div>;
  }

  const {
    formValues,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
    setAvatarUrl,
  } = useProfileForm(user);

  useEffect(() => {
    if (!success) {
      return;
    }

    const timer = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [success]);

  const currentAvatarFallback = getAvatarFallbackLabel(user.fullName, user.username, user.email);
  const avatarPreview = formValues.avatarUrl?.trim() || user.avatarUrl || "";

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    try {
      setAvatarUploading(true);
      setAvatarUploadError("");

      const avatarUrl = await uploadAvatarToCloudinary(file);
      setAvatarUrl(avatarUrl);
    } catch (err) {
      setAvatarUploadError(err instanceof Error ? err.message : "Upload avatar thất bại");
    } finally {
      setAvatarUploading(false);
      input.value = "";
    }
  };

  const profileItems = [
    {
      icon: FiUser,
      label: "Mã người dùng",
      value: `#${user.id}`,
    },
    {
      icon: FiMail,
      label: "Email",
      value: user.email || "Chưa cập nhật",
    },
    {
      icon: FiPhone,
      label: "Số điện thoại",
      value: user.phone || "Chưa cập nhật",
    },
  ];

  return (
    <section className="profile-info-page">
      <div className="profile-summary-card">
        <div className="profile-summary-card__main">
          <div className="profile-summary-card__avatar-wrap">
            <div
              className={`profile-summary-card__avatar${avatarPreview ? " profile-summary-card__avatar--image" : ""}`}
            >
              {avatarPreview ? <img src={avatarPreview} alt="Ảnh đại diện" /> : <span>{currentAvatarFallback}</span>}
            </div>

            <label
              htmlFor="avatarFile"
              className={`profile-summary-card__avatar-button${avatarUploading ? " profile-summary-card__avatar-button--disabled" : ""}`}
              aria-label="Tải ảnh đại diện"
            >
              <FiCamera />
            </label>
            <input
              id="avatarFile"
              className="profile-summary-card__avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={avatarUploading}
            />
          </div>

          <div className="profile-summary-card__identity">
            <h2 className="profile-summary-card__name">{user.username || user.fullName}</h2>
            <p className="profile-summary-card__email">{user.email}</p>
            <span className="profile-summary-card__badge">{getRoleLabel(user.role)}</span>
          </div>
        </div>

        <button type="button" className="profile-summary-card__logout" onClick={handleLogout}>
          <FiLogOut />
          <span>Đăng xuất</span>
        </button>

        <div className="profile-summary-card__stats">
          {profileItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="profile-summary-card__stat">
              <div className="profile-summary-card__stat-icon">
                <Icon />
              </div>
              <div>
                <p className="profile-summary-card__stat-label">{label}</p>
                <p className="profile-summary-card__stat-value">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form className="profile-form-card" onSubmit={handleSubmit}>
        <div className="profile-form-card__header">
          <h3>Thông tin cơ bản</h3>
        </div>

        <div className="profile-form-card__grid">
          <div className="profile-form-field">
            <label htmlFor="fullName">Họ và tên</label>
            <div className="profile-form-field__control">
              <FiUser className="profile-form-field__icon" />
              <input id="fullName" name="fullName" value={formValues.fullName} onChange={handleChange} />
            </div>
          </div>

          <div className="profile-form-field">
            <label htmlFor="email">Email</label>
            <div className="profile-form-field__control">
              <FiMail className="profile-form-field__icon" />
              <input id="email" name="email" value={formValues.email} onChange={handleChange} />
            </div>
          </div>

          <div className="profile-form-field">
            <label htmlFor="phone">Số điện thoại</label>
            <div className="profile-form-field__control">
              <FiPhone className="profile-form-field__icon" />
              <input id="phone" name="phone" value={formValues.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="profile-form-field">
            <label htmlFor="gender">Giới tính</label>
            <div className="profile-form-field__control">
              <select id="gender" name="gender" value={formValues.gender} onChange={handleChange}>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>

          <div className="profile-form-field profile-form-field--full">
            <label htmlFor="address">Địa chỉ</label>
            <div className="profile-form-field__control">
              <FiMapPin className="profile-form-field__icon" />
              <input id="address" name="address" value={formValues.address} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="profile-form-card__meta">
          <div className="profile-form-card__meta-item">
            <span className="profile-form-card__meta-label">Vai trò</span>
            <strong>{getRoleLabel(user.role)}</strong>
          </div>
          <div className="profile-form-card__meta-item">
            <span className="profile-form-card__meta-label">Giới tính hiện tại</span>
            <strong>{getGenderLabel(formValues.gender)}</strong>
          </div>
        </div>

        {avatarUploadError ? (
          <p className="profile-form-card__message profile-form-card__message--error">{avatarUploadError}</p>
        ) : null}

        {error ? <p className="profile-form-card__message profile-form-card__message--error">{error}</p> : null}

        {success ? <p className="profile-form-card__message profile-form-card__message--success">{success}</p> : null}

        <div className="profile-form-card__actions">
          <button type="submit" className="profile-form-card__submit" disabled={loading || avatarUploading}>
            {avatarUploading ? "Đang upload ảnh..." : loading ? "Đang lưu..." : "Cập nhật thông tin"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProfileInfo;

