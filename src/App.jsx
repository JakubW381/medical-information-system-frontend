import './App.css';
import "tailwindcss";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Welcome from './components/welcomePage.jsx';
import LogregPage from './components/logregPage.jsx';
import MainPage from "./components/MainPage.jsx";
import Test from './components/test.jsx';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/logreg" element={<LogregPage />} />
            <Route path="/main" element={<MainPage />} />
          {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
      </BrowserRouter>
  );
}

export default App;