import { useEffect, useState, type ChangeEvent } from "react";
import { BsCloudFill } from "react-icons/bs";
import { FaArrowUp } from "react-icons/fa";
import { useAppSelector } from "../../../app/store/hooks";
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

function ProfileInfo() {
    const user = useAppSelector((state) => state.auth.user);
    const [isEditing, setIsEditing] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarUploadError, setAvatarUploadError] = useState("");

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
        setAvatarUrl,
    } = useProfileForm(user);

    useEffect(() => {
        if (success) {
            setIsEditing(false);
        }
    }, [success]);

    const genderLabel =
        user.gender === "MALE" ? "Nam" : user.gender === "FEMALE" ? "Nữ" : "Khác";

    const handleCancel = () => {
        setAvatarUploadError("");
        resetForm();
        setIsEditing(false);
    };

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

    const renderValue = (value?: string) => (
        <div className={`profile-info__value${value?.trim() ? "" : " profile-info__value--empty"}`}>
            {value?.trim() ? value : "Chưa cập nhật"}
        </div>
    );

    const renderAvatarPreview = (avatarUrl: string | undefined, fallbackLabel: string, alt: string) => (
        <div className={`profile-info__avatar-preview${avatarUrl ? " profile-info__avatar-preview--image" : ""}`}>
            {avatarUrl ? <img src={avatarUrl} alt={alt} /> : <span>{fallbackLabel}</span>}
        </div>
    );

    const currentAvatarFallback = getAvatarFallbackLabel(user.fullName, user.username, user.email);
    const hasDraftAvatar = Boolean(formValues.avatarUrl?.trim());

    const renderViewMode = () => (
        <div className="profile-info__form">
            <div className="profile-info__grid">
                <div className="profile-info__field profile-info__field--full profile-info__field--avatar-display">
                    <label>Ảnh đại diện</label>
                    <div className="profile-info__avatar-display">
                        {renderAvatarPreview(user.avatarUrl, currentAvatarFallback, "Ảnh đại diện hiện tại")}
                    </div>
                </div>

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
            </div>

            <div className="profile-info__actions">
                <button
                    type="button"
                    className="profile-info__submit"
                    onClick={() => {
                        setAvatarUploadError("");
                        setIsEditing(true);
                    }}
                >
                    Cập nhật
                </button>
            </div>
        </div>
    );

    const renderEditMode = () => (
        <form className="profile-info__form" onSubmit={handleSubmit}>
            <div className="profile-info__grid">
                <div className="profile-info__field profile-info__field--full profile-info__field--avatar">
                    <label htmlFor="avatarFile">Ảnh đại diện</label>

                    <label
                        htmlFor="avatarFile"
                        className={`profile-info__upload${avatarUploading ? " profile-info__upload--uploading" : ""}${
                            hasDraftAvatar ? " profile-info__upload--has-image" : ""
                        }`}
                    >
                        {hasDraftAvatar ? (
                            <img className="profile-info__upload-preview" src={formValues.avatarUrl} alt="Ảnh đại diện" />
                        ) : (
                            <span className="profile-info__upload-illustration" aria-hidden="true">
                                <BsCloudFill className="profile-info__upload-cloud" />
                                <FaArrowUp className="profile-info__upload-arrow" />
                            </span>
                        )}
                    </label>

                    <input
                        id="avatarFile"
                        className="profile-info__upload-input"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        disabled={avatarUploading}
                    />
                </div>

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
            </div>

            {avatarUploadError ? (
                <p className="profile-info__message profile-info__message--error">{avatarUploadError}</p>
            ) : null}

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
                    disabled={loading || avatarUploading}
                >
                    Hủy
                </button>

                <button type="submit" className="profile-info__submit" disabled={loading || avatarUploading}>
                    {avatarUploading ? "Đang upload ảnh..." : loading ? "Đang lưu..." : "Lưu thay đổi"}
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
