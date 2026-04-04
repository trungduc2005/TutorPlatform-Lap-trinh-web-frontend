import { useEffect, useState } from "react";
import { searchClass, type SearchClassResponse, type SearchClassesParams } from "../api/classApi";
import type { ClassItem } from "../model/classTypes";

export function useClassListing(initialParams?: SearchClassesParams){
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchClasses = async () => {
            try {
                setLoading(true);
                setError(null);

                const data: SearchClassResponse = await searchClass(initialParams);
                if (isMounted){
                    setClasses(data.items);
                }
            } catch (err){
                if (isMounted) {
                    setError(err instanceof Error ? err.message: "Got an error")
                }
            } finally {
                if (isMounted){
                    setLoading(false)
                }
            }
        }
        fetchClasses();
        return () => {
            isMounted = false;
        };
    }, [initialParams]);
    return {classes, loading, error}
}