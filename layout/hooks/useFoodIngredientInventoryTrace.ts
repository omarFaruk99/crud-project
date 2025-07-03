import { getFoodIngredientInventoryTrace } from "@/api/foodIngredientInventoryTrace";
import { useEffect, useState } from "react";

export default function useFoodIngredientInventoryTrace(token: string) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        getFoodIngredientInventoryTrace(token)
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    return { data, loading, error };
}
