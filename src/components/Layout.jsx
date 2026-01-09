import {Outlet, useNavigate, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import api from "../util/Axios";

export default function Layout() {

    const [safeUser, setSafeUser] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path
            ? "btn btn-success btn-sm md:btn-md text-base md:text-lg font-semibold"
            : "btn btn-ghost btn-sm md:btn-md text-base md:text-lg font-semibold";

    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout", {}, {withCredentials: true});
            setSafeUser("");
            navigate("/");
        } catch (err) {
            console.error("Błąd przy wylogowywaniu:", err);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get("/api/auth/safe-user", {withCredentials: true});
                setSafeUser(response.data);
            } catch (err) {
                navigate("/sign-in");
                console.log(err)
            }
        };
        fetchUserInfo();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <div className="navbar bg-base-100 shadow-md px-4 md:px-6 py-2 sticky top-0 z-50">
                <div className="flex-1 flex items-center gap-4 md:gap-6">
                    <img
                        src="/logo.png"
                        className="max-w-[60px] md:max-w-[80px] rounded-lg cursor-pointer"
                        onClick={() => navigate("/main")}
                        alt="HIS Logo"
                    />

                    {/* Desktop menu */}
                    <div className="hidden md:flex gap-2 md:gap-4">
                        {safeUser.role === "ROLE_USER" && (
                            <>
                                <button className={isActive("/patient-info")}
                                        onClick={() => navigate("/patient-info")}>Patient Info
                                </button>
                                <button className={isActive("/patient-documents")}
                                        onClick={() => navigate("/patient-documents")}>Documents
                                </button>
                            </>
                        )}
                        {safeUser.role === "ROLE_DOCTOR" && (
                            <>
                                <button className={isActive("/patients")}
                                        onClick={() => navigate("/patients")}>Patients
                                </button>
                                <button className={isActive("/patients/register")}
                                        onClick={() => navigate("/patients/register")}>Register Patient
                                </button>
                            </>
                        )}
                        {safeUser.role === "ROLE_ADMIN" && (
                            <>
                                <button className={isActive("/patients")}
                                        onClick={() => navigate("/patients")}>Patients
                                </button>
                                <button className={isActive("/doctors")}>Doctors</button>
                                <button className={isActive("/documents")}>Documents</button>
                                <button className={isActive("/dashboard")} onClick={() => navigate("/dashboard")}>Dashboard</button>
                            </>
                        )}
                        {safeUser.role === "ROLE_LAB" && (
                            <>
                                <button className={isActive("/lab/upload")}
                                        onClick={() => navigate("/lab/upload")}>Upload Document
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu dropdown */}
                    <div className="dropdown md:hidden">
                        <label tabIndex={0} className="btn btn-ghost btn-sm m-1">Menu</label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            {safeUser.role === "ROLE_USER" && (
                                <>
                                    <li>
                                        <button onClick={() => navigate("/patient-info")}>Patient Info</button>
                                    </li>
                                    <li>
                                        <button onClick={() => navigate("/patient-documents")}>Documents</button>
                                    </li>
                                </>
                            )}
                            {safeUser.role === "ROLE_DOCTOR" && (
                                <>
                                    <li>
                                        <button onClick={() => navigate("/patients")}>Patients</button>
                                    </li>
                                    <li>
                                        <button onClick={() => navigate("/patients/register")}>Register Patient</button>
                                    </li>
                                </>
                            )}
                            {safeUser.role === "ROLE_ADMIN" && (
                                <>
                                    <li>
                                        <button onClick={() => navigate("/patients")}>Patients</button>
                                    </li>
                                    <li>
                                        <button onClick={() => navigate("/doctors")}>Doctors</button>
                                    </li>
                                    <li>
                                        <button onClick={() => navigate("/documents")}>Documents</button>
                                    </li>
                                    <li>
                                        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

                {/* User info & avatar */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Desktop buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        <button className="btn btn-outline btn-sm md:btn-md btn-error text-sm md:text-base"
                                onClick={handleLogout}>Logout
                        </button>
                        {safeUser.role === "ROLE_DOCTOR" && (
                            <button
                                className={"btn btn-outline btn-sm md:btn-md text-sm md:text-base " + isActive("/doctor/profile")}
                                onClick={() => navigate("/doctor/profile")}>Your Profile</button>
                        )}
                        <p className="hidden sm:block text-sm md:text-base font-medium">{safeUser.name} {safeUser.lastName}</p>
                        <div className="avatar">
                            <div className="w-10 md:w-12 rounded-xl border border-base-300">
                                <img
                                    alt="avatar"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile avatar dropdown */}
                    <div className="dropdown dropdown-end md:hidden">
                        <label tabIndex={0} className="cursor-pointer">
                            <div className="avatar">
                                <div className="w-10 rounded-xl border border-base-300">
                                    <img
                                        alt="avatar"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                    />
                                </div>
                            </div>
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-36">
                            {safeUser.role === "ROLE_DOCTOR" && (
                                <li>
                                    <button onClick={() => navigate("/doctor/profile")}>Your Profile</button>
                                </li>
                            )}
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-grow flex flex-col items-center w-full">
                <Outlet/>
            </main>

            {/* Footer */}
            <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 mt-auto">
                <p>Copyright © {new Date().getFullYear()} - Medical Information Systems Inc.</p>
            </footer>
        </div>
    );
}
