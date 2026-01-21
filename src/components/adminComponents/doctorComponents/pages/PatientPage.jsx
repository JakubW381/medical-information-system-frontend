import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../util/Axios";
import DocumentRecord from "../DocumentRecord";
import { useRef } from "react";
import { doctorFetchDocumentBase64 } from "../../../../util/FilesReader.jsx"

// Custom Message Modal Component
const MessageModal = ({ isOpen, onClose, onSend, loading, recipientName }) => {
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    // Reset fields when modal opens
    useEffect(() => {
        if (isOpen) {
            setSubject("");
            setContent("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!subject || !content) {
            alert("Please fill in both subject and content");
            return;
        }
        onSend({ subject, content });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-lg border border-base-200 p-6 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-primary">Message to {recipientName}</h3>
                <div className="flex flex-col w-full">
                    <label className="font-medium mb-1">Subject</label>
                    <input
                        type="text"
                        placeholder="Type subject here"
                        className="input input-bordered w-full"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label className="font-medium mb-1">Message Content</label>
                    <textarea
                        className="textarea textarea-bordered h-32"
                        placeholder="Type your message here"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={loading}
                    ></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner loading-xs"></span> : "Send Message"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function PatientPage() {
    const { patientId } = useParams();

    const [patientInfo, setPatientInfo] = useState();
    const [patientDocuments, setPatientDocuments] = useState({ items: [], totalElements: 0, totalPages: 0 });
    const [assignmentStatus, setAssignmentStatus] = useState({ assigned: false, examCount: 0 });

    const [page, setPage] = useState(0);
    const [year, setYear] = useState("");
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    // Message modal state
    const [messageModal, setMessageModal] = useState({ isOpen: false, userEmail: null, userName: null });
    const [messageLoading, setMessageLoading] = useState(false);

    const openMessageModal = (patient) => {
        setMessageModal({
            isOpen: true,
            userEmail: patient.email,
            userName: `${patient.name} ${patient.lastName}`
        });
    };

    const closeMessageModal = () => {
        setMessageModal({ isOpen: false, userEmail: null, userName: null });
    };

    const handleSendMessage = async ({ subject, content }) => {
        if (!messageModal.userEmail) return;
        setMessageLoading(true);
        try {
            await api.post("/api/doc/send-message", {
                email: messageModal.userEmail,
                subject,
                content
            }, { withCredentials: true });

            alert("Message sent successfully!");
            closeMessageModal();
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Failed to send message: " + (err.response?.data || err.message));
        } finally {
            setMessageLoading(false);
        }
    };

    const fetchPatientInfo = async () => {
        try {
            const response = await api.get(`/api/doc/patient/${patientId}`, { withCredentials: true });
            setPatientInfo(response.data);
        } catch (err) {
            console.log(`Błąd przy pobieraniu informacji o pacjencie ${err}`);
            navigate("/patients");
        }
    };

    const fetchAssignmentStatus = async () => {
        try {
            const response = await api.get(`/api/doc/patient/${patientId}/assignment-status`, { withCredentials: true });
            setAssignmentStatus(response.data);
        } catch (err) {
            console.error("Error fetching assignment status:", err);
        }
    };

    const fetchPatientDocuments = async () => {
        try {
            const response = await api.post(
                `/api/doc/patient/documents/${patientId}`,
                { page, year, search },
                { withCredentials: true }
            );
            setPatientDocuments(response.data);
        } catch (err) {
            console.log(`Błąd przy pobieraniu dokumentów pacjenta ${err}`);
            navigate("/patients");
        }
    };


    // File Picker and upload

    const [isLoading, setIsLoading] = useState(false)

    const [selectedFiles, setSelectedFiles] = useState([])

    const fileInputRef = useRef(null);

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFilesSelected = (e) => {
        const files = Array.from(e.target.files);

        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadPatientsDocument = async () => {
        if (selectedFiles.length === 0) return;

        setIsLoading(true)
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });

        try {
            await api.post(
                `/api/doc/patient/${patientId}/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true
                }
            );
            setSelectedFiles([]);
            fileInputRef.current.value = "";
            fetchPatientDocuments();
            setIsLoading(false);
        } catch (err) {
            console.log("Upload failed:", err);
            setIsLoading(false)
        }
    };

    const handleAssignPatient = async () => {
        try {
            await api.post(`/api/doc/assign-patient/${patientId}`, {}, { withCredentials: true });
            alert("Patient assigned successfully");
            fetchAssignmentStatus();
        } catch (err) {
            console.error("Error assigning patient:", err);
            alert("Error assigning patient");
        }
    };

    const handleUnassign = async () => {
        if (assignmentStatus.examCount > 0) {
            if (!window.confirm(`Warning: This patient has ${assignmentStatus.examCount} medical examination(s). Unassigning will delete all of them. Are you sure?`)) {
                return;
            }
        }

        try {
            await api.post(`/api/doc/unassign-patient/${patientId}`, {}, { withCredentials: true });
            alert("Patient unassigned and data cleared.");
            fetchAssignmentStatus();
        } catch (err) {
            console.error("Error unassigning patient:", err);
            alert("Error unassigning patient");
        }
    };

    useEffect(() => {
        fetchPatientDocuments();
    }, []);

    // useEffect(() => {
    //     fetchPatientDocuments();
    // }, [page, year, search]);

    useEffect(() => {
        fetchPatientInfo();
        fetchAssignmentStatus();
    }, [patientId]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(0);
        fetchPatientDocuments();
    };

    const handlePrevPage = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < patientDocuments.totalPages - 1) setPage(page + 1);
    };

    return (
        <div className="flex flex-col lg:flex-row w-full gap-6 p-4">
            <MessageModal
                isOpen={messageModal.isOpen}
                onClose={closeMessageModal}
                onSend={handleSendMessage}
                loading={messageLoading}
                recipientName={messageModal.userName}
            />
            <div className="flex flex-col gap-4 w-full lg:w-1/5">
                <form className="flex flex-col gap-3 p-4 bg-base-200 rounded-lg shadow-md" onSubmit={handleSearchSubmit}>
                    <h3 className="text-lg font-bold mb-2">Filter Documents</h3>
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
                    <button type="submit" className="btn btn-success mt-2">
                        Search
                    </button>
                </form>

                {patientInfo &&

                    <div
                        className="card bg-base-300 shadow-md rounded-lg p-4 w-full"
                    >
                        <h2 className="text-xl font-bold mb-2">{patientInfo.name} {patientInfo.lastName}</h2>
                        <p><strong>PESEL:</strong> {patientInfo.pesel}</p>
                        <p><strong>Date of Birth:</strong> {patientInfo.dateOfBirth}</p>
                        <p><strong>Gender:</strong> {patientInfo.gender}</p>
                        <p><strong>Address:</strong> {patientInfo.address}</p>
                        <p><strong>Phone:</strong> {patientInfo.phoneNumber}</p>
                        <p><strong>Blood Type:</strong> {patientInfo.bloodType}</p>
                        <p><strong>Allergies:</strong> {patientInfo.allergies || "None"}</p>
                        <p><strong>Chronic Diseases:</strong> {patientInfo.chronicDiseases || "None"}</p>
                        <p><strong>Medications:</strong> {patientInfo.medications || "None"}</p>
                        <p><strong>Insurance #:</strong> {patientInfo.insuranceNumber}</p>
                        <button
                            className="btn btn-sm btn-outline hover: btn-info"
                            onClick={() => navigate(`/patient/${patientInfo.patientId}/update`)}
                        >
                            ✏️
                        </button>
                        <button
                            className="btn btn-sm btn-outline hover:btn-primary mt-2"
                            onClick={() => openMessageModal(patientInfo)}
                        >
                            Send Message
                        </button>
                        {assignmentStatus.assigned ? (
                            <button
                                className="btn btn-sm btn-error text-white mt-2"
                                onClick={handleUnassign}
                            >
                                Unassign
                            </button>
                        ) : (
                            <button
                                className="btn btn-sm btn-success text-white mt-2"
                                onClick={handleAssignPatient}
                            >
                                Assign to Me
                            </button>
                        )}
                    </div>
                }
            </div>

            <div className="flex flex-col flex-1 gap-4">
                {selectedFiles.length > 0 && (
                    <div className="p-3 bg-base-200 rounded-lg shadow-md flex flex-col gap-2">
                        <h3 className="font-bold">Selected files:</h3>

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
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                )}

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

                {isLoading ?
                    <button
                        className="btn btn-sm btn-success w-full h-10 mt-2"
                    >
                        Processing patients documents ---- Please Wait...
                    </button>
                    :
                    <button
                        className="btn btn-sm btn-success w-full h-10 mt-2"
                        onClick={uploadPatientsDocument}
                        disabled={selectedFiles.length === 0}
                    >
                        Upload patient's document
                    </button>
                }

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patientDocuments.totalElements > 0 ? (
                        patientDocuments.items.map((document) => (
                            <DocumentRecord key={document.id} document={document} fetchFun={doctorFetchDocumentBase64} />
                        ))
                    ) : (
                        <p className="text-center col-span-full text-gray-500 mt-4">No documents available.</p>
                    )}
                </div>

                {patientDocuments.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={handlePrevPage}
                            disabled={page === 0}
                        >
                            &lt;
                        </button>
                        <input
                            type="number"
                            className="input input-bordered w-16 text-center"
                            value={page + 1}
                            onChange={(e) => {
                                let newPage = parseInt(e.target.value, 10) - 1;
                                if (newPage >= 0 && newPage < patientDocuments.totalPages) setPage(newPage);
                            }}
                        />
                        <span className="text-gray-700">/ {patientDocuments.totalPages}</span>
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={handleNextPage}
                            disabled={page >= patientDocuments.totalPages - 1}
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
