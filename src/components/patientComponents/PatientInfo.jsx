import { useEffect, useState } from "react";
import api from "../../util/Axios.js";

const DataField = ({ label, value, highlight = false }) => (
    <div className="flex flex-col p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">{label}</span>
        <span className={`text-lg font-semibold ${highlight ? "text-blue-700" : "text-gray-900"}`}>
      {value || "N/A"}
    </span>
    </div>
);
const BadgeList = ({ label, items, colorClass }) => (
    <div className="p-6">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block mb-3">{label}</span>
        <div className="flex flex-wrap gap-3">
            {items && items.length > 0 ? (
                items.split(',').map((item, idx) => (
                    <span key={idx} className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${colorClass}`}>
            {item.trim()}
          </span>
                ))
            ) : (
                <span className="text-sm text-gray-400 italic font-medium">No records found</span>
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
        <div className="flex justify-center items-center h-screen italic text-gray-500 animate-pulse text-xl">
            Loading patient profile...
        </div>
    );

    if (!info) return (
        <div className="flex justify-center items-center h-screen text-red-500 font-bold text-xl">
            Failed to load patient data.
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-white">

            <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">

                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-10 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                                    {info.name} {info.lastName}
                                </h1>
                                <div className="flex items-center gap-4 text-blue-100">
                  <span className="bg-blue-600/50 px-3 py-1 rounded-full text-sm font-mono border border-blue-400/30">
                    Patient ID: {info.patientId}
                  </span>
                                    <span className="text-sm font-medium">Last update: Today</span>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col items-center min-w-[140px]">
                                <span className="text-xs uppercase font-bold text-blue-200 mb-1">Blood Type</span>
                                <span className="text-5xl font-black leading-none">{info.bloodType || '?'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

                        <section className="bg-white">
                            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Personal Information</h2>
                            </div>
                            <DataField label="National ID (PESEL)" value={info.pesel} />
                            <DataField label="Date of Birth" value={info.dateOfBirth} />
                            <DataField label="Gender" value={info.gender} />
                        </section>

                        <section className="bg-white">
                            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Contact Details</h2>
                            </div>
                            <DataField label="Phone Number" value={info.phoneNumber} highlight />
                            <DataField label="Home Address" value={info.address} />
                            <DataField label="Insurance Number" value={info.insuranceNumber} />
                        </section>


                        <section className="bg-gray-50/20">
                            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Medical Alerts</h2>
                            </div>
                            <BadgeList
                                label="Allergies"
                                items={info.allergies}
                                colorClass="bg-red-50 text-red-600 border border-red-100"
                            />
                            <BadgeList
                                label="Chronic Diseases"
                                items={info.chronicDiseases}
                                colorClass="bg-orange-50 text-orange-600 border border-orange-100"
                            />
                            <div className="p-6 border-t border-gray-100">
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block mb-2">Current Medications</span>
                                <p className="text-gray-700 leading-relaxed font-medium bg-white p-4 rounded-xl border border-dashed border-gray-200">
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