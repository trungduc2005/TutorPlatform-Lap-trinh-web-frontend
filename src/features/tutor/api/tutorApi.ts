import axiosClient from "../../../shared/api/axiosClient";
import type { FeaturedTutorDTO } from "../model/tutorTypes";

export const getFeaturedTutors = async (): Promise<FeaturedTutorDTO[]> => {
  const res = await axiosClient.get<FeaturedTutorDTO[]>("/public/featured_tutors");
  return res.data;
};

export const getTutorById = async (tutorUserId: number): Promise<FeaturedTutorDTO> => {
  const res = await axiosClient.get<FeaturedTutorDTO>(`/public/tutors/${tutorUserId}`);
  return res.data;
};