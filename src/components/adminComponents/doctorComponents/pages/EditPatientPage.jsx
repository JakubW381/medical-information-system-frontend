import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../util/Axios";
import { useEffect, useState } from "react";

export default function EditPatientPage() {

    const { patientId } = useParams();

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    // const [email, setEmail] = useState("");
    const [pesel, setPesel] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [allergies, setAllergies] = useState("");
    const [chronicDiseases, setChronicDiseases] = useState("");
    const [medications, setMedications] = useState("");
    const [insuranceNumber, setInsuranceNumber] = useState("");

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!name.trim()) newErrors.name = "First name is required.";
        if (!lastName.trim()) newErrors.lastName = "Last name is required.";

        // if (!email.trim()) newErrors.email = "Email is required.";
        // else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        //     newErrors.email = "Invalid email format.";

        if (!/^\d{9}$/.test(phoneNumber.replaceAll(" ", "").replaceAll("-", ""))) newErrors.phoneNumber = "Phone Number must be 9 digits long"

        if (!pesel.trim()) newErrors.pesel = "PESEL is required.";
        else if (!/^\d{11}$/.test(pesel))
            newErrors.pesel = "PESEL must be exactly 11 digits.";

        if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
        if (!gender) newErrors.gender = "Select gender.";

        if (!address.trim()) newErrors.address = "Address is required.";

        if (!bloodType) newErrors.bloodType = "Select blood type.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updatePatient = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const digits = phoneNumber.replace(/\D/g, "");
        const formattedPhoneNumber = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`;

        try {
            const payload = {
                patientId,
                name,
                lastName,
                // email,
                pesel,
                phoneNumber: formattedPhoneNumber,
                dateOfBirth: dateOfBirth + "T00:00:00",
                gender,
                address,
                bloodType,
                allergies: allergies.trim(),
                chronicDiseases,
                medications: medications.trim(),
                insuranceNumber,
            };

            const response = await api.post("/api/doc/update-patient", payload, {
                withCredentials: true,
            });

            console.log(response.data);
            navigate("/patients");
        } catch (err) {
            console.log("Błąd przy edycji pacjenta: " + err);
        }
    };

    const fetchPatientInfo = async () => {
        try {
            const response = await api.get(`/api/doc/patient/${patientId}`, { withCredentials: true });

            setName(response.data.name)
            setLastName(response.data.lastName)
            setPesel(response.data.pesel)
            setPhoneNumber(response.data.phoneNumber ? response.data.phoneNumber : "")
            setDateOfBirth(response.data.dateOfBirth)
            setGender(response.data.gender)
            setAddress(response.data.address)
            setBloodType(response.data.bloodType)
            setAllergies(response.data.allergies)
            setChronicDiseases(response.data.chronicDiseases)
            setMedications(response.data.medications)
            setInsuranceNumber(response.data.insuranceNumber)

        } catch (err) {
            console.log(`Błąd przy pobieraniu informacji o pacjencie ${err}`);
            navigate("/patients");
        }
    };

    useEffect(() => {
        fetchPatientInfo()
    }, [])

    const handlePhoneNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 9) value = value.slice(0, 9);

        if (value.length > 6) {
            value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
        } else if (value.length > 3) {
            value = `${value.slice(0, 3)}-${value.slice(3)}`;
        }
        setPhoneNumber(value);
    };

    return (
        <div className="flex w-full justify-center py-10">
            <form
                onSubmit={updatePatient}
                className="card bg-base-200 shadow-xl p-10 w-full max-w-2xl flex flex-col gap-6"
            >
                <h1 className="text-3xl font-bold text-center mb-2">
                    Update Patient Information
                </h1>

                <div className="flex gap-4">
                    <div className="flex flex-col w-full">
                        <label className="font-medium">First Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered w-full"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div className="flex flex-col w-full">
                        <label className="font-medium">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="input input-bordered w-full"
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                        )}
                    </div>
                </div>

                {/* <div>
                    <label className="font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                </div> */}
                <div>
                    <label className="font-medium">Phone Number</label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        className="input input-bordered w-full"
                        placeholder="000-000-000"
                    />
                    {errors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                    )}
                </div>

                <div>
                    <label className="font-medium">PESEL</label>
                    <input
                        type="text"
                        value={pesel}
                        onChange={(e) => setPesel(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    {errors.pesel && (
                        <p className="text-red-500 text-xs mt-1">{errors.pesel}</p>
                    )}
                </div>

                <div>
                    <label className="font-medium">Date of Birth</label>
                    <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    {errors.dateOfBirth && (
                        <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
                    )}
                </div>

                <div>
                    <label className="font-medium">Gender</label>
                    <div className="flex gap-3 mt-1">
                        {[
                            { val: "FEMALE", label: "♀ Woman", color: "btn-error" },
                            { val: "MALE", label: "♂ Man", color: "btn-info" },
                        ].map(({ val, label, color }) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => setGender(val)}
                                className={[
                                    "btn btn-sm w-24",
                                    gender === val ? color : "btn-outline",
                                ].join(" ")}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    {errors.gender && (
                        <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                    )}
                </div>

                <div>
                    <label className="font-medium">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                </div>

                <div>
                    <label className="font-medium">Blood Type</label>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"].map((bt) => (
                            <button
                                key={bt}
                                type="button"
                                onClick={() => setBloodType(bt)}
                                className={[
                                    "btn btn-sm",
                                    bloodType === bt ? "btn-error" : "btn-outline",
                                ].join(" ")}
                            >
                                {bt}
                            </button>
                        ))}
                    </div>
                    {errors.bloodType && (
                        <p className="text-red-500 text-xs mt-1">{errors.bloodType}</p>
                    )}
                </div>

                <input
                    type="text"
                    placeholder="Allergies (separate with ; )"
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
                    placeholder="Medications (separate with ; )"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    className="input input-bordered w-full"
                />

                <input
                    type="text"
                    placeholder="Insurance Number"
                    value={insuranceNumber}
                    onChange={(e) => setInsuranceNumber(e.target.value)}
                    className="input input-bordered w-full"
                />

                <button type="submit" className="btn btn-success w-full mt-4">
                    Update
                </button>
            </form>
        </div>
    );
}
