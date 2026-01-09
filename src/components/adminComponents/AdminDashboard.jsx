import { useState } from "react";
import api from "../../util/Axios.js";


const FormInput = ({ label, name, type = "text", placeholder, value, onChange }) => (
    <div className="form-control w-full">
        <label className="label">
            <span className="label-text font-bold uppercase text-xs opacity-70">{label}</span>
        </label>
        <input
            type={type}
            name={name}
            value={value || ""}
            placeholder={placeholder}
            className="input input-bordered w-full focus:input-primary"
            onChange={onChange}
            required
        />
    </div>
);

const DashboardButton = ({ title, subtitle, onClick, colorClass }) => (
    <button
        onClick={onClick}
        className={`
            bg-base-100 rounded-2xl p-10 shadow-lg border border-base-300
            flex flex-col justify-between items-start
            text-left transition-all duration-300
            hover:shadow-2xl hover:-translate-y-2 active:scale-95
            ${colorClass} border-l-8
        `}
    >
        <span className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">
            {subtitle}
        </span>
        <span className="text-2xl font-bold text-base-content">
            {title}
        </span>
    </button>
);



export default function AdminDashboard() {
    const [activeModal, setActiveModal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const closeModal = () => {
        setActiveModal(null);
        setFormData({});
    };

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(endpoint, formData, { withCredentials: true });
            alert("Success!");
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Error: " + (err.response?.data || "Check console"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-8 flex flex-col items-center justify-center font-sans">

            <div className="mb-12 text-center">
                <h1 className="text-4xl font-black tracking-tight mb-2">Admin Control Panel</h1>
                <p className="opacity-60 font-medium italic text-primary">Secure Administration Portal</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-6xl">
                <DashboardButton
                    title="Register Doctor"
                    subtitle="Create Account & Profile"
                    colorClass="border-l-indigo-500 hover:border-indigo-400"
                    onClick={() => setActiveModal("registerDoctor")}
                />
                <DashboardButton
                    title="Attach Doctor"
                    subtitle="Assign to Existing User"
                    colorClass="border-l-emerald-500 hover:border-emerald-400"
                    onClick={() => setActiveModal("attachDoctor")}
                />
                <DashboardButton
                    title="Attach Patient"
                    subtitle="Medical Data Setup"
                    colorClass="border-l-amber-500 hover:border-amber-400"
                    onClick={() => setActiveModal("attachPatient")}
                />
                <DashboardButton
                    title="System Logs"
                    subtitle="View Security Audit"
                    colorClass="border-l-violet-500 hover:border-violet-400"
                    onClick={() => setActiveModal("logs")}
                />
                <DashboardButton
                    title="User List"
                    subtitle="Search & Manage Users"
                    colorClass="border-l-rose-500 hover:border-rose-400"
                    onClick={() => setActiveModal("users")}
                />
            </div>

            {activeModal && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box max-w-2xl bg-base-100 shadow-2xl">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>

                        <form onSubmit={(e) => handleSubmit(e,
                            activeModal === "registerDoctor" ? "/api/admin/register-doctor" :
                                activeModal === "attachDoctor" ? "/api/admin/user-doctor" :
                                    activeModal === "attachPatient" ? "/api/admin/user-patient" :
                                        activeModal === "logs" ? "/api/admin/logs" : "/api/admin/users"
                        )}>

                            <h3 className="text-2xl font-bold mb-6 text-center">
                                {activeModal.replace(/([A-Z])/g, ' $1').toUpperCase()}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto p-1">
                                {activeModal === "registerDoctor" && (
                                    <>
                                        <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} />
                                        <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                                        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                        <FormInput label="PESEL" name="pesel" value={formData.pesel} onChange={handleChange} />
                                        <FormInput label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} />
                                        <FormInput label="Department" name="department" value={formData.department} onChange={handleChange} />
                                        <FormInput label="Position" name="position" value={formData.position} onChange={handleChange} />
                                        <FormInput label="License No." name="professionalLicenseNumber" value={formData.professionalLicenseNumber} onChange={handleChange} />
                                    </>
                                )}

                                {activeModal === "attachDoctor" && (
                                    <>
                                        <FormInput label="First Name" name="name" value={formData.name} onChange={handleChange} />
                                        <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                                        <FormInput label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} />
                                        <FormInput label="Department" name="department" value={formData.department} onChange={handleChange} />
                                        <FormInput label="Position" name="position" value={formData.position} onChange={handleChange} />
                                        <FormInput label="License No." name="professionalLicenseNumber" value={formData.professionalLicenseNumber} onChange={handleChange} />
                                    </>
                                )}

                                {activeModal === "attachPatient" && (
                                    <>
                                        <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} />
                                        <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                                        <FormInput label="Email" name="email" value={formData.email} onChange={handleChange} />
                                        <FormInput label="PESEL" name="pesel" value={formData.pesel} onChange={handleChange} />
                                        <FormInput label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
                                        <FormInput label="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                                        <FormInput label="Blood Type" name="bloodType" value={formData.bloodType} onChange={handleChange} />
                                        <FormInput label="Insurance #" name="insuranceNumber" value={formData.insuranceNumber} onChange={handleChange} />
                                        <div className="md:col-span-2">
                                            <FormInput label="Address" name="address" value={formData.address} onChange={handleChange} />
                                        </div>
                                    </>
                                )}

                                {activeModal === "logs" && (
                                    <>
                                        <FormInput label="Search Keyword" name="search" value={formData.search} onChange={handleChange} />
                                        <FormInput label="Log Type" name="logType" value={formData.logType} onChange={handleChange} />
                                        <FormInput label="Author ID" name="authorId" value={formData.authorId} onChange={handleChange} />
                                        <FormInput label="From Date" name="from" type="date" value={formData.from} onChange={handleChange} />
                                        <FormInput label="To Date" name="to" type="date" value={formData.to} onChange={handleChange} />
                                    </>
                                )}

                                {activeModal === "users" && (
                                    <>
                                        <FormInput label="Name Search" name="name" value={formData.name} onChange={handleChange} />
                                        <FormInput label="Email" name="email" value={formData.email} onChange={handleChange} />
                                        <FormInput label="PESEL" name="pesel" value={formData.pesel} onChange={handleChange} />
                                        <FormInput label="Created After" name="createdAfter" type="date" value={formData.createdAfter} onChange={handleChange} />
                                    </>
                                )}
                            </div>

                            <div className="modal-action">
                                <button type="submit" className={`btn btn-primary w-full ${loading ? "loading" : ""}`}>
                                    {loading ? "Processing..." : "Submit Action"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}