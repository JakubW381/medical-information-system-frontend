import './App.css';
import "tailwindcss";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Welcome from './components/welcomePage.jsx';
import LogregPage from './components/logregPage.jsx';
import MainPage from "./components/MainPage.jsx";
import Layout from './components/Layout.jsx';
import PatientsPage from './components/adminComponents/doctorComponents/pages/PatientsPage.jsx';
import PatientPage from './components/adminComponents/doctorComponents/pages/PatientPage.jsx';
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
          <Route path="/patient/:patientId" element={<PatientPage />} />
        </Route>





        {/* <Route path="/test" element={<Test />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;