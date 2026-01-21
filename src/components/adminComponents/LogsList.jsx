import { useState, useEffect } from "react";
import api from "../../util/Axios.js";

const LogsList = () => {
    const [logs, setLogs] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    // Filter state
    const [filters, setFilters] = useState({
        search: "",
        logType: "",
        authorId: "",
        from: "",
        to: ""
    });

    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    // Debounce filters to avoid too many requests
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);
        return () => clearTimeout(handler);
    }, [filters]);

    // Fetch logs when page or filters change
    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                // Ensure dates are properly formatted if needed, or send as is
                // Backend expects LocalDateTime usually, but often string "yyyy-MM-dd" works or needs time appended
                // For now sending raw date string from input type="date"
                const payload = {
                    page: page,
                    search: debouncedFilters.search,
                    logType: debouncedFilters.logType || null,
                    authorId: debouncedFilters.authorId || null,
                    from: debouncedFilters.from ? debouncedFilters.from + "T00:00:00" : null,
                    to: debouncedFilters.to ? debouncedFilters.to + "T23:59:59" : null
                };

                const response = await api.post("/api/admin/logs", payload, { withCredentials: true });
                setLogs(response.data.items || []);
                setTotalPages(response.data.totalPages || 0);
            } catch (err) {
                console.error("Failed to fetch logs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [page, debouncedFilters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0); // Reset to first page on filter change
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            logType: "",
            authorId: "",
            from: "",
            to: ""
        });
        setPage(0);
    };

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Filters Section */}
            <div className="flex flex-wrap gap-2 items-end bg-base-200 p-4 rounded-lg">
                <div className="form-control w-full sm:w-auto">
                    <label className="label py-1"><span className="label-text text-xs">Search Intent</span></label>
                    <input
                        type="text"
                        name="search"
                        placeholder="Search logs..."
                        className="input input-sm input-bordered"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="form-control w-full sm:w-auto">
                    <label className="label py-1"><span className="label-text text-xs">Log Type</span></label>
                    <select
                        name="logType"
                        className="select select-bordered select-sm"
                        value={filters.logType}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Types</option>
                        <option value="LOGIN_ATTEMPT">Login Attempt</option>
                        <option value="USER_REGISTERED">User Registered</option>
                        <option value="USER_UPDATED">User Updated</option>
                        <option value="USER_DELETED">User Deleted</option>
                        <option value="DOCUMENT_SAVE">Document Saved</option>
                        <option value="DOCUMENT_SHARE">Document Shared</option>
                    </select>
                </div>
                <div className="form-control w-full sm:w-auto">
                    <label className="label py-1"><span className="label-text text-xs">From Date</span></label>
                    <input
                        type="date"
                        name="from"
                        className="input input-sm input-bordered"
                        value={filters.from}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="form-control w-full sm:w-auto">
                    <label className="label py-1"><span className="label-text text-xs">To Date</span></label>
                    <input
                        type="date"
                        name="to"
                        className="input input-sm input-bordered"
                        value={filters.to}
                        onChange={handleFilterChange}
                    />
                </div>
                <button className="btn btn-sm btn-ghost" onClick={clearFilters}>
                    Clear
                </button>
            </div>

            {/* Table Section */}
            <div className="flex-1 overflow-x-auto bg-base-100 rounded-lg shadow border border-base-200">
                <table className="table table-sm table-pin-rows">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th>ID</th>
                            <th>Timestamp</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Author</th>
                            <th>Target</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8 opacity-50">
                                    No logs found matching criteria
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-base-200/30">
                                    <td className="font-mono text-xs opacity-50">{log.id}</td>
                                    <td className="whitespace-nowrap text-xs">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td>
                                        <div className="badge badge-sm badge-outline">{log.logType}</div>
                                    </td>
                                    <td className="max-w-xs truncate" title={log.description}>
                                        {log.description}
                                    </td>
                                    <td>
                                        {log.author ? (
                                            <div className="flex flex-col text-xs">
                                                <span className="font-bold">{log.author.name} {log.author.lastName}</span>
                                                <span className="opacity-50">{log.author.email}</span>
                                            </div>
                                        ) : <span className="text-xs opacity-50">System</span>}
                                    </td>
                                    <td>
                                        {log.target ? (
                                            <div className="flex flex-col text-xs">
                                                <span className="font-bold">{log.target.name} {log.target.lastName}</span>
                                                <span className="opacity-50">{log.target.email}</span>
                                            </div>
                                        ) : <span className="text-xs opacity-50">-</span>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 p-2">
                <button
                    className="btn btn-sm"
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                >
                    «
                </button>
                <span className="btn btn-sm btn-ghost pointer-events-none">
                    Page {page + 1} of {totalPages || 1}
                </span>
                <button
                    className="btn btn-sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                >
                    »
                </button>
            </div>
        </div>
    );
};

export default LogsList;
