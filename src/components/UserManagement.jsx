import { Users, X, AlertCircle } from "lucide-react"
import { useState } from "react"
import UserTable from "./UserTable";
import { useAppState, useAppDispatch, appActions } from '../contexts/AppContext';

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
    
    const { users } = useAppState();
    const dispatch = useAppDispatch();

    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: ""
    });
    
    
    const validateForm = () => {
        const newErrors = {
            firstName: "",
            lastName: ""
        };
        
        if (!firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (firstName.length < 2) {
            newErrors.firstName = "First name must be at least 2 characters";
        }
        else if (firstName.length > 50) {
            newErrors.firstName = "First name must be no more than 50 characters";
        }
        
        if (!lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (lastName.length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters";
        }
        else if (lastName.length > 50) {
            newErrors.lastName = "Last name must be no more than 50 characters";
        }
        
        setErrors(newErrors);
        return !newErrors.firstName && !newErrors.lastName;
    };

    
    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setEditingUser(null);
        setIsAdding(false);
        setErrors({
            firstName: "",
            lastName: ""
        });
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        dispatch(appActions.addUser(firstName, lastName));
        resetForm();
    };

    
    const handleUpdate = (e) => {
        e.preventDefault();
        if (!editingUser || !validateForm()) return;
        
        dispatch(appActions.updateUser(editingUser.id, firstName, lastName));
        resetForm();
    };

    
    const handleEdit = (user) => {
        setEditingUser(user);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setIsAdding(false);
        setErrors({
            firstName: "",
            lastName: ""
        });
    };

    
    const handleDelete = (userId) => {
        dispatch(appActions.deleteUser(userId));
    };

    
    const renderForm = (isEdit) => (
        <div className="card bg-100 mb-6 shadow-xl">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <h3 className="card-title">
                        {isEdit ? "Edit User" : "Add New User"}
                    </h3>
                    <button className="btn btn-ghost btn-sm" onClick={resetForm}>
                        <X className="w-4 h-4"/>
                    </button>
                </div>

                <form onSubmit={isEdit ? handleUpdate : handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">First Name</span>
                            </label>
                            <input 
                                type="text" 
                                className={`input input-bordered ${errors.firstName ? 'input-error' : ''}`}
                                placeholder="Enter First Name" 
                                value={firstName} 
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                    if (errors.firstName) {
                                        setErrors(prev => ({...prev, firstName: ""}));
                                    }
                                }}
                            />
                            {errors.firstName && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.firstName}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Last Name</span>
                            </label>
                            <input 
                                type="text"  
                                className={`input input-bordered ${errors.lastName ? 'input-error' : ''}`}
                                placeholder="Enter Last Name" 
                                value={lastName} 
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    if (errors.lastName) {
                                        setErrors(prev => ({...prev, lastName: ""}));
                                    }
                                }}
                            />
                            {errors.lastName && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.lastName}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="card-actions justify-end">
                        <button type="submit" className="btn btn-primary">
                            {isEdit ? "Update User" : "Save User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6"/>
                    <h2 className="text-2xl font-bold">User Management</h2>
                </div>
                
                {!editingUser && (
                    <button 
                        className={`btn ${isAdding ? "btn-error" : "btn-primary"}`} 
                        onClick={() => setIsAdding(!isAdding)}
                    >
                        {isAdding ? "Cancel" : "Add User"}
                    </button>
                )}
            </div>
            
            {(isAdding || editingUser) && renderForm(!!editingUser)}

            {users.size > 0 ? (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <UserTable
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
                    <AlertCircle className="w-5 h-5"/>
                    <span>No users added yet.</span>
                </div>
            )}
        </div>
    );
};

export default UserManagement;