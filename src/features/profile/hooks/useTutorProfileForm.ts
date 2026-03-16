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
}

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
            setFormValues(initialTutorProfileForm);
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
                })
            } catch (err) {
                if (ignore) {
                    return;
                }

                if (err instanceof ApiError && err.status === 404) {
                    dispatch(setHasTutorProfile(false));
                    setFormValues({ ...initialTutorProfileForm });
                }

                setError(err instanceof Error ? err.message : "Khong the tai ho so gia su");
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            };

            loadTutorProfile();

            return () => {
                ignore = true;
            };
        }
    }, [dispatch, hasTutorProfile, role]);

    const handleChange =(event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;

        setFormValues((prev) => ({
            ...prev, 
            [name] : value,
        }))
    }

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(hasTutorProfile === null){
            setError("Đang kiểm tra trạng thái hồ sơ, vui lòng thử lại sau.");
            return;
        }

        const hasEmptyField = Object.values(formValues).some((value) => !value.trim());

        if(hasEmptyField){
            setError("Vui lòng nhập đầy đủ thông tin hồ sơ gia sư.");
            return;
        }

        const isUpdateMode = hasTutorProfile === true;

        try{
            setLoading(true);
            setError("");
            setSuccess("");

            const result = isUpdateMode 
                ? await tutorProfileApi.updateTutorProfile(formValues)
                : await tutorProfileApi.createTutorProfile(formValues);

            if(!isUpdateMode){
                dispatch(setHasTutorProfile(true));
            }

            setSuccess(
                typeof result === "string" && result.trim()
                    ? result
                    : isUpdateMode
                      ? "Cap nhat ho so gia su thanh cong."
                      : "Tao ho so gia su thanh cong."
            );
        } catch(err){
            setError(
                err instanceof Error
                    ? err.message
                    : isUpdateMode
                      ? "Cap nhat ho so gia su that bai."
                      : "Tao ho so gia su that bai."
            );
        } finally {
            setLoading(false);
        }
    }

    return {
        formValues, 
        loading, 
        loadingProfile, 
        error, 
        success, 
        handleChange, 
        handleSubmit, 
    };
} 