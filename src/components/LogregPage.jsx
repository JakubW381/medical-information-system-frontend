import {Login} from "./Test.jsx";
import {useState} from "react";
import { useNavigate } from "react-router-dom";


export default function LogregPage() {
    const [mail, setMail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleLoginClick = async () => {
        const success = await Login({
            email: mail,
            password: password
        });
        if (success) {
            navigate("/main");
        } else {
            alert("Email or password is incorrect");
        }
    }


    return (
        <div className="flex flex-col min-h-screen">
        <main className="flex flex-1 justify-center items-center font-mono font-bold">
            <div className="flex flex-col items-center justify-center m-15">
                <p>Login</p>
                <label className="input validator m-5">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                    </svg>
                    <input onChange={e => setMail(e.target.value)} type="email" placeholder="mail@site.com" required/>
                </label>
                <div className="validator-hint hidden">Enter valid email address</div>
                <p className="validator-hint">
                    Must be 3 to 30 characters
                    <br/>containing only letters, numbers or dash
                </p>
                <label className="input validator">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                            ></path>
                            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                        </g>
                    </svg>
                    <input
                        onChange={e => {setPassword(e.target.value)}}
                        type="password"
                        required
                        placeholder="Password"

                    />
                </label>
                <p className="validator-hint hidden">
                    Must be more than 8 characters, including
                    <br/>At least one number <br/>At least one lowercase letter <br/>At least one uppercase letter
                </p>
                <button onClick={handleLoginClick} className="btn btn-dash btn-success m-3">Sign In</button>
            </div>



        </main>
            <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved by Medical Information Systems Inc.</p>
                </aside>
            </footer>
        </div>
    )
}