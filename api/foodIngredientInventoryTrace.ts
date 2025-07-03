export async function getFoodIngredientInventoryTrace(
    token: string,
    page = 0,
    size = 10,
    sort = "-id"
) {
    const res = await fetch(
        `https://corerest.selopian.us/api/food_ingredient_inventory_trace?page=${page}&size=${size}&sort=${sort}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch inventory trace");
    }
    return res.json();
}
