import { useState, useMemo, useEffect } from "react";
import PropTypes from 'prop-types';
import { Search, Edit2, Trash2 } from "lucide-react";
import debounce from "lodash/debounce";
import Pagination from './Pagination'; 

const ExpenseTable = ({
    expenses = [],
    users,
    className = "",
    enableSearch = false,
    enablePagination = false,
    itemsPerPage = 10,
    onEdit,
    onDelete,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const getUserName = useMemo(() => {
        return (userId) => {
            const user = users.get(userId);
            return user ? `${user.firstName} ${user.lastName}` : "Unknown";
        };
    }, [users]);

    const debouncedSearch = useMemo(
        () => debounce((term) => {
            setSearchTerm(term);
            setCurrentPage(1);
        }, 300),
        []
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearch = (e) => {
        debouncedSearch(e.target.value);
    };

    const filteredExpenses = useMemo(() => {
        if (!enableSearch || !searchTerm) return expenses;

        return expenses.filter((expense) => {
            const userName = getUserName(expense.userId).toLowerCase();
            const searchString = `${userName} ${expense.description} ${expense.category}`.toLowerCase();
            return searchString.includes(searchTerm.toLowerCase());
        });
    }, [expenses, searchTerm, enableSearch, getUserName]);

    const paginatedExpenses = useMemo(() => {
        if (!enablePagination) return filteredExpenses;

        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredExpenses.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredExpenses, currentPage, enablePagination, itemsPerPage]);

    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

    const handleDeleteClick = (expenseId) => {
        setDeleteConfirmId(expenseId);
    };

    const handleDeleteConfirm = (expenseId) => {
        onDelete?.(expenseId);
        setDeleteConfirmId(null);
    };

    return (
        <div className={className}>
            {enableSearch && (
                <div className="flex w-full max-w-sm mb-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            className="input input-bordered w-full pr-10"
                            onChange={handleSearch}
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th className="bg-base-100">User</th>
                            <th className="bg-base-100">Category</th>
                            <th className="bg-base-100">Description</th>
                            <th className="bg-base-100">Cost</th>
                            <th className="bg-base-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedExpenses.map((expense) => (
                            <tr
                                key={expense.id}
                                className="hover border-base-200"
                            >
                                <td className="font-medium">
                                    {getUserName(expense.userId)}
                                </td>
                                <td>
                                    <div className="badge badge-ghost">
                                        {expense.category}
                                    </div>
                                </td>
                                <td>{expense.description}</td>
                                <td className="font-mono">
                                    ${expense.cost.toFixed(2)}
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => onEdit?.(expense)}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {deleteConfirmId === expense.id ? (
                                            <div className="flex gap-1">
                                                <button
                                                    className="btn btn-error btn-sm"
                                                    onClick={() =>
                                                        handleDeleteConfirm(expense.id)
                                                    }
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() =>
                                                        setDeleteConfirmId(null)
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-ghost btn-sm text-error"
                                                onClick={() =>
                                                    handleDeleteClick(expense.id)
                                                }
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {enablePagination && (
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

ExpenseTable.propTypes = {
    expenses: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            userId: PropTypes.string.isRequired,
            category: PropTypes.oneOf(['Meals', 'Travel', 'Software']).isRequired,
            description: PropTypes.string.isRequired,
            cost: PropTypes.number.isRequired
        })
    ).isRequired,
    users: PropTypes.instanceOf(Map).isRequired,
    className: PropTypes.string,
    enableSearch: PropTypes.bool,
    enablePagination: PropTypes.bool,
    itemsPerPage: PropTypes.number,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};

export default ExpenseTable;