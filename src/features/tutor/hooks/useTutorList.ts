import { useState, useEffect } from "react";
import { getFeaturedTutors } from "../api/tutorApi";
import { mapTutor, type Tutor } from "../model/tutorTypes";

export const useTutorList = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const data = await getFeaturedTutors();
      setTutors(data.map(mapTutor));
    } catch (err: any) {
      setError(err.message || "Lỗi khi load tutor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return { tutors, loading, error, refetch: fetchTutors };
};