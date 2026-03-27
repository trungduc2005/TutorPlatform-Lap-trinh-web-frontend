import axios from "axios";
import { FeaturedTutorDTO } from "../types/tutor";

const api = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
});
export const getFeaturedTutors = async (): Promise<FeaturedTutorDTO[]> => {
  const res = await api.get("/public/featured_tutors");
  return res.data;
};
export const getTutorById = async (id: number) => {
  const res = await axios.get("http://localhost:8081/public/featured_tutors");
  return res.data.find((t: any) => t.id === id);
};