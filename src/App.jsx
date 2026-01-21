import './App.css';
import "tailwindcss";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Welcome from './components/WelcomePage.jsx';
import LogregPage from './components/LoginPage.jsx';
import MainPage from "./components/MainPage.jsx";
import Layout from './components/Layout.jsx';
import PatientsPage from './components/adminComponents/doctorComponents/pages/PatientsPage.jsx';
import PatientPage from './components/adminComponents/doctorComponents/pages/PatientPage.jsx';
import RegisterPatientPage from './components/adminComponents/doctorComponents/pages/RegisterPatientPage.jsx';
import EditPatientPage from './components/adminComponents/doctorComponents/pages/EditPatientPage.jsx';
import DoctorSideProfile from './components/adminComponents/doctorComponents/pages/DoctorSideProfile.jsx';
import PatientSideProfile from './components/PatientSideProfile.jsx';
import LoginPage from './components/LoginPage.jsx';
import LabPage from './components/labComponents/LabPage.jsx';
import PatientDocuments from "./components/patientComponents/PatientDocuments.jsx";
import PatientInfo from "./components/patientComponents/PatientInfo.jsx";
import AdminDashboard from "./components/adminComponents/AdminDashboard.jsx";
import MedicalExaminationsPage from "./components/adminComponents/doctorComponents/pages/MedicalExaminationsPage.jsx";

// import Test from './components/test.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/sign-in" element={<LoginPage />} />

                <Route element={<Layout />}>
                    <Route path="/main" element={<MainPage />} />

                    {/* AADMIN PAGE */}
                    <Route path="/dashboard" element={<AdminDashboard />} />

                    {/* PATEIENT PAGE */}
                    <Route path="/patient-info" element={<PatientInfo />} />
                    <Route path="/patient-documents" element={<PatientDocuments />} />

                    {/* DOCTOR PAGE */}
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/patients/register" element={<RegisterPatientPage />} />
                    <Route path="/patients/examinations" element={<MedicalExaminationsPage />} />
                    <Route path="/patient/:patientId/update" element={<EditPatientPage />} />
                    <Route path="/patient/:patientId" element={<PatientPage />} />
                    <Route path="/patient-info" element={<PatientSideProfile />} />
                    <Route path="/doctor/profile" element={<DoctorSideProfile />} />
                    {/* LAB PAGE */}
                    <Route path="/lab/upload" element={<LabPage />} />
                </Route>
                {/* <Route path="/test" element={<Test />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;