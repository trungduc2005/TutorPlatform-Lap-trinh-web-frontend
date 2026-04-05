import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/store/hooks";
import { useTutorProfileForm } from "../../../features/profile/hooks/useTutorProfileForm";
import "./TutorInfo.css";

function TutorInfo() {
    const { user, hasTutorProfile } = useAppSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);

    const {
        formValues,
        loading,
        loadingProfile,
        error,
        success,
        handleChange,
        handleSubmit,
        resetForm,
    } = useTutorProfileForm(hasTutorProfile, user?.role);

    useEffect(() => {
        if (success) {
            setIsEditing(false);
        }
    }, [success]);

    if (!user || user.role !== "TUTOR") {
        return <div>Chỉ tài khoản gia sư mới dùng được mục này.</div>;
    }

    const handleCancel = async () => {
        await resetForm();
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
                <div className="profile-info__field profile-info__field--full">
                    <label>Kinh nghiệm</label>
                    {renderValue(formValues.experience)}
                </div>

                <div className="profile-info__field profile-info__field--full">
                    <label>Thành tích</label>
                    {renderValue(formValues.achievements)}
                </div>

                <div className="profile-info__field">
                    <label>Khu vực dạy</label>
                    {renderValue(formValues.teachingArea)}
                </div>

                <div className="profile-info__field">
                    <label>Trường</label>
                    {renderValue(formValues.school)}
                </div>

                <div className="profile-info__field profile-info__field--full">
                    <label>Giới thiệu</label>
                    {renderValue(formValues.bio)}
                </div>

                <div className="profile-info__field profile-info__field--full">
                    <label>Thời gian rảnh</label>
                    {renderValue(formValues.availableTime)}
                </div>
            </div>

            {loadingProfile ? (
                <p className="profile-info__message">Đang tải hồ sơ hiện tại...</p>
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
                    className="profile-info__submit"
                    onClick={() => setIsEditing(true)}
                    disabled={loadingProfile || hasTutorProfile === null}
                >
                    {hasTutorProfile ? "Cập nhật" : "Tạo hồ sơ"}
                </button>
            </div>
        </div>
    );

    const renderEditMode = () => (
        <form className="profile-info__form" onSubmit={handleSubmit}>
            <div className="profile-info__grid">
                <div className="profile-info__field profile-info__field--full">
                    <label htmlFor="experience">Kinh nghiệm</label>
                    <input
                        id="experience"
                        name="experience"
                        value={formValues.experience}
                        onChange={handleChange}
                        placeholder="Ví dụ: 3 năm dạy Toán"
                    />
                </div>

                <div className="profile-info__field profile-info__field--full">
                    <label htmlFor="achievements">Thành tích</label>
                    <input
                        id="achievements"
                        name="achievements"
                        value={formValues.achievements}
                        onChange={handleChange}
                        placeholder="Ví dụ: IELTS 8.0, Best Tutor 2023"
                    />
                </div>

                <div className="profile-info__field">
                    <label htmlFor="teachingArea">Khu vực dạy</label>
                    <input
                        id="teachingArea"
                        name="teachingArea"
                        value={formValues.teachingArea}
                        onChange={handleChange}
                        placeholder="Ví dụ: Hà Nội"
                    />
                </div>

                <div className="profile-info__field">
                    <label htmlFor="school">Trường</label>
                    <input
                        id="school"
                        name="school"
                        value={formValues.school}
                        onChange={handleChange}
                        placeholder="Ví dụ: HUST"
                    />
                </div>

                <div className="profile-info__field profile-info__field--full">
                    <label htmlFor="bio">Giới thiệu</label>
                    <input
                        id="bio"
                        name="bio"
                        value={formValues.bio}
                        onChange={handleChange}
                        placeholder="Ví dụ: Thân thiện, kiên nhẫn"
                    />
                </div>

                <div className="profile-info__field profile-info__field--full">
                    <label htmlFor="availableTime">Thời gian rảnh</label>
                    <input
                        id="availableTime"
                        name="availableTime"
                        value={formValues.availableTime}
                        onChange={handleChange}
                        placeholder="Ví dụ: Thứ 2 - Thứ 6, 18:00 - 21:00"
                    />
                </div>
            </div>

            {loadingProfile ? (
                <p className="profile-info__message">Đang tải hồ sơ hiện tại...</p>
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
                    disabled={loading}
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    className="profile-info__submit"
                    disabled={loading || loadingProfile || hasTutorProfile === null}
                >
                    {loading
                        ? hasTutorProfile
                            ? "Đang cập nhật..."
                            : "Đang tạo..."
                        : hasTutorProfile
                          ? "Lưu thay đổi"
                          : "Tạo hồ sơ"}
                </button>
            </div>
        </form>
    );

    return (
        <section className="profile-info">
            <div className="profile-info__header">
                <div>
                    <p className="profile-info__eyebrow">Hồ sơ gia sư</p>
                    <h3 className="profile-info__title">
                        {isEditing
                            ? hasTutorProfile
                                ? "Cập nhật hồ sơ gia sư"
                                : "Tạo hồ sơ gia sư"
                            : "Hồ sơ của bạn"}
                    </h3>
                </div>
            </div>

            {isEditing ? renderEditMode() : renderViewMode()}
        </section>
    );
}

export default TutorInfo;
