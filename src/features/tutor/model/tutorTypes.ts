import defaultAvatar from "../../../assets/tutor-profile.svg";

export interface FeaturedTutorDTO {
  id: number;
  fullName: string;
  avatarUrl: string;
  experience: string;
  school: string;
  teaching_area: string;
  bio: string;
  availableTime: string;
}
export type Tutor = {
  id: number;
  fullName: string;
  avatarUrl: string;
  school: string;
  experience: string;
  teachingArea: string;
  bio: string;
  availableTime: string;
};
export const mapTutor = (t: FeaturedTutorDTO): Tutor => ({
  id: t.id,
  fullName: t.fullName,
  avatarUrl: t.avatarUrl || defaultAvatar,
  school: t.school,
  experience: t.experience,
  teachingArea: t.teaching_area,
  bio: t.bio,
  availableTime: t.availableTime,
});