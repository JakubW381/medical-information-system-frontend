import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../../../util/Axios";

export default function MedicalExaminationsPage() {
    const { safeUser } = useOutletContext();
    const [page, setPage] = useState(0);
    const [request, setRequest] = useState({
        page: 0,
        size: 10,
        sortDirection: "desc",
        sortBy: "date",
        search: ""
    });

    const [examinationsPage, setExaminationsPage] = useState({ items: [], totalPages: 0, totalElements: 0 });
    const navigate = useNavigate();

    const fetchExaminations = async () => {
        if (!safeUser || !safeUser.role) return;
        const endpoint = safeUser.role === 'ROLE_DOCTOR' ? "/api/doc/examinations" : "/api/user/examinations";
        try {
            const response = await api.post(endpoint, { ...request, page }, { withCredentials: true });
            setExaminationsPage(response.data);
        } catch (err) {
            console.error("Error fetching examinations:", err);
        }
    };

    useEffect(() => {
        fetchExaminations();
    }, [page, request.search, request.sortDirection, request.sortBy, safeUser]);

    const handleSearchChange = (e) => {
        setRequest({ ...request, search: e.target.value });
        setPage(0);
    };

    const handleSortChange = (column) => {
        if (request.sortBy === column) {
            setRequest({ ...request, sortDirection: request.sortDirection === "asc" ? "desc" : "asc" });
        } else {
            setRequest({ ...request, sortBy: column, sortDirection: "asc" });
        }
    };

    const handlePrevPage = () => { if (page > 0) setPage(page - 1); };
    const handleNextPage = () => { if (page < examinationsPage.totalPages - 1) setPage(page + 1); };

    return (
        <div className="flex flex-col w-full h-full p-4 gap-4">
            <h1 className="text-2xl font-bold">Medical Examinations</h1>

            <div className="flex gap-4 items-center bg-base-200 p-4 rounded-xl shadow">
                <input
                    type="text"
                    placeholder={safeUser?.role === 'ROLE_DOCTOR' ? "Search by Patient Name" : "Search by Doctor Name"}
                    className="input input-bordered w-full max-w-xs"
                    value={request.search}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSortChange("id")}>ID {request.sortBy === "id" && (request.sortDirection === "asc" ? "▲" : "▼")}</th>
                            <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSortChange("date")}>Date {request.sortBy === "date" && (request.sortDirection === "asc" ? "▲" : "▼")}</th>
                            <th>{safeUser?.role === 'ROLE_DOCTOR' ? "Patient" : "Doctor"}</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examinationsPage.items.length === 0 ? (
                            <tr><td colSpan="4" className="text-center p-4">No examinations found</td></tr>
                        ) : (
                            examinationsPage.items.map(exam => (
                                <tr key={exam.id} className="hover">
                                    <td>{exam.id}</td>
                                    <td>{new Date(exam.date).toLocaleString()}</td>
                                    <td className="font-bold">
                                        {safeUser?.role === 'ROLE_DOCTOR'
                                            ? `${exam.patientName} ${exam.patientLastName}`
                                            : `${exam.doctorName} ${exam.doctorLastName}`}
                                    </td>
                                    <td className="truncate max-w-xs" title={exam.description}>{exam.description}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {examinationsPage.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <button className="btn btn-sm btn-outline" onClick={handlePrevPage} disabled={page === 0}>&lt;</button>
                    <span>Page {page + 1} of {examinationsPage.totalPages}</span>
                    <button className="btn btn-sm btn-outline" onClick={handleNextPage} disabled={page >= examinationsPage.totalPages - 1}>&gt;</button>
                </div>
            )}
        </div>
    );
}
