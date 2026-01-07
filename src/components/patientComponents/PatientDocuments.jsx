import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../util/Axios";
import DocumentRecord from "../adminComponents/doctorComponents/DocumentRecord";
import { useRef } from "react";
import { userFetchDocumentBase64 } from "../../util/FilesReader.jsx"


export default function PatientDocuments() {
    const { patientId } = useParams();

    ;
    const [patientDocuments, setPatientDocuments] = useState({ items: [], totalElements: 0, totalPages: 0 });

    const [page, setPage] = useState(0);
    const [year, setYear] = useState("");
    const [search, setSearch] = useState("");

    const navigate = useNavigate();



    const fetchPatientDocuments = async () => {
        try {
            const response = await api.post(
                `/api/user/gallery`,
                { page, year, search },
                { withCredentials: true }
            );
            setPatientDocuments(response.data);
        } catch (err) {
            console.log(`Błąd przy pobieraniu dokumentów pacjenta ${err}`);
            navigate("/patients");
        }
    };




    const [isLoading , setIsLoading] = useState(false)

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
                `/api/user/upload`,
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

    useEffect(() => {
        fetchPatientDocuments();
    }, []);

    // useEffect(() => {
    //     fetchPatientDocuments();
    // }, [page, year, search]);



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
                            <DocumentRecord key={document.id} document={document} fetchFun={userFetchDocumentBase64} />
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
    )
}