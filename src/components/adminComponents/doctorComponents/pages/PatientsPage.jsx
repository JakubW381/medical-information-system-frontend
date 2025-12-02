import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../util/Axios";
import PatientRecord from "../PatientRecord";

export default function PatientsPage() {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("ALL");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [allergies, setAllergies] = useState("");
    const [chronicDiseases, setChronicDiseases] = useState("");
    const [medications, setMedications] = useState("");
    const [insuranceNumber, setInsuranceNumber] = useState("");

    const [patientsPage, setPatientsPage] = useState({ items: [], totalPages: 0, totalElements: 0 });

    const navigate = useNavigate();

    const isAllowed = async () => {
        try {
            const response = await api.get("/api/auth/role", { withCredentials: true });
            if (!["ROLE_DOCTOR", "ROLE_ADMIN"].includes(response.data)) {
                navigate("/main");
            }
        } catch (err) {
            navigate("/sign-in");
            console.log("Brak roli doctor lub admin:", err);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await api.post(
                "/api/doc/patients",
                {
                    page,
                    search,
                    dateOfBirth,
                    gender,
                    address,
                    phoneNumber,
                    bloodType,
                    allergies,
                    chronicDiseases,
                    medications,
                    insuranceNumber,
                },
                { withCredentials: true }
            );
            setPatientsPage(response.data);
        } catch (err) {
            console.log("Błąd przy pobieraniu strony pacjentów:", err);
        }
    };

    useEffect(() => {
        isAllowed();
        fetchPatients();
    }, []);

    useEffect(() => {
        fetchPatients();
    }, [page]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(0);
        fetchPatients();
    };

    const handlePrevPage = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < patientsPage.totalPages - 1) setPage(page + 1);
    };

    return (
        <div className="flex w-full gap-6 p-4">
            <aside className="w-70 flex-shrink-0 bg-base-200 p-4 rounded-xl shadow-lg sticky top-4 overflow-y-auto">

                <form className="flex flex-col gap-4" onSubmit={handleSearchSubmit}>

                    <input
                        type="text"
                        placeholder="Search by First/Last Name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Date of Birth</label>
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">Gender</span>
                        <div className="flex gap-2">

                            {[
                                { val: "", label: "Any" },
                                { val: "FEMALE", label: "♀", color: "btn-error" },
                                { val: "MALE", label: "♂", color: "btn-info" },
                            ].map(({ val, label, color }) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setGender(val)}
                                    className={[
                                        "btn btn-sm",
                                        gender === val ? color || "btn-primary" : "btn-outline"
                                    ].join(" ")}
                                >
                                    {label}
                                </button>
                            ))}

                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">Blood Type</span>

                        <div className="grid grid-cols-4 gap-2">
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"].map((bt) => (
                                <button
                                    key={bt}
                                    type="button"
                                    onClick={() => setBloodType(bt)}
                                    className={[
                                        "btn btn-sm",
                                        bloodType === bt ? "btn-error" : "btn-outline"
                                    ].join(" ")}
                                >
                                    {bt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <input
                        type="text"
                        placeholder="Allergies"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <input
                        type="text"
                        placeholder="Chronic Diseases"
                        value={chronicDiseases}
                        onChange={(e) => setChronicDiseases(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <input
                        type="text"
                        placeholder="Medications"
                        value={medications}
                        onChange={(e) => setMedications(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <input
                        type="text"
                        placeholder="Insurance #"
                        value={insuranceNumber}
                        onChange={(e) => setInsuranceNumber(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <button type="submit" className="btn btn-success w-full mt-2">
                        Search
                    </button>
                </form>
            </aside>

            <main className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {patientsPage.totalElements > 0 ? (
                        patientsPage.items.map((patient) => <PatientRecord key={patient.patientId} patient={patient} />)
                    ) : (
                        <p className="text-gray-500 col-span-full text-center mt-4">No patients found.</p>
                    )}
                </div>

                {patientsPage.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <button className="btn btn-sm btn-outline" onClick={handlePrevPage} disabled={page === 0}>
                            &lt;
                        </button>
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
                        <button className="btn btn-sm btn-outline" onClick={handleNextPage} disabled={page >= patientsPage.totalPages - 1}>
                            &gt;
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
