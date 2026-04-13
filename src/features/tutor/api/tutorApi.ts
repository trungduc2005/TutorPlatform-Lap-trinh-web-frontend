import axiosClient from "../../../shared/api/axiosClient";
import type { FeaturedTutorDTO, PublicTutorProfileDTO } from "../model/tutorTypes";

export const getFeaturedTutors = async (): Promise<FeaturedTutorDTO[]> => {
  const res = await axiosClient.get<FeaturedTutorDTO[]>("/public/featured_tutors");
  console.log(res.data);
  return res.data;
};

export const getTutorById = async (tutorUserId: number): Promise<FeaturedTutorDTO> => {
  const res = await axiosClient.get<FeaturedTutorDTO>(`/public/tutors/${tutorUserId}`);
  return res.data;
};

export const getPublicTutorProfileById = async (id: number): Promise<PublicTutorProfileDTO> => {
  const res = await axiosClient.get<PublicTutorProfileDTO>(`/public/tutor/${id}`);
  return res.data;
};