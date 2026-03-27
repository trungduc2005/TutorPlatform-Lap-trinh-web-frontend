import { FeaturedTutorDTO } from "../types/tutor";
import defaultAvatar from "../../assets/tutor-profile.svg";

export const mapTutor = (t: any) => ({
  id: t.id,
  fullName: t.fullName,
  avatarUrl: t.avatarUrl || defaultAvatar,
  school: t.school,
  experience: t.experience,
  achievements: t.achievements,
  teaching_area : t.teaching_area,
  bio : t.bio,
  availableTime: t.availableTime,
});