import { useEffect, useState, useRef } from "react";
import DoctorRecord from "../DoctorRecord";
import PatientRecord from "../PatientRecord";
import DocumentRecord from "../DocumentRecord";
import { useNavigate } from "react-router-dom";
import api from "../../../../util/Axios";

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

    const fileInputRef = useRef(null);

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
        <div className="flex flex-col w-full px-4 lg:px-10">

            {/* DOCTOR PROFILE */}
            {doctorProfile && (
                <>
                    <h1 className="text-3xl font-bold my-6">Doctor Profile</h1>

                    <div className="w-full flex justify-center ">
                        <DoctorRecord doctor={doctorProfile} />
                    </div>

                    <div className="flex justify-start mt-4">
                        <button
                            className="btn btn-sm btn-outline hover:btn-info"
                            onClick={() => navigate(`/patient/${patientProfile.patientId}/update`)}
                        >
                            ✏️ Edit
                        </button>
                    </div>
                </>
            )}

            {/* PATIENT PROFILE */}
            {patientProfile && (
                <>
                    <h1 className="text-3xl font-bold my-6">Patient Profile</h1>

                    <div className="w-full flex justify-center">
                        <div className="card bg-base-300 shadow-md rounded-lg p-6 w-full lg:w-9/10">
                            <h2 className="text-xl font-bold mb-4">
                                {patientProfile.name} {patientProfile.lastName}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <p><strong>PESEL:</strong> {patientProfile.pesel}</p>
                                <p><strong>Date of Birth:</strong> {patientProfile.dateOfBirth}</p>
                                <p><strong>Gender:</strong> {patientProfile.gender}</p>
                                <p><strong>Phone:</strong> {patientProfile.phoneNumber}</p>
                                <p><strong>Blood Type:</strong> {patientProfile.bloodType}</p>
                                <p><strong>Insurance #:</strong> {patientProfile.insuranceNumber}</p>
                                <p className="sm:col-span-2"><strong>Address:</strong> {patientProfile.address}</p>
                                <p className="sm:col-span-2"><strong>Allergies:</strong> {patientProfile.allergies || "None"}</p>
                                <p className="sm:col-span-2"><strong>Chronic Diseases:</strong> {patientProfile.chronicDiseases || "None"}</p>
                                <p className="sm:col-span-2"><strong>Medications:</strong> {patientProfile.medications || "None"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start mt-4">
                        <button
                            className="btn btn-sm btn-outline hover:btn-info"
                            onClick={() => navigate(`/patient/${patientProfile.patientId}/update`)}
                        >
                            ✏️ Edit
                        </button>
                    </div>
                </>
            )}

            {/* DOCUMENTS */}
            {patientProfile && (
                <>
                    <h1 className="text-3xl font-bold my-8">Documents</h1>

                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* FILTER PANEL */}
                        <div className="w-full lg:w-1/4">
                            <form
                                className="flex flex-col gap-4 p-5 bg-base-200 rounded-xl shadow-md  items-center"
                                onSubmit={handleSearchSubmit}
                            >
                                <h3 className="text-lg font-bold mb-1">Filter Documents</h3>

                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="input input-bordered w-full"
                                />

                                <input
                                    type="number"
                                    placeholder="Year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="input input-bordered w-full"
                                />

                                <button className="btn btn-success w-full mt-2">Search</button>
                            </form>
                        </div>

                        {/* DOCUMENTS + UPLOAD */}
                        <div className="flex-1 flex flex-col gap-6">

                            {/* SELECTED FILES */}
                            {selectedFiles.length > 0 && (
                                <div className="p-4 bg-base-200 rounded-lg shadow-md">
                                    <h3 className="font-bold mb-2">Selected files:</h3>

                                    <div className="flex flex-col gap-2">
                                        {selectedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center bg-base-300 p-2 rounded-lg"
                                            >
                                                <span className="truncate">{file.name}</span>
                                                <button
                                                    className="btn btn-xs btn-error"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FILE INPUT BUTTONS */}
                            <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFilesSelected}
                            />

                            <button
                                className="btn btn-sm btn-outline w-full h-10 hover:btn-success"
                                onClick={openFilePicker}
                            >
                                Choose files
                            </button>

                            {isLoading ? (
                                <button className="btn btn-sm btn-success w-full h-10 mt-2">
                                    Uploading... Please wait
                                </button>
                            ) : (
                                <button
                                    className="btn btn-sm btn-success w-full h-10 mt-2"
                                    onClick={uploadDocs}
                                    disabled={selectedFiles.length === 0}
                                >
                                    Upload documents
                                </button>
                            )}

                            {/* DOCUMENT GRID */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {documents.totalElements > 0 ? (
                                    documents.items.map((d) => (
                                        <DocumentRecord key={d.id} document={d} />
                                    ))
                                ) : (
                                    <p className="text-center col-span-full text-gray-500 mt-4 mb-20">
                                        No documents available.
                                    </p>
                                )}
                            </div>

                            {documents.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-4">
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={handlePrevPage}
                                        disabled={page === 0}
                                    >
                                        ◀
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            className="input input-bordered w-16 text-center"
                                            value={page + 1}
                                            onChange={(e) => {
                                                let newPage = parseInt(e.target.value, 10) - 1;
                                                if (newPage >= 0 && newPage < documents.totalPages)
                                                    setPage(newPage);
                                            }}
                                        />
                                        <span className="text-lg">/ {documents.totalPages}</span>
                                    </div>

                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={handleNextPage}
                                        disabled={page >= documents.totalPages - 1}
                                    >
                                        ▶
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

}
