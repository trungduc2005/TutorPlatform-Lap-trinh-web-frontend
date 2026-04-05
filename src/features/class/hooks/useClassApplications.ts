import { useEffect, useState } from "react";
import { getMyClassApplications } from "../api/classApplicationsApi";
import { mapClassApplication, ClassApplication } from "../model/classTypes";

export const useClassApplications = () => {
  const [data, setData] = useState<ClassApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getMyClassApplications();
      setData(res.map(mapClassApplication));
    } catch (err: any) {
      setError(err.message || "Lỗi khi load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error };
};