import { useState, useEffect } from "react";
import { getTutorById } from "../api/tutorApi";
import { mapTutor, type Tutor } from "../model/tutorTypes";

export const useTutorDetail = (id: number) => {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTutor = async () => {
    try {
      setLoading(true);
      const data = await getTutorById(id);
      setTutor(mapTutor(data));
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải dữ liệu gia sư");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTutor();
  }, [id]);

  return { tutor, loading, error };
};