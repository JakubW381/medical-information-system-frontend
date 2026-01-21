import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../util/Axios";
import PatientRecord from "../PatientRecord";

export default function PatientsPage() {
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState({
        search: "",
        dateOfBirth: "",
        gender: "ALL",
        address: "",
        phoneNumber: "",
        bloodType: "",
        allergies: "",
        chronicDiseases: "",
        medications: "",
        insuranceNumber: "",
    });
    const [activeTab, setActiveTab] = useState("all");
    const [assignedPatients, setAssignedPatients] = useState([]);
    const [examModal, setExamModal] = useState({ isOpen: false, patientId: null, date: "", description: "" });

    const [patientsPage, setPatientsPage] = useState({ items: [], totalPages: 0, totalElements: 0 });
    const navigate = useNavigate();

    const isAllowed = async () => {
        try {
            const response = await api.get("/api/auth/role", { withCredentials: true });
            if (!["ROLE_DOCTOR", "ROLE_ADMIN"].includes(response.data)) navigate("/main");
        } catch (err) {
            navigate("/sign-in");
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await api.post("/api/doc/patients", { page, ...filters }, { withCredentials: true });
            console.log({ page, ...filters })
            setPatientsPage(response.data);
        } catch (err) {
            console.error("Błąd przy pobieraniu strony pacjentów:", err);
        }
    };

    const fetchAssignedPatients = async () => {
        try {
            const response = await api.get("/api/doc/assigned-patients", { withCredentials: true });
            setAssignedPatients(response.data);
        } catch (err) {
            console.error("Error fetching assigned patients:", err);
        }
    };

    useEffect(() => { isAllowed(); }, []);

    // Fetch przy zmianie strony lub filtrów
    useEffect(() => {
        if (activeTab === "assigned") fetchAssignedPatients();
        else fetchPatients();
    }, [page, filters, activeTab]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(0); // reset strony przy nowym wyszukiwaniu
        // fetch odpalony automatycznie przez useEffect
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(0); // reset strony przy zmianie filtra
    };

    const handlePrevPage = () => { if (page > 0) setPage(page - 1); };
    const handleNextPage = () => { if (page < patientsPage.totalPages - 1) setPage(page + 1); };

    const handleAssignPatient = async (patientId) => {
        try {
            await api.post(`/api/doc/assign-patient/${patientId}`, {}, { withCredentials: true });
            alert("Patient assigned successfully");
        } catch (err) {
            console.error("Error assigning patient:", err);
            alert("Error assigning patient");
        }
    };

    const handleCreateExam = async () => {
        try {
            await api.post(`/api/doc/patient/${examModal.patientId}/examination`, {
                date: examModal.date,
                description: examModal.description
            }, { withCredentials: true });
            alert("Examination created successfully");
            setExamModal({ ...examModal, isOpen: false });
        } catch (err) {
            console.error("Error creating examination:", err);
            alert("Error creating examination");
        }
    };

    return (
        <div className="flex flex-col w-full h-full">

            {/* Exam Modal */}
            {examModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setExamModal({ ...examModal, isOpen: false })}>
                    <div className="bg-base-100 p-6 rounded-lg w-96 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">New Examination</h3>
                        <div className="form-control mb-2">
                            <label className="label">Date</label>
                            <input type="datetime-local" className="input input-bordered"
                                value={examModal.date} onChange={e => setExamModal({ ...examModal, date: e.target.value })} />
                        </div>
                        <div className="form-control mb-4">
                            <label className="label">Description</label>
                            <textarea className="textarea textarea-bordered h-24"
                                value={examModal.description} onChange={e => setExamModal({ ...examModal, description: e.target.value })}></textarea>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button className="btn btn-ghost" onClick={() => setExamModal({ ...examModal, isOpen: false })}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleCreateExam}>Create</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex w-full flex-col lg:flex-row gap-6 p-4">
                <aside className="lg:w-60 flex-shrink-0 bg-base-200 p-4 rounded-xl shadow-lg lg:sticky top-4 overflow-y-auto">
                    <form className="flex flex-col gap-4" onSubmit={handleSearchSubmit}>
                        <button
                            type="button"
                            onClick={() => setActiveTab(activeTab === "all" ? "assigned" : "all")}
                            className={`btn btn-sm w-full ${activeTab === "all" ? "btn-error btn-outline" : "btn-success"}`}
                        >
                            {activeTab === "all" ? "All Patients" : "My Patients"}
                        </button>

                        <input
                            type="text"
                            placeholder="Search by First/Last Name"
                            value={filters.search}
                            onChange={e => handleFilterChange("search", e.target.value)}
                            className="input input-bordered w-full"
                        />
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Date of Birth</label>
                            <input
                                type="date"
                                value={filters.dateOfBirth}
                                onChange={e => handleFilterChange("dateOfBirth", e.target.value)}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium">Gender</span>
                            <div className="grid gap-2 grid-cols-2 w-full">
                                {["FEMALE", "MALE"].map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => handleFilterChange("gender", g)}
                                        className={["btn btn-sm font-bold text-lg", filters.gender === g ? (g === "FEMALE" ? "btn-error" : "btn-info") : "btn-outline"].join(" ")}
                                    >
                                        {g === "FEMALE" ? "♀" : "♂"}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => handleFilterChange("gender", "ALL")}
                                className={["btn btn-sm w-full", filters.gender === "ALL" ? "btn-success" : "btn-outline"].join(" ")}
                            >Any</button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium">Blood Type</span>
                            <div className="grid grid-cols-4 gap-2">
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"].map(bt => (
                                    <button
                                        key={bt}
                                        type="button"
                                        onClick={() => handleFilterChange("bloodType", bt)}
                                        className={["btn btn-sm", filters.bloodType === bt ? "btn-error" : "btn-outline"].join(" ")}
                                    >{bt}</button>
                                ))}
                            </div>
                            <button type="button" onClick={() => handleFilterChange("bloodType", "")} className={["btn btn-sm w-full", filters.bloodType === "" ? "btn-error" : "btn-outline"].join(" ")}>Any</button>
                        </div>
                        {["address", "phoneNumber", "allergies", "chronicDiseases", "medications", "insuranceNumber"].map(f => (
                            <input
                                key={f}
                                type="text"
                                placeholder={f.charAt(0).toUpperCase() + f.slice(1).replace(/([A-Z])/g, " $1")}
                                value={filters[f]}
                                onChange={e => handleFilterChange(f, e.target.value)}
                                className="input input-bordered w-full"
                            />
                        ))}
                        <button type="submit" className="btn btn-success w-full mt-2">Search</button>


                    </form>
                </aside>

                <main className="flex-1 flex flex-col gap-4">
                    {activeTab === "all" && patientsPage.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <button className="btn btn-sm btn-outline" onClick={handlePrevPage} disabled={page === 0}>&lt;</button>
                            <input
                                type="number"
                                className="input input-bordered w-16 text-center"
                                value={page + 1}
                                onChange={(e) => {
                                    let newPage = parseInt(e.target.value, 10) - 1;
                                    if (newPage >= 0 && newPage < patientsPage.totalPages) setPage(newPage);
                                }}
                            />
                            <span className="text-gray-700">/ {patientsPage.totalPages}</span>
                            <button className="btn btn-sm btn-outline" onClick={handleNextPage} disabled={page >= patientsPage.totalPages - 1}>&gt;</button>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {activeTab === "all" && patientsPage.totalElements > 0 ? (
                            patientsPage.items.map(p => <PatientRecord key={p.patientId} patient={p} />)
                        ) : activeTab === "assigned" && assignedPatients.length > 0 ? (
                            assignedPatients.map(p => (
                                <PatientRecord
                                    key={p.patientId}
                                    patient={{ ...p, name: p.firstName || p.name }}
                                    actions={
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExamModal({ isOpen: true, patientId: p.patientId, date: "", description: "" });
                                            }}
                                            className="btn btn-sm btn-secondary w-full"
                                        >
                                            Medical Exam
                                        </button>
                                    }
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full text-center mt-4">No patients found.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
