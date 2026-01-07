import { useEffect, useState } from "react";
import api from "../../util/Axios.js";

const DataField = ({ label, value, highlight = false }) => (
    <div className="flex flex-col p-6 border-b border-base-200 last:border-0 hover:bg-base-200/50 transition-colors">
        <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{label}</span>
        <span className={`text-lg font-semibold ${highlight ? "text-secondary" : "text-base-content"}`}>
      {value || "N/A"}
    </span>
    </div>
);


const BadgeList = ({ label, items, badgeClass }) => (
    <div className="p-6">
        <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-3">{label}</span>
        <div className="flex flex-wrap gap-3">
            {items && items.length > 0 ? (
                items.split(',').map((item, idx) => (
                    <span key={idx} className={`badge badge-lg font-bold p-4 ${badgeClass}`}>
            {item.trim()}
          </span>
                ))
            ) : (
                <span className="text-sm opacity-50 italic font-medium">No records found</span>
            )}
        </div>
    </div>
);

export default function PatientInfo() {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPatientInfo = async () => {
        try {
            const response = await api.get('/api/user/patient', { withCredentials: true });
            setInfo(response.data);
        } catch (err) {
            console.error(`Error fetching patient info: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientInfo();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-base-200 text-base-content italic animate-pulse text-xl">
            Loading patient profile...
        </div>
    );

    if (!info) return (
        <div className="flex justify-center items-center h-screen bg-base-200 text-error font-bold text-xl">
            Failed to load patient data.
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-base-200 p-4 md:p-8">

            <div className="max-w-7xl mx-auto">

                <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">


                    <div className="bg-neutral text-neutral-content px-8 py-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase">
                                    {info.name} {info.lastName}
                                </h1>
                                <div className="flex items-center gap-4 opacity-80">
                                    <span className="bg-base-100 text-base-content px-3 py-1 rounded-full text-sm font-mono font-bold">
                                        Patient ID: {info.patientId}
                                    </span>
                                    <span className="text-sm font-medium italic">Personal Medical Dashboard</span>
                                </div>
                            </div>


                            <div className="bg-primary text-primary-content rounded-2xl p-6 shadow-lg flex flex-col items-center min-w-[140px]">
                                <span className="text-xs uppercase font-bold opacity-80 mb-1">Blood Type</span>
                                <span className="text-5xl font-black leading-none">{info.bloodType || '?'}</span>
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-base-300">


                        <section className="bg-base-100">
                            <div className="px-6 py-4 bg-base-200/50 border-b border-base-300">
                                <h2 className="text-sm font-black opacity-60 uppercase tracking-widest">Personal Information</h2>
                            </div>
                            <DataField label="National ID (PESEL)" value={info.pesel} />
                            <DataField label="Date of Birth" value={info.dateOfBirth} />
                            <DataField label="Gender" value={info.gender} />
                        </section>


                        <section className="bg-base-100">
                            <div className="px-6 py-4 bg-base-200/50 border-b border-base-300">
                                <h2 className="text-sm font-black opacity-60 uppercase tracking-widest">Contact Details</h2>
                            </div>
                            <DataField label="Phone Number" value={info.phoneNumber} highlight />
                            <DataField label="Home Address" value={info.address} />
                            <DataField label="Insurance Number" value={info.insuranceNumber} />
                        </section>


                        <section className="bg-base-200/30">
                            <div className="px-6 py-4 bg-base-200/50 border-b border-base-300">
                                <h2 className="text-sm font-black opacity-60 uppercase tracking-widest">Medical Alerts</h2>
                            </div>
                            <BadgeList
                                label="Allergies"
                                items={info.allergies}
                                badgeClass="badge-error text-white"
                            />
                            <BadgeList
                                label="Chronic Diseases"
                                items={info.chronicDiseases}
                                badgeClass="badge-warning text-warning-content"
                            />
                            <div className="p-6 border-t border-base-300">
                                <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Current Medications</span>
                                <p className="bg-base-100 text-base-content leading-relaxed font-medium p-4 rounded-xl border border-dashed border-base-300">
                                    {info.medications || "No medication data available"}
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}