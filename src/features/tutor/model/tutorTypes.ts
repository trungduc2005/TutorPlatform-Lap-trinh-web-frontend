import defaultAvatar from "../../../assets/tutor-profile.svg";

export interface FeaturedTutorDTO {
  id: number;  
  tutorUserId: number;  
  title?: string;
  note?: string;
  displayOrder?: number;
  createdAt?: string;
  fullName: string;
  email?: string;
  phone?: string;
  avatarUrl: string;
  experience: string;
  school: string;
  achievements: string;
  teaching_area: string;
  bio: string;
  availableTime: string;
}

export interface PublicTutorProfileDTO {
  fullName: string;
  userId: number;
  experience: string;
  achievements: string;
  teachingArea: string;
  bio: string;
  school: string;
  availableTime: string;
}

export type Tutor = {
  id: number; // dùng tutorUserId cho route /tutors/:id
  featuredId: number;
  fullName: string;
  avatarUrl: string;
  school: string;
  achievements: string;
  experience: string;
  teachingArea: string;
  bio: string;
  availableTime: string;
};

export const mapTutor = (t: FeaturedTutorDTO): Tutor => ({
  id: t.tutorUserId,
  featuredId: t.id,
  fullName: t.fullName,
  avatarUrl: t.avatarUrl || defaultAvatar,
  school: t.school,
  achievements: t.achievements,
  experience: t.experience,
  teachingArea: t.teaching_area,
  bio: t.bio,
  availableTime: t.availableTime,
});
