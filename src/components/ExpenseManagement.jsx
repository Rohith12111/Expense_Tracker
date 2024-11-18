import { useState } from "react";
import { AlertCircle, Receipt } from "lucide-react";
import ExpenseTable from "./ExpenseTable";
import { useAppState, useAppDispatch, appActions } from '../contexts/AppContext';

const ITEMS_PER_PAGE = 10;

const ExpenseManagement = () => {
    const { users, expenses } = useAppState();
    const dispatch = useAppDispatch();

    const [selectedUser, setSelectedUser] = useState("");
    const [category, setCategory] = useState("Meals");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!selectedUser) {
            newErrors.user = "Please select a user";
        }

        if (!description.trim()) {
            newErrors.description = "Description is required";
        } else if (description.length < 5) {
            newErrors.description = "Description must be at least 5 characters";
        }

        const costNumber = parseFloat(cost);
        if (!cost) {
            newErrors.cost = "Cost is required";
        } else if (isNaN(costNumber) || costNumber <= 0) {
            newErrors.cost = "Please enter a valid positive amount";
        } else if (costNumber > 10000000) {
            newErrors.cost = "Amount cannot exceed $10000000";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setSelectedUser("");
        setCategory("Meals");
        setDescription("");
        setCost("");
        setErrors({});
        setEditingExpense(null);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setSelectedUser(expense.userId);
        setCategory(expense.category);
        setDescription(expense.description);
        setCost(expense.cost.toString());
        setIsAdding(true);
    };

    const handleDelete = (expenseId) => {
        const expense = expenses.find((e) => e.id === expenseId);
        if (!expense) return;
        dispatch(appActions.deleteExpense(expenseId, expense));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const costNumber = parseFloat(cost);

        if (editingExpense) {
            dispatch(appActions.updateExpense(
                editingExpense.id,
                {
                    userId: selectedUser,
                    category,
                    description,
                    cost: costNumber
                },
                editingExpense
            ));
        } else {
            dispatch(appActions.addExpense(
                selectedUser,
                category,
                description,
                costNumber
            ));
        }

        resetForm();
        setIsAdding(false);
    };

    const handleCancel = () => {
        resetForm();
        setIsAdding(false);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Receipt className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Expense Management</h2>
                </div>
                <button
                    className={`btn ${isAdding ? "btn-error" : "btn-primary"}`}
                    onClick={() => isAdding ? handleCancel() : setIsAdding(true)}
                >
                    {isAdding ? "Cancel" : "Add Expense"}
                </button>
            </div>

            {isAdding && (
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <h3 className="card-title mb-4">
                            {editingExpense ? "Edit Expense" : "New Expense"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control w-full">
                                    <select
                                        className={`select select-bordered w-full ${
                                            errors.user ? "select-error" : ""
                                        }`}
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                    >
                                        <option value="">Select User</option>
                                        {Array.from(users.entries()).map(([id, user]) => (
                                            <option key={id} value={id}>
                                                {user.firstName} {user.lastName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.user && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                {errors.user}
                                            </span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control w-full">
                                    <select
                                        className="select select-bordered w-full"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="Meals">Meals</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Software">Software</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-control">
                                <textarea
                                    className={`textarea textarea-bordered h-24 ${
                                        errors.description ? "textarea-error" : ""
                                    }`}
                                    placeholder="Enter description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {errors.description && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.description}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <input
                                    type="number"
                                    step="0.01"
                                    className={`input input-bordered ${
                                        errors.cost ? "input-error" : ""
                                    }`}
                                    placeholder="Enter cost"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                />
                                {errors.cost && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.cost}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="card-actions justify-end">
                                <button type="submit" className="btn btn-primary">
                                    {editingExpense ? "Update Expense" : "Save Expense"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {expenses.length > 0 ? (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <ExpenseTable
                            expenses={expenses}
                            users={users}
                            enableSearch={true}
                            enablePagination={true}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            ) : (
                <div className="alert alert-info">
                    <AlertCircle className="w-6 h-6" />
                    <span>No expenses added yet.</span>
                </div>
            )}
        </div>
    );
};

export default ExpenseManagement;