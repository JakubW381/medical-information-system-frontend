import './App.css';
import "tailwindcss";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Welcome from './components/welcomePage.jsx';
import LogregPage from './components/LogregPage.jsx';
import MainPage from "./components/MainPage.jsx";
import Layout from './components/Layout.jsx';
import PatientsPage from './components/adminComponents/doctorComponents/pages/PatientsPage.jsx';
import PatientPage from './components/adminComponents/doctorComponents/pages/PatientPage.jsx';
import RegisterPatientPage from './components/adminComponents/doctorComponents/pages/RegisterPatientPage.jsx';
import EditPatientPage from './components/adminComponents/doctorComponents/pages/EditPatientPage.jsx';
// import Test from './components/test.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/sign-in" element={<LogregPage />} />

        <Route element={<Layout />}>
          <Route path="/main" element={<MainPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/register" element={<RegisterPatientPage />} />
          <Route path="/patient/:patientId/update" element={<EditPatientPage />} />
          <Route path="/patient/:patientId" element={<PatientPage />} />
        </Route>





        {/* <Route path="/test" element={<Test />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;