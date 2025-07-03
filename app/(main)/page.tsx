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
    const toast = useRef<Toast>(null);
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

    const [editVisible, setEditVisible] = useState(false);
    const [editForm, setEditForm] = useState({
        id: null,
        food_ingredient_id: 1,
        quantity: 0,
        total_amount: 0,
        supplier_id: 1,
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

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

    const openEditDialog = (rowData: any) => {
        setEditForm({
            id: rowData.id,
            food_ingredient_id: rowData.food_ingredient_id,
            quantity: rowData.quantity,
            total_amount: rowData.total_amount,
            supplier_id: rowData.supplier_id,
        });
        setEditVisible(true);
    };

    const handleEditChange = (name: string, value: any) => {
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError(null);
        try {
            const res = await fetch(
                `https://corerest.selopian.us/api/food_ingredient_inventory_trace/${editForm.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        food_ingredient_id: editForm.food_ingredient_id,
                        quantity: editForm.quantity,
                        total_amount: editForm.total_amount,
                        supplier_id: editForm.supplier_id,
                    }),
                }
            );
            if (!res.ok) throw new Error("Failed to update");
            setEditVisible(false);
        } catch (err: any) {
            setEditError(err.message || "Error");
        } finally {
            setEditLoading(false);
        }
    };

    // Delete handler
    const handleDelete = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                "https://corerest.selopian.us/api/food_ingredient_inventory_trace",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify([{ id }]),
                }
            );
            if (!res.ok) throw new Error("Failed to delete");
            // Optionally show toast
            if (toast.current)
                toast.current.show({
                    severity: "success",
                    summary: "Deleted",
                    detail: "Item deleted",
                });
            // Optionally refetch or update UI
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
            <Dialog
                header="Update Inventory Trace"
                visible={editVisible}
                style={{ width: "30vw" }}
                onHide={() => setEditVisible(false)}
            >
                <form onSubmit={handleEditSubmit} className="p-fluid">
                    <div className="field">
                        <label htmlFor="edit_food_ingredient_id">
                            Food Ingredient
                        </label>
                        <Dropdown
                            id="edit_food_ingredient_id"
                            value={editForm.food_ingredient_id}
                            options={foodIngredients?.map((fi: any) => ({
                                label: fi.name,
                                value: fi.id,
                            }))}
                            onChange={(e) =>
                                handleEditChange("food_ingredient_id", e.value)
                            }
                            placeholder="Select Ingredient"
                            required
                            filter
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="edit_quantity">Quantity</label>
                        <InputNumber
                            id="edit_quantity"
                            value={editForm.quantity}
                            onValueChange={(e) =>
                                handleEditChange("quantity", e.value)
                            }
                            required
                            minFractionDigits={2}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="edit_total_amount">Total Amount</label>
                        <InputNumber
                            id="edit_total_amount"
                            value={editForm.total_amount}
                            onValueChange={(e) =>
                                handleEditChange("total_amount", e.value)
                            }
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="edit_supplier_id">Supplier</label>
                        <Dropdown
                            id="edit_supplier_id"
                            value={editForm.supplier_id}
                            options={suppliers?.map((s: any) => ({
                                label: s.name,
                                value: s.id,
                            }))}
                            onChange={(e) =>
                                handleEditChange("supplier_id", e.value)
                            }
                            placeholder="Select Supplier"
                            required
                            filter
                        />
                    </div>
                    {editError && (
                        <small style={{ color: "red" }}>{editError}</small>
                    )}
                    <Button
                        type="submit"
                        label={editLoading ? "Updating..." : "Update"}
                        disabled={editLoading}
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
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <div style={{ display: "flex", gap: 8 }}>
                            <Button
                                label="Update"
                                icon="pi pi-pencil"
                                className="p-button-sm p-button-warning"
                                onClick={() => openEditDialog(rowData)}
                            />
                            <Button
                                label="Delete"
                                icon="pi pi-trash"
                                className="p-button-sm p-button-danger"
                                onClick={() => handleDelete(rowData.id)}
                            />
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
};

export default HomePage;
