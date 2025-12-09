import { useState, useRef } from "react";
import api from "../../util/Axios";


export default function LabPage() {

    const [selectedFiles, setSelectedFiles] = useState([])
    const [patientPesel, setPatientPesel] = useState("")
    const [isLoading, setIsLoading] = useState(false)

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

    const [errors, setErrors] = useState({})

    const validate = () => {
        const newErrors = {};

        if (!patientPesel.trim()) newErrors.patientPesel = "PESEL is required.";
        else if (!/^\d{11}$/.test(patientPesel))
            newErrors.patientPesel = "PESEL must be exactly 11 digits.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }



    const uploadPatientsDocument = async () => {
        if (selectedFiles.length === 0) return;
        if (!validate()) return;

        setIsLoading(true)
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });
        formData.set("pesel", patientPesel)

        try {
            await api.post(
                `/api/lab/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true
                }
            );
            setSelectedFiles([]);
            fileInputRef.current.value = "";
            setIsLoading(false);
            alert("File Upload Successful")
        } catch (err) {
            console.log("Upload failed:", err);
            alert(err);
            setIsLoading(false)
        }
    };


    return (
        <div className=" lg:w-5/10 sm:w-full items-center m-auto">
            <div className="flex flex-col gap-5" >
                <div className="align-center">
                    <label className="text-sm font-medium mb-1 ">Patient's Pesel</label>
                    <input
                        type="number"
                        value={patientPesel}
                        onChange={e => setPatientPesel(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    {errors.patientPesel && (
                        <p className="text-red-500 text-xs mt-1">{errors.patientPesel}</p>
                    )}
                </div>


                <div className="p-3 bg-base-200 rounded-lg shadow-md flex flex-col gap-2 min-h-30">
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
                


            </div>
        </div>
    )
}