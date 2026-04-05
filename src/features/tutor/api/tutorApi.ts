import axiosClient from "../../../shared/api/axiosClient";
import { FeaturedTutorDTO } from "../model/tutorTypes";

export const getFeaturedTutors = async (): Promise<FeaturedTutorDTO[]> => {
  const res = await axiosClient.get("/featured_tutors");
  return res.data.items ?? [];
};

export const getTutorById = async (id: number): Promise<FeaturedTutorDTO> => {
  const res = await axiosClient.get(`/featured_tutors/${id}`);
  return res.data.items;
};