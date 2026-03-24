import { useState } from "react";
import { useAppSelector } from "../../../app/store/hooks";
import { useProfileForm } from "../../../features/profile/hooks/useProfileForm";
import "./profileInfo.css";

function ProfileInfo() {
    const user = useAppSelector((state) => state.auth.user);
    const [isEditing, setIsEditing] = useState(false);

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
        resetForm,
    } = useProfileForm(user);

    const genderLabel =
        user.gender === "MALE" ? "Nam" : user.gender === "FEMALE" ? "Nữ" : "Khác";

    const handleCancel = () => {
        resetForm();
        setIsEditing(false);
    };

    const renderValue = (value?: string) => (
        <div className={`profile-info__value${value?.trim() ? "" : " profile-info__value--empty"}`}>
            {value?.trim() ? value : "Chưa cập nhật"}
        </div>
    );

    const renderViewMode = () => (
        <div className="profile-info__form">
            <div className="profile-info__grid">
                <div className="profile-info__field">
                    <label>Họ và tên</label>
                    {renderValue(user.fullName)}
                </div>

                <div className="profile-info__field">
                    <label>Email</label>
                    {renderValue(user.email)}
                </div>

                <div className="profile-info__field">
                    <label>Số điện thoại</label>
                    {renderValue(user.phone)}
                </div>

                <div className="profile-info__field">
                    <label>Giới tính</label>
                    {renderValue(genderLabel)}
                </div>

                <div className="profile-info__field profile-info__field--full">
                    <label>Địa chỉ</label>
                    {renderValue(user.address)}
                </div>

                <div className="profile-info__field profile-info__field--full">
                    <label>Avatar URL</label>
                    {renderValue(user.avatarUrl)}
                </div>
            </div>

            <div className="profile-info__actions">
                <button
                    type="button"
                    className="profile-info__submit"
                    onClick={() => setIsEditing(true)}
                >
                    Cập nhật
                </button>
            </div>
        </div>
    );

    const renderEditMode = () => (
        <form className="profile-info__form" onSubmit={handleSubmit}>
            <div className="profile-info__grid">
                <div className="profile-info__field">
                    <label htmlFor="fullName">Họ và tên</label>
                    <input
                        id="fullName"
                        name="fullName"
                        value={formValues.fullName}
                        onChange={handleChange}
                    />
                </div>

                <div className="profile-info__field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="profile-info__field">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                        id="phone"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="profile-info__field">
                    <label htmlFor="gender">Giới tính</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formValues.gender}
                        onChange={handleChange}
                    >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                    </select>
                </div>

                <div className="profile-info__field profile-info__field--full">
                    <label htmlFor="address">Địa chỉ</label>
                    <input
                        id="address"
                        name="address"
                        value={formValues.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="profile-info__field profile-info__field--full">
                    <label htmlFor="avatarUrl">Avatar URL</label>
                    <input
                        id="avatarUrl"
                        name="avatarUrl"
                        value={formValues.avatarUrl ?? ""}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {error ? (
                <p className="profile-info__message profile-info__message--error">{error}</p>
            ) : null}

            {success ? (
                <p className="profile-info__message profile-info__message--success">{success}</p>
            ) : null}

            <div className="profile-info__actions">
                <button
                    type="button"
                    className="profile-info__cancel"
                    onClick={handleCancel}
                    disabled={loading}
                >
                    Hủy
                </button>

                <button type="submit" className="profile-info__submit" disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>
        </form>
    );

    return (
        <section className="profile-info">
            <div className="profile-info__header">
                <div>
                    <p className="profile-info__eyebrow">Thông tin cá nhân</p>
                    <h3 className="profile-info__title">
                        {isEditing ? "Cập nhật hồ sơ" : "Hồ sơ của bạn"}
                    </h3>
                </div>
            </div>

            {isEditing ? renderEditMode() : renderViewMode()}
        </section>
    );
}

export default ProfileInfo;
