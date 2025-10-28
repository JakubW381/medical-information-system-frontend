import './App.css'
import "tailwindcss";
import './components/welcomePage.jsx'
import welcome from "./components/welcomePage.jsx";
import Test from './components/test.jsx';

function App() {

  return (
      <>
        {welcome()}
        {/* <Test/> */}
    </>
  )
}

export default App
