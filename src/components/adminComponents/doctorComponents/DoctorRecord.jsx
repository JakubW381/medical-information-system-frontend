import { useNavigate } from "react-router-dom";

export default function DoctorRecord({ doctor }) {
  const navigate = useNavigate();

  const chipList = (value) => {
    if (!value || value.trim() === "") return ["None"];
    return value
      .split(";")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  };

  return (
    <div className="card bg-base-300 shadow-md rounded-lg p-4 w-full lg:w-9/10">
      <h2 className="text-xl font-bold mb-4">
        {doctor.name} {doctor.lastName}
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN — Basic Fields */}
        <div className="flex-1 flex flex-col gap-10 text-lg m-5">
          <p><strong>Position:</strong> {doctor.position || "None"}</p>
          <p><strong>Department:</strong> {doctor.department || "None"}</p>
          <p><strong>License #:</strong> {doctor.professionalLicenseNumber || "None"}</p>
        </div>

        {/* RIGHT COLUMN — Tags */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Specializations */}
          <div>
            <strong>Specializations:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {chipList(doctor.specialization).map((sp, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-base-100 border border-base-300 rounded-md 
                             shadow-sm text-xs font-medium"
                >
                  {sp}
                </span>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div>
            <strong>Departments:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {chipList(doctor.department).map((dep, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-base-100 border border-base-300 rounded-md 
                             shadow-sm text-xs font-medium"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>

          {/* Positions */}
          <div>
            <strong>Positions:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {chipList(doctor.position).map((pos, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-base-100 border border-base-300 rounded-md 
                             shadow-sm text-xs font-medium"
                >
                  {pos}
                </span>
              ))}
            </div>
          </div>

          {/* License Numbers */}
          <div>
            <strong>License Numbers:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {chipList(doctor.professionalLicenseNumber).map((lic, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-base-100 border border-base-300 rounded-md 
                             shadow-sm text-xs font-medium"
                >
                  {lic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
