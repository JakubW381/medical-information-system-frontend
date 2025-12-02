import { useNavigate } from "react-router-dom"

export default function PatientRecord({patient,width}){

    const navigate = useNavigate()

    return(
        <div
          className="card bg-base-300 shadow-md rounded-lg p-4 hover:shadow-xl hover:bg-green-600 transition w-full"
          onClick={() => navigate(`/patient/${patient.patientId}`)}
        >
          <h2 className="text-xl font-bold mb-2">{patient.name} {patient.lastName}</h2>
          <p><strong>PESEL:</strong> {patient.pesel}</p>
          <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Address:</strong> {patient.address}</p>
          <p><strong>Phone:</strong> {patient.phoneNumber}</p>
          <p><strong>Blood Type:</strong> {patient.bloodType}</p>
          <p><strong>Allergies:</strong> {patient.allergies || "None"}</p>
          <p><strong>Chronic Diseases:</strong> {patient.chronicDiseases || "None"}</p>
          <p><strong>Medications:</strong> {patient.medications || "None"}</p>
          <p><strong>Insurance #:</strong> {patient.insuranceNumber}</p>
        </div>
    )

}