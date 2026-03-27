import axios from "axios";
import { store } from "../../app/store/store";

export const getMyClassApplications = async () => {
  const token = store.getState().auth.token;
  const res = await axios.get(
    "http://localhost:8081/tutor/class-applications",
    {
      params: {
        page: 0,
        size: 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};