import { useState, useEffect } from "react";
import api from "../../util/Axios.js";

// Custom Delete Modal Component
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-sm border border-base-200 p-6 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-error">Confirm Deletion</h3>
                <p className="text-base-content/70">
                    Are you sure you want to delete this user?
                    <br />
                    <span className="text-xs font-bold text-error block mt-1">This action cannot be undone.</span>
                </p>
                <div className="flex justify-end gap-3 mt-2">
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-error btn-sm text-white"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner loading-xs"></span> : "Delete User"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

    // Delete modal state
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [filters, setFilters] = useState({
        name: "",
        lastName: "",
        email: "",
        pesel: "",
        role: ""
    });

    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    // Debounce filters
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
            setPage(0); // Reset to first page on filter change
        }, 500);
        return () => clearTimeout(handler);
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Prepare payload: convert empty strings to null for backend compatibility
            const payload = {
                page,
                name: debouncedFilters.name || null,
                lastName: debouncedFilters.lastName || null,
                email: debouncedFilters.email || null,
                pesel: debouncedFilters.pesel || null,
                role: debouncedFilters.role || null,
                sortBy: sortConfig.key,
                sortDirection: sortConfig.direction
            };

            const response = await api.post("/api/admin/users", payload, { withCredentials: true });

            // Safe access to items
            const items = response.data?.items || [];
            setUsers(items);
            setTotalPages(response.data?.totalPages || 0);
        } catch (err) {
            console.error("Error fetching users:", err);
            setUsers([]); // Reset on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, debouncedFilters, sortConfig]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return <span className="opacity-20 ml-1">↕</span>;
        return <span className="ml-1 text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    };

    const openDeleteModal = (userId) => {
        setDeleteModal({ isOpen: true, userId });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, userId: null });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.userId) return;
        setDeleteLoading(true);
        try {
            await api.delete(`/api/admin/users/${deleteModal.userId}`, { withCredentials: true });

            // Clear users immediately to force "Loading..." state visibility
            setUsers([]);

            closeDeleteModal();
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user: " + (err.response?.data || err.message));
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[70vh]">
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
            />

            {/* Top Bar: Filters */}
            <div className="bg-base-200 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                    type="text"
                    name="name"
                    placeholder="First Name"
                    className="input input-sm input-bordered"
                    value={filters.name}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="input input-sm input-bordered"
                    value={filters.lastName}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    className="input input-sm input-bordered"
                    value={filters.email}
                    onChange={handleFilterChange}
                />
                <select
                    name="role"
                    className="select select-sm select-bordered"
                    value={filters.role}
                    onChange={handleFilterChange}
                >
                    <option value="">All Roles</option>
                    <option value="ROLE_ADMIN">Admin</option>
                    <option value="ROLE_DOCTOR">Doctor</option>
                    <option value="ROLE_USER">Patient</option>
                    <option value="ROLE_LAB">Lab</option>
                </select>
            </div>

            {/* List Content */}
            <div className="overflow-x-auto flex-1 bg-base-100 rounded-lg shadow border border-base-200">
                <table className="table table-pin-rows w-full">
                    <thead>
                        <tr>
                            <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort('id')}>
                                ID <SortIcon columnKey="id" />
                            </th>
                            <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort('name')}>
                                Name <SortIcon columnKey="name" />
                            </th>
                            <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort('email')}>
                                Email <SortIcon columnKey="email" />
                            </th>
                            <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort('role')}>
                                Role <SortIcon columnKey="role" />
                            </th>
                            <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort('createdAt')}>
                                Created <SortIcon columnKey="createdAt" />
                            </th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && users.length === 0 ? (
                            <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="6" className="text-center p-4 opacity-50">No users found</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} className="hover">
                                    <td className="font-mono text-xs opacity-50">{user.id}</td>
                                    <td>
                                        <div className="font-bold">{user.name} {user.lastName}</div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge badge-sm ${user.role === 'ROLE_ADMIN' ? 'badge-error' :
                                            user.role === 'ROLE_DOCTOR' ? 'badge-primary' :
                                                user.role === 'ROLE_USER' ? 'badge-accent' : 'badge-ghost'
                                            }`}>
                                            {user.role === 'ROLE_USER' ? 'PATIENT' : user.role?.replace('ROLE_', '')}
                                        </span>
                                    </td>
                                    <td className="text-xs opacity-70">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="text-right">
                                        <button
                                            className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                            onClick={() => openDeleteModal(user.id)}
                                            title="Delete User"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    <button
                        className="btn btn-sm"
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                    >
                        «
                    </button>
                    <span className="btn btn-sm btn-ghost cursor-default">
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        className="btn btn-sm"
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                    >
                        »
                    </button>
                </div>
            )}
        </div>
    );
}
