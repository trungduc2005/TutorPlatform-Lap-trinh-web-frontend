import axios from "axios";

export const getMyClassApplications = async () => {
  const res = await axios.get(
    "http://localhost:8081/tutor/class-applications",
    {
      params: {
        page: 0,
        size: 10,
      },
      withCredentials: true,
    }
  );
  return res.data;
};