import {
  FiAward,
  FiBookOpen,
  FiClock,
  FiEdit3,
  FiMapPin,
  FiMonitor,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/store/hooks";
import { useTutorProfileForm } from "../../../features/profile/hooks/useTutorProfileForm";
import "./TutorInfo.css";

const isOnlineTeaching = (teachingArea: string) => /online|trực tuyến/i.test(teachingArea);

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

  const highlights = [
    { icon: FiBookOpen, label: "Kinh nghiệm", value: formValues.experience || "Chưa cập nhật" },
    { icon: FiMapPin, label: "Khu vực dạy", value: formValues.teachingArea || "Chưa cập nhật" },
    {
      icon: FiMonitor,
      label: "Hình thức",
      value: formValues.teachingArea
        ? isOnlineTeaching(formValues.teachingArea)
          ? "Online và trực tiếp"
          : "Trực tiếp"
        : "Chưa cập nhật",
    },
  ];

  const detailItems = [
    { icon: FiAward, label: "Thành tích", value: formValues.achievements },
    { icon: FiBookOpen, label: "Kinh nghiệm", value: formValues.experience },
    { icon: FiMapPin, label: "Khu vực dạy", value: formValues.teachingArea },
    { icon: FiUser, label: "Trường", value: formValues.school },
    { icon: FiEdit3, label: "Giới thiệu", value: formValues.bio },
    { icon: FiClock, label: "Thời gian rảnh", value: formValues.availableTime },
  ];

  return (
    <section className="tutor-profile-page">
      <div className="tutor-profile-summary">
        <div>
          <p className="tutor-profile-summary__eyebrow">Hồ sơ gia sư</p>
          <h2 className="tutor-profile-summary__title">
            {hasTutorProfile ? "Hồ sơ chuyên môn của bạn" : "Tạo hồ sơ gia sư"}
          </h2>
          <p className="tutor-profile-summary__description">
            Hoàn thiện hồ sơ để phụ huynh nhìn nhanh được điểm mạnh, khu vực dạy và kinh nghiệm của bạn.
          </p>
        </div>

        <div className="tutor-profile-summary__badges">
          {highlights.map(({ icon: Icon, label, value }) => (
            <div key={label} className="tutor-profile-summary__badge">
              <span className="tutor-profile-summary__badge-icon">
                <Icon />
              </span>
              <div>
                <p>{label}</p>
                <strong>{value}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tutor-profile-card">
        <div className="tutor-profile-card__header">
          <div>
            <h3>{isEditing ? (hasTutorProfile ? "Cập nhật hồ sơ gia sư" : "Tạo hồ sơ gia sư") : "Thông tin hồ sơ"}</h3>
            <p>Mỗi dòng là một mục thông tin rõ ràng để phụ huynh đọc nhanh và nắm ngay thế mạnh của bạn.</p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              className="tutor-profile-card__primary"
              onClick={() => setIsEditing(true)}
              disabled={loadingProfile || hasTutorProfile === null}
            >
              <FiEdit3 />
              <span>{hasTutorProfile ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ"}</span>
            </button>
          ) : null}
        </div>

        {loadingProfile ? <p className="tutor-profile-card__message">Đang tải hồ sơ hiện tại...</p> : null}
        {error ? <p className="tutor-profile-card__message tutor-profile-card__message--error">{error}</p> : null}
        {success ? <p className="tutor-profile-card__message tutor-profile-card__message--success">{success}</p> : null}

        {isEditing ? (
          <form className="tutor-profile-form" onSubmit={handleSubmit}>
            <div className="tutor-profile-form__grid">
              <div className="tutor-profile-field tutor-profile-field--full">
                <label htmlFor="achievements">Thành tích</label>
                <input
                  id="achievements"
                  name="achievements"
                  value={formValues.achievements}
                  onChange={handleChange}
                  placeholder="Ví dụ: IELTS 8.0, nhiều học sinh đậu trường chuyên"
                />
              </div>

              <div className="tutor-profile-field tutor-profile-field--full">
                <label htmlFor="experience">Kinh nghiệm</label>
                <input
                  id="experience"
                  name="experience"
                  value={formValues.experience}
                  onChange={handleChange}
                  placeholder="Ví dụ: 3 năm dạy Toán THCS và luyện thi vào 10"
                />
              </div>

              <div className="tutor-profile-field">
                <label htmlFor="teachingArea">Khu vực dạy</label>
                <input
                  id="teachingArea"
                  name="teachingArea"
                  value={formValues.teachingArea}
                  onChange={handleChange}
                  placeholder="Ví dụ: Cầu Giấy, Thanh Xuân, online"
                />
              </div>

              <div className="tutor-profile-field">
                <label htmlFor="school">Trường</label>
                <input
                  id="school"
                  name="school"
                  value={formValues.school}
                  onChange={handleChange}
                  placeholder="Ví dụ: Đại học Ngoại ngữ - ĐHQGHN"
                />
              </div>

              <div className="tutor-profile-field tutor-profile-field--full">
                <label htmlFor="availableTime">Thời gian rảnh</label>
                <input
                  id="availableTime"
                  name="availableTime"
                  value={formValues.availableTime}
                  onChange={handleChange}
                  placeholder="Ví dụ: Tối các ngày trong tuần và cuối tuần"
                />
              </div>

              <div className="tutor-profile-field tutor-profile-field--full">
                <label htmlFor="bio">Giới thiệu</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formValues.bio}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn gọn phong cách dạy, thế mạnh và đối tượng học viên phù hợp"
                  rows={4}
                />
              </div>
            </div>

            <div className="tutor-profile-form__actions">
              <button type="button" className="tutor-profile-card__secondary" onClick={handleCancel} disabled={loading}>
                <FiX />
                <span>Hủy</span>
              </button>

              <button
                type="submit"
                className="tutor-profile-card__primary"
                disabled={loading || loadingProfile || hasTutorProfile === null}
              >
                <FiSave />
                <span>
                  {loading
                    ? hasTutorProfile
                      ? "Đang cập nhật..."
                      : "Đang tạo..."
                    : hasTutorProfile
                      ? "Lưu thay đổi"
                      : "Tạo hồ sơ"}
                </span>
              </button>
            </div>
          </form>
        ) : (
          <div className="tutor-profile-details">
            {detailItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="tutor-profile-details__item">
                <div className="tutor-profile-details__label">
                  <Icon />
                  <span>{label}</span>
                </div>
                <div className="tutor-profile-details__value">{value?.trim() ? value : "Chưa cập nhật"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TutorInfo;
