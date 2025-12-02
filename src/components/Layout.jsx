import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../util/Axios";

export default function Layout() {

    const [safeUser, setSafeUser] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? "btn btn-success btn-sm" : "btn btn-ghost btn-sm";


    const handleLogout = async () => {
        try {
            const response = await api.post("/api/auth/logout", {}, {
                withCredentials: true
            });
            console.log("Logout response:", response);
            setSafeUser("");
            navigate("/");
        } catch (err) {
            console.error("Błąd przy wylogowywaniu:", err);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get("/api/auth/safe-user", {
                    withCredentials: true
                });

                setSafeUser(response.data);
            } catch (err) {
                navigate("/sign-in")
                console.log("Błąd przy pobieraniu danych użytkownika:", err);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="navbar bg-base-100 shadow-md px-6 py-2 sticky top-0 z-50">
                <div className="flex-1 flex items-center gap-6">
                    <img
                        src="/logo.png"
                        className="max-w-[80px] rounded-lg cursor-pointer"
                        onClick={() => navigate("/main")}
                        alt="HIS Logo"
                    />

                    <div className="hidden md:flex gap-4">
                        {safeUser.role === "ROLE_USER" && (
                            <>
                                <button className={isActive("/patient-info")}>Patient Info</button>
                                <button className={isActive("/patient-documents")}>Documents</button>
                            </>
                        )}
                        {safeUser.role === "ROLE_DOCTOR" && (
                            <>
                                <button className={isActive("/patients")} onClick={() => navigate("/patients")}>Patients</button>
                                <button className={isActive("/doctor-profile")}>Doctor Profile</button>
                            </>
                        )}
                        {safeUser.role === "ROLE_ADMIN" && (
                            <>
                                <button className={isActive("/patients")} onClick={() => navigate("/patients")}>Patients</button>
                                <button className={isActive("/doctors")}>Doctors</button>
                                <button className={isActive("/documents")}>Documents</button>
                                <button className={isActive("/dashboard")}>Dashboard</button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {safeUser.role === "ROLE_DOCTOR" && (
                        <button className="btn btn-outline btn-sm">Your Profile</button>
                    )}
                    <p className="hidden sm:block text-sm font-medium">{safeUser.name} {safeUser.lastName}</p>

                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full border border-base-300">
                                <img
                                    alt="avatar"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        </div>
                        <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow mt-2 w-40 p-2">
                            <li>
                                <button onClick={handleLogout} className="w-full text-left">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <main className="flex-grow flex flex-col items-center">
                <Outlet />
            </main>

            <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - Medical Information Systems Inc.</p>
                </aside>
            </footer>
        </div>
    );
}
