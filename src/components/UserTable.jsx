import { useState, useMemo } from "react";
import PropTypes from 'prop-types';
import { Search, Edit2, Trash2 } from "lucide-react";
import debounce from "lodash/debounce";
import Pagination from "./Pagination"; 


const UserTable = ({
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

    const filteredUsers = useMemo(() => {
        if (!enableSearch || !searchTerm) return users;

        const filtered = new Map();
        for (const [id, user] of users.entries()) {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            if (fullName.includes(searchTerm.toLowerCase())) {
                filtered.set(id, user);
            }
        }
        return filtered;
    }, [users, searchTerm, enableSearch]);

    const { paginatedUsers, totalPages } = useMemo(() => {
        
        if (!enablePagination) return { paginatedUsers: filteredUsers, totalPages: 1 };

        const total = Math.ceil(filteredUsers.size / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        
        const paginated = new Map();
        let count = 0;
        let added = 0;
        
        for (const [id, user] of filteredUsers.entries()) {
            if (count >= start && added < itemsPerPage) {
                paginated.set(id, user);
                added++;
            }
            count++;
        }
        return {
            paginatedUsers: paginated,
            totalPages: total
        };
    }, [filteredUsers, currentPage, enablePagination, itemsPerPage]);
    
    const handleSearch = useMemo(
        () => debounce((term) => {
            setSearchTerm(term);
            setCurrentPage(1);
        }, 300),
        []
    );

    return (
        <div className={className}>
            {enableSearch && (
                <div className="flex w-full max-w-sm mb-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="input input-bordered w-full pr-10"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th className="bg-base-100">Name</th>
                            <th className="bg-base-100">Total Expenses</th>
                            <th className="bg-base-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...paginatedUsers.entries()].reverse().map(([id, user]) => (
                            <tr key={id} className="hover border-base-200">
                                <td className="font-medium">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td>
                                    <div className="badge badge-ghost">
                                        ${user.totalExpenses.toFixed(2)}
                                    </div>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => onEdit?.({ id, ...user })}
                                            title="Edit user"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {deleteConfirmId === id ? (
                                            <div className="flex gap-1">
                                                <button
                                                    className="btn btn-error btn-sm"
                                                    onClick={() => {
                                                        onDelete?.(id);
                                                        setDeleteConfirmId(null);
                                                    }}
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => setDeleteConfirmId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-ghost btn-sm hover:bg-error hover:text-white"
                                                onClick={() => setDeleteConfirmId(id)}
                                                title="Delete user"
                                            >
                                                <Trash2 className="w-4 h-4 text-error" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {enablePagination && totalPages > 1 && (
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

UserTable.propTypes = {
    users: PropTypes.instanceOf(Map).isRequired,
    className: PropTypes.string,
    enableSearch: PropTypes.bool,
    enablePagination: PropTypes.bool,
    itemsPerPage: PropTypes.number,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};

export default UserTable;