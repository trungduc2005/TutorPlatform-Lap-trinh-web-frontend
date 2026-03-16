import { useAppSelector } from "../../../app/store/hooks";
import { useTutorProfileForm } from "../../../features/profile/hooks/useTutorProfileForm";
import "./TutorInfo.css";

function TutorInfo() {
    const { user, hasTutorProfile } = useAppSelector((state) => state.auth);

    const {
        formValues,
        loading,
        loadingProfile,
        error,
        success,
        handleChange,
        handleSubmit,
    } = useTutorProfileForm(hasTutorProfile, user?.role);

    if (!user || user.role !== "TUTOR") {
        return <div>Chỉ tài khoản gia sư mới dùng được mục này.</div>;
    }

    const title =
        hasTutorProfile === null
            ? "Hồ sơ gia sư"
            : hasTutorProfile
              ? "Cập nhật hồ sơ gia sư"
              : "Tạo hồ sơ gia sư";

    let submitText = "Đang kiểm tra...";
    if (loading) {
        submitText = hasTutorProfile ? "Đang cập nhật..." : "Đang tạo...";
    } else if (hasTutorProfile !== null) {
        submitText = hasTutorProfile ? "Cập nhật hồ sơ" : "Tạo hồ sơ";
    }

    return (
        <section className="profile-info">
            <div className="profile-info__header">
                <div>
                    <p className="profile-info__eyebrow">Hồ sơ gia sư</p>
                    <h3 className="profile-info__title">{title}</h3>
                </div>
            </div>

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
                        type="submit"
                        className="profile-info__submit"
                        disabled={loading || loadingProfile || hasTutorProfile === null}
                    >
                        {submitText}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default TutorInfo;
