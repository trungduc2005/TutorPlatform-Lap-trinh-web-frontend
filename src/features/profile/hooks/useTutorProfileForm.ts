import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../../../app/store/hooks";
import type { UserRole } from "../../../shared/model/enums";
import type { TutorProfilePayload } from "../model/tutorProfileType";
import { tutorProfileApi } from "../api/tutorProfileApi";
import { ApiError } from "../../../shared/api/axiosClient";
import { setHasTutorProfile } from "../../auth/model/authSlice";

const initialTutorProfileForm: TutorProfilePayload = {
  experience: "",
  achievements: "",
  teachingArea: "",
  bio: "",
  school: "",
  availableTime: "",
};

export function useTutorProfileForm(hasTutorProfile: boolean | null, role?: UserRole) {
  const dispatch = useAppDispatch();

  const [formValues, setFormValues] = useState<TutorProfilePayload>({ ...initialTutorProfileForm });
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (role !== "TUTOR") {
      return;
    }

    if (hasTutorProfile === false) {
      setFormValues({ ...initialTutorProfileForm });
      return;
    }

    if (hasTutorProfile !== true) {
      return;
    }

    let ignore = false;

    const loadTutorProfile = async () => {
      try {
        setLoadingProfile(true);
        setError("");

        const profile = await tutorProfileApi.getMyTutorProfile();

        if (ignore) {
          return;
        }

        setFormValues({
          experience: profile.experience ?? "",
          achievements: profile.achievements ?? "",
          teachingArea: profile.teachingArea ?? "",
          bio: profile.bio ?? "",
          school: profile.school ?? "",
          availableTime: profile.availableTime ?? "",
        });
      } catch (err) {
        if (ignore) {
          return;
        }

        if (err instanceof ApiError && err.status === 404) {
          dispatch(setHasTutorProfile(false));
          setFormValues({ ...initialTutorProfileForm });
          return;
        }

        setError(err instanceof Error ? err.message : "Không thể tải hồ sơ gia sư");
      } finally {
        if (!ignore) {
          setLoadingProfile(false);
        }
      }
    };

    loadTutorProfile();

    return () => {
      ignore = true;
    };
  }, [dispatch, hasTutorProfile, role]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const resetForm = async () => {
    setError("");
    setSuccess("");

    if (hasTutorProfile === true) {
      try {
        setLoadingProfile(true);
        const profile = await tutorProfileApi.getMyTutorProfile();

        setFormValues({
          experience: profile.experience ?? "",
          achievements: profile.achievements ?? "",
          teachingArea: profile.teachingArea ?? "",
          bio: profile.bio ?? "",
          school: profile.school ?? "",
          availableTime: profile.availableTime ?? "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải hồ sơ gia sư");
      } finally {
        setLoadingProfile(false);
      }

      return;
    }

    setFormValues({ ...initialTutorProfileForm });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasTutorProfile === null) {
      setError("Đang kiểm tra trạng thái hồ sơ, vui lòng thử lại sau.");
      return;
    }

    const hasEmptyField = Object.values(formValues).some((value) => !value.trim());

    if (hasEmptyField) {
      setError("Vui lòng nhập đầy đủ thông tin hồ sơ gia sư.");
      return;
    }

    const isUpdateMode = hasTutorProfile === true;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = isUpdateMode
        ? await tutorProfileApi.updateTutorProfile(formValues)
        : await tutorProfileApi.createTutorProfile(formValues);

      if (!isUpdateMode) {
        dispatch(setHasTutorProfile(true));
      }

      setSuccess(
        typeof result === "string" && result.trim()
          ? result
          : isUpdateMode
            ? "Cập nhật hồ sơ gia sư thành công."
            : "Tạo hồ sơ gia sư thành công."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isUpdateMode
            ? "Cập nhật hồ sơ gia sư thất bại."
            : "Tạo hồ sơ gia sư thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formValues,
    loading,
    loadingProfile,
    error,
    success,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
