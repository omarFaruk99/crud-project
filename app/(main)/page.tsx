"use client";
import PageHeading from "@/components/PageHeading";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { useFetch } from "@/layout/hooks/useFetch";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { useContext, useRef, useState } from "react";

const HomePage = () => {
    const toast = useRef(null);
    const { accessToken } = useContext(LayoutContext);

    const { data } = useFetch(
        "/api/food_ingredient_inventory_trace?page=0&size=10&sort=-id"
    );

    console.log("raw data", data);

    const items = data || [];
    console.log("items", items);

    const [visible, setVisible] = useState(false);
    const [form, setForm] = useState({
        food_ingredient_id: 1,
        quantity: 0,
        total_amount: 0,
        supplier_id: 1,
        parent_id: null, // Add this if required by your API
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch food ingredients and suppliers
    const { data: foodIngredients } = useFetch(
        "/api/food_ingredient?page=0&size=1100"
    );
    const { data: suppliers } = useFetch("/api/supplier?page=0&size=1100");

    const handleChange = (name: string, value: any) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                "https://corerest.selopian.us/api/food_ingredient_inventory_trace",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(form),
                }
            );
            if (!res.ok) throw new Error("Failed to submit");
            setVisible(false);
        } catch (err: any) {
            setError(err.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <PageHeading title={"Home"} />
            <Button
                label="Add Inventory Trace"
                icon="pi pi-plus"
                onClick={() => setVisible(true)}
            />
            <Dialog
                header="Add Inventory Trace"
                visible={visible}
                style={{ width: "30vw" }}
                onHide={() => setVisible(false)}
            >
                <form onSubmit={handleSubmit} className="p-fluid">
                    <div className="field">
                        <label htmlFor="food_ingredient_id">
                            Food Ingredient
                        </label>
                        <Dropdown
                            id="food_ingredient_id"
                            value={form.food_ingredient_id}
                            options={foodIngredients?.map((fi: any) => ({
                                label: fi.name,
                                value: fi.id,
                            }))}
                            onChange={(e) =>
                                handleChange("food_ingredient_id", e.value)
                            }
                            placeholder="Select Ingredient"
                            required
                            filter
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="quantity">Quantity</label>
                        <InputNumber
                            id="quantity"
                            value={form.quantity}
                            onValueChange={(e) =>
                                handleChange("quantity", e.value)
                            }
                            required
                            minFractionDigits={2}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="total_amount">Total Amount</label>
                        <InputNumber
                            id="total_amount"
                            value={form.total_amount}
                            onValueChange={(e) =>
                                handleChange("total_amount", e.value)
                            }
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="supplier_id">Supplier</label>
                        <Dropdown
                            id="supplier_id"
                            value={form.supplier_id}
                            options={suppliers?.map((s: any) => ({
                                label: s.name,
                                value: s.id,
                            }))}
                            onChange={(e) =>
                                handleChange("supplier_id", e.value)
                            }
                            placeholder="Select Supplier"
                            required
                            filter
                        />
                    </div>
                    {error && <small style={{ color: "red" }}>{error}</small>}
                    <Button
                        type="submit"
                        label={loading ? "Submitting..." : "Submit"}
                        disabled={loading}
                        className="mt-2"
                    />
                </form>
            </Dialog>
            <DataTable value={items} paginator rows={10}>
                <Column field="id" header="ID" />
                <Column
                    header="Ingredient"
                    body={(rowData) => rowData.food_ingredient?.name}
                />
                <Column
                    header="Unit"
                    body={(rowData) =>
                        rowData.food_ingredient?.amount_unit?.name
                    }
                />
                <Column field="quantity" header="Quantity" />
                <Column field="total_amount" header="Total Amount" />
                <Column field="paid_amount" header="Paid Amount" />
                <Column field="event_time" header="Event Time" />
            </DataTable>
        </div>
    );
};

export default HomePage;
