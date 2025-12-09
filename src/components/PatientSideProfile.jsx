import { useEffect, useState } from "react";
import api from "../util/Axios";

export default function PatientSideProfile() {
    const [profile, setProfile] = useState({
        name: "",
        lastName: "",
        pesel: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        bloodType: "",
        allergies: "",
        chronicDiseases: "",
        medications: "",
        insuranceNumber: ""
    });

    const [passRequest, setPassRequest] = useState({
        newPass: "",
        confirmPass: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [passMessage, setPassMessage] = useState("");
    const [passError, setPassError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/user/patient", { withCredentials: true });
            if (res.status === 200 && res.data) {
                setProfile(res.data);
            }
        } catch (err) {
            console.error("Error fetching profile", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handlePassChange = (e) => {
        const { name, value } = e.target;
        setPassRequest((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            await api.post("/api/user/update-patient", profile, { withCredentials: true });
            setMessage("Profile updated successfully.");
        } catch (err) {
            console.error("Error updating profile", err);
            setError("Failed to update profile.");
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPassMessage("");
        setPassError("");

        if (passRequest.newPass !== passRequest.confirmPass) {
            setPassError("Passwords do not match.");
            return;
        }

        try {
            await api.post("/api/user/pass-change", { newPass: passRequest.newPass }, { withCredentials: true });
            setPassMessage("Password changed successfully.");
            setPassRequest({ newPass: "", confirmPass: "" });
        } catch (err) {
            console.error("Error changing password", err);
            setPassError("Failed to change password.");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">My Patient Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Form */}
                <div className="bg-base-200 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Edit Personal Information</h2>
                    {message && <div className="alert alert-success mb-4">{message}</div>}
                    {error && <div className="alert alert-error mb-4">{error}</div>}

                    <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">First Name</span></label>
                                <input type="text" name="name" value={profile.name || ""} onChange={handleChange} className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Last Name</span></label>
                                <input type="text" name="lastName" value={profile.lastName || ""} onChange={handleChange} className="input input-bordered" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">PESEL</span></label>
                                <input type="text" name="pesel" value={profile.pesel || ""} onChange={handleChange} className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Date of Birth</span></label>
                                <input type="date" name="dateOfBirth" value={profile.dateOfBirth || ""} onChange={handleChange} className="input input-bordered" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Phone Number</span></label>
                                <input type="text" name="phoneNumber" value={profile.phoneNumber || ""} onChange={handleChange} className="input input-bordered" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Gender</span></label>
                                <select name="gender" value={profile.gender || ""} onChange={handleChange} className="select select-bordered">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Address</span></label>
                            <input type="text" name="address" value={profile.address || ""} onChange={handleChange} className="input input-bordered" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Blood Type</span></label>
                                <select name="bloodType" value={profile.bloodType || ""} onChange={handleChange} className="select select-bordered">
                                    <option value="">Select Blood Type</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Insurance Number</span></label>
                                <input type="text" name="insuranceNumber" value={profile.insuranceNumber || ""} onChange={handleChange} className="input input-bordered" />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Allergies</span></label>
                            <textarea name="allergies" value={profile.allergies || ""} onChange={handleChange} className="textarea textarea-bordered"></textarea>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Chronic Diseases</span></label>
                            <textarea name="chronicDiseases" value={profile.chronicDiseases || ""} onChange={handleChange} className="textarea textarea-bordered"></textarea>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Medications</span></label>
                            <textarea name="medications" value={profile.medications || ""} onChange={handleChange} className="textarea textarea-bordered"></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary mt-4">Update Profile</button>
                    </form>
                </div>

                {/* Password Change Form */}
                <div className="flex flex-col gap-6">
                    <div className="bg-base-200 p-6 rounded-xl shadow-md h-fit">
                        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                        {passMessage && <div className="alert alert-success mb-4">{passMessage}</div>}
                        {passError && <div className="alert alert-error mb-4">{passError}</div>}

                        <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">New Password</span></label>
                                <input type="password" name="newPass" value={passRequest.newPass} onChange={handlePassChange} className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Confirm Password</span></label>
                                <input type="password" name="confirmPass" value={passRequest.confirmPass} onChange={handlePassChange} className="input input-bordered" required />
                            </div>
                            <button type="submit" className="btn btn-secondary mt-4">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
