import { useNavigate } from "react-router-dom";

export default function PatientRecord({ patient, width, actions }) {
  const navigate = useNavigate();

  const chipList = (value) => {
    if (!value || value.trim() === "") return ["None"];
    return value.split(";").map((v) => v.trim()).filter((v) => v.length > 0);
  };

  return (
    <div
      className="card bg-base-300 shadow-md rounded-lg p-4 hover:shadow-xl 
                 hover:bg-green-600 transition cursor-pointer w-full relative"
      onClick={() => navigate(`/patient/${patient.patientId}`)}
    >
      {/* NAME HEADER */}
      <h2 className="text-xl font-bold mb-3">
        {patient.name} {patient.lastName}
      </h2>

      {/* BASIC FIELDS */}
      <div className="flex flex-col gap-1 mb-3 text-sm">
        <p><strong>PESEL:</strong> {patient.pesel}</p>
        <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Address:</strong> {patient.address}</p>
        <p><strong>Phone:</strong> {patient.phoneNumber}</p>
        <p><strong>Blood Type:</strong> {patient.bloodType}</p>
        <p><strong>Insurance #:</strong> {patient.insuranceNumber}</p>
      </div>

      {/* TAG SECTIONS */}
      {/* ALLERGIES */}
      <div className="mb-2">
        <strong>Allergies:</strong>
        <div className="flex flex-wrap gap-2 mt-1">
          {chipList(patient.allergies).map((a, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-base-100 border border-base-300 rounded-md 
                         shadow-sm text-xs font-medium"
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* CHRONIC DISEASES */}
      <div className="mb-2">
        <strong>Chronic Diseases:</strong>
        <div className="flex flex-wrap gap-2 mt-1">
          {chipList(patient.chronicDiseases).map((d, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-base-100 border border-base-300 rounded-md 
                         shadow-sm text-xs font-medium"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* MEDICATIONS */}
      <div>
        <strong>Medications:</strong>
        <div className="flex flex-wrap gap-2 mt-1">
          {chipList(patient.medications).map((m, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-base-100 border border-base-300 rounded-md 
                         shadow-sm text-xs font-medium"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {actions && (
        <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      )}
    </div>
  );
}
