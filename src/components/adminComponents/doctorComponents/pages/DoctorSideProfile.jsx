import { useEffect, useState, useRef } from "react";
import DocumentRecord from "../DocumentRecord";
import { userFetchDocumentBase64 } from "../../../../util/FilesReader.jsx";
import { useNavigate } from "react-router-dom";
import api from "../../../../util/Axios";

const DataField = ({ label, value, highlight = false }) => (
    <div className="flex flex-col p-6 border-b border-base-200 last:border-0 hover:bg-base-200/50 transition-colors">
        <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{label}</span>
        <span className={`text-lg font-semibold ${highlight ? "text-secondary" : "text-base-content"}`}>
            {value || "N/A"}
        </span>
    </div>
);

export default function DoctorSideProfile() {
    const [patientProfile, setPatientProfile] = useState(null);
    const [doctorProfile, setDoctorProfile] = useState(null);

    const [documents, setDocuments] = useState({
        items: [],
        totalElements: 0,
        totalPages: 0
    });

    const [search, setSearch] = useState("");
    const [year, setYear] = useState("");
    const [page, setPage] = useState(0);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        specialization: "",
        department: "",
        position: "",
        professionalLicenseNumber: ""
    });

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const fetchPatientInfo = async () => {
        try {
            const res = await api.get(`/api/user/patient`, { withCredentials: true });

            if (res.status === 204 || !res.data) {
                console.log(res.status)
                setPatientProfile(null);
                return false;
            }

            setPatientProfile(res.data);
            return true;

        } catch (err) {
            console.log("Błąd pobierania pacjenta:", err);
            return false;
        }
    };


    const fetchDoctorProfile = async () => {
        try {
            const res = await api.get(`/api/doc/doctor`, { withCredentials: true });
            setDoctorProfile(res.data);
        } catch (err) {
            console.log("Błąd pobierania doktora:", err);
        }
    };

    const fetchDocuments = async () => {
        try {
            const res = await api.post(
                `/api/user/gallery`,
                { search, year, page },
                { withCredentials: true }
            );

            setDocuments({
                items: res.data.items || [],
                totalElements: res.data.totalElements || 0,
                totalPages: res.data.totalPages || 0
            });
        } catch (err) {
            console.log("Błąd pobierania dokumentów:", err);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(0);
        fetchDocuments();
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < documents.totalPages - 1) {
            setPage(page + 1);
        }
    };

    // Edit Handlers
    const handleEditClick = () => {
        if (doctorProfile) {
            setEditFormData({
                specialization: doctorProfile.specialization || "",
                department: doctorProfile.department || "",
                position: doctorProfile.position || "",
                professionalLicenseNumber: doctorProfile.professionalLicenseNumber || ""
            });
            setIsEditModalOpen(true);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/doc/update-doctor", editFormData, {
                withCredentials: true,
            });
            setIsEditModalOpen(false);
            fetchDoctorProfile(); // Refresh data
        } catch (err) {
            console.error("Error updating doctor profile:", err);
            alert("Failed to update profile.");
        }
    };

    useEffect(() => {
        (async () => {
            await fetchDoctorProfile();
            const ok = await fetchPatientInfo();
            if (ok) fetchDocuments();
        })();
    }, []);

    useEffect(() => {
        if (patientProfile) fetchDocuments();
    }, [page]);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const openFilePicker = () => fileInputRef.current?.click();

    const handleFilesSelected = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadDocs = async () => {
        if (selectedFiles.length === 0) return;

        setIsLoading(true);

        const formData = new FormData();
        selectedFiles.forEach((f) => formData.append("files", f));

        try {
            await api.post(`/api/user/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            setSelectedFiles([]);
            fileInputRef.current.value = "";

            fetchDocuments();
        } catch (err) {
            console.log("Upload failed:", err);
        }

        setIsLoading(false);
    };

    return (
        <div className="w-full min-h-screen bg-base-200 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* DOCTOR PROFILE SECTION */}
                {doctorProfile && (
                    <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
                        <div className="bg-neutral text-neutral-content px-8 py-10 relative">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase">
                                        Dr. {doctorProfile.name} {doctorProfile.lastName}
                                    </h1>
                                    <div className="flex items-center gap-4 opacity-80">
                                        <span className="bg-base-100 text-base-content px-3 py-1 rounded-full text-sm font-mono font-bold">
                                            ID: {doctorProfile.id}
                                        </span>
                                        <span className="text-sm font-medium italic">Medical Professional Profile</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleEditClick}
                                        className="btn btn-primary btn-sm md:btn-md"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-base-300">
                            <div className="bg-base-100">
                                <div className="px-6 py-4 bg-base-200/50 border-b border-base-300">
                                    <h2 className="text-sm font-black opacity-60 uppercase tracking-widest">Professional Details</h2>
                                </div>
                                <DataField label="Specialization" value={doctorProfile.specialization} />
                                <DataField label="Department" value={doctorProfile.department} />
                            </div>
                            <div className="bg-base-100">
                                <div className="px-6 py-4 bg-base-200/50 border-b border-base-300">
                                    <h2 className="text-sm font-black opacity-60 uppercase tracking-widest">Employment Info</h2>
                                </div>
                                <DataField label="Position" value={doctorProfile.position} />
                                <DataField label="License Number" value={doctorProfile.professionalLicenseNumber} highlight={true} />
                            </div>
                        </div>
                    </div>
                )}


                {/* PATIENT PROFILE & DOCUMENTS SECTION */}
                {patientProfile && (
                    <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden p-6 md:p-8">
                        <h2 className="text-3xl font-bold mb-6 border-b pb-2">Patient Files & Documents</h2>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* FILTER PANEL */}
                            <div className="w-full lg:w-1/4 h-fit">
                                <form
                                    className="flex flex-col gap-4 p-5 bg-base-200 rounded-xl shadow-inner"
                                    onSubmit={handleSearchSubmit}
                                >
                                    <h3 className="text-lg font-bold mb-1">Filter Documents</h3>

                                    <div className="form-control w-full">
                                        <label className="label"><span className="label-text">Search</span></label>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="input input-bordered w-full"
                                            placeholder="Keyword..."
                                        />
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label"><span className="label-text">Year</span></label>
                                        <input
                                            type="number"
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            className="input input-bordered w-full"
                                            placeholder="YYYY"
                                        />
                                    </div>

                                    <button className="btn btn-primary w-full mt-2">Apply Filters</button>
                                </form>
                            </div>

                            {/* DOCUMENT LIST */}
                            <div className="flex-1 flex flex-col gap-6">

                                {/* UPLOAD AREA */}
                                <div className="p-4 border border-dashed border-base-300 rounded-xl bg-base-50">
                                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                                        <input
                                            type="file"
                                            multiple
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleFilesSelected}
                                        />
                                        <button
                                            className="btn btn-outline"
                                            onClick={openFilePicker}
                                        >
                                            + Select Files
                                        </button>

                                        {selectedFiles.length > 0 && (
                                            <div className="flex-1 flex flex-wrap gap-2">
                                                {selectedFiles.map((file, index) => (
                                                    <div key={index} className="badge badge-lg gap-2 pr-0">
                                                        {file.name}
                                                        <button onClick={() => removeFile(index)} className="btn btn-xs btn-circle btn-ghost">✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {selectedFiles.length > 0 && (
                                            <button
                                                className={`btn btn-success ${isLoading ? 'loading' : ''}`}
                                                onClick={uploadDocs}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Uploading...' : 'Upload'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* DOCUMENT GRID */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {documents.totalElements > 0 ? (
                                        documents.items.map((d) => (
                                            <DocumentRecord key={d.id} document={d} fetchFun={userFetchDocumentBase64} />
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 text-center opacity-50">
                                            <div className="text-4xl mb-2">📂</div>
                                            <p>No documents found matching your criteria.</p>
                                        </div>
                                    )}
                                </div>
                                {/* Pagination (reused) */}
                                {documents.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 mt-8">
                                        <button className="btn btn-sm btn-outline" onClick={handlePrevPage} disabled={page === 0}>◀</button>
                                        <span className="text-sm font-bold">Page {page + 1} of {documents.totalPages}</span>
                                        <button className="btn btn-sm btn-outline" onClick={handleNextPage} disabled={page >= documents.totalPages - 1}>▶</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-lg border border-base-200">
                        <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-4">
                            <h3 className="text-xl font-bold text-primary mb-2">Edit Doctor Profile</h3>

                            <div className="flex flex-col w-full">
                                <label className="font-medium mb-1">Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={editFormData.specialization}
                                    onChange={handleEditChange}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="font-medium mb-1">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={editFormData.department}
                                    onChange={handleEditChange}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="font-medium mb-1">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={editFormData.position}
                                    onChange={handleEditChange}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="font-medium mb-1">License Number</label>
                                <input
                                    type="text"
                                    name="professionalLicenseNumber"
                                    value={editFormData.professionalLicenseNumber}
                                    onChange={handleEditChange}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}
