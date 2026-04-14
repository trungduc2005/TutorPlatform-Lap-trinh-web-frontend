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
      setError(err.message || "L\u1ed7i khi t\u1ea3i d\u1eef li\u1ec7u gia s\u01b0");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTutor();
  }, [id]);

  return { tutor, loading, error };
};