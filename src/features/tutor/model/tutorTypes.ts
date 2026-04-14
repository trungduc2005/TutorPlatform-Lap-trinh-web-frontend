import defaultAvatar from "../../../assets/tutor-profile.svg";

export interface FeaturedTutorDTO {
  id: number;
  tutorUserId: number;
  fullName: string;
  avatarUrl: string;
  email: string;
  phone: string;
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
  id: number;
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

const MOJIBAKE_PATTERN = /[ÃÂÆÄÅá»áº]/;

function repairVietnameseText(value: string): string {
  if (!value || !MOJIBAKE_PATTERN.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(Array.from(value).map((char) => char.charCodeAt(0) & 0xff));
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    return decoded.includes("�") ? value : decoded;
  } catch {
    return value;
  }
}

export const normalizePublicTutorProfile = (
  tutor: PublicTutorProfileDTO
): PublicTutorProfileDTO => ({
  ...tutor,
  fullName: repairVietnameseText(tutor.fullName),
  experience: repairVietnameseText(tutor.experience),
  achievements: repairVietnameseText(tutor.achievements),
  teachingArea: repairVietnameseText(tutor.teachingArea),
  bio: repairVietnameseText(tutor.bio),
  school: repairVietnameseText(tutor.school),
  availableTime: repairVietnameseText(tutor.availableTime),
});

export const mapTutor = (t: FeaturedTutorDTO): Tutor => ({
  id: t.tutorUserId,
  featuredId: t.id,
  fullName: repairVietnameseText(t.fullName),
  avatarUrl: t.avatarUrl || defaultAvatar,
  school: repairVietnameseText(t.school),
  achievements: repairVietnameseText(t.achievements),
  experience: repairVietnameseText(t.experience),
  teachingArea: repairVietnameseText(t.teaching_area),
  bio: repairVietnameseText(t.bio),
  availableTime: repairVietnameseText(t.availableTime),
});