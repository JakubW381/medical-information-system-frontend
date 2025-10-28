import api from "../util/Axios";

const Login = async () => {
    try {
        const response = await api.post("/api/auth/login", { "email":"patient3@example.com", "password" : "patient123" }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        console.log(response);
        navigate("/");
    } catch (err) {
        console.log(err);
    }
}

const GetInfo = async () => {
    try {
        const response = await api.get("/api/user/patient", {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        console.log(response);
    } catch (err) {
        console.log(err);
    }
}

const Test = () =>{
    return(
        <>
         <button onClick={Login}>login</button>
        <br></br>
         <button onClick={GetInfo}>get patient info</button>
        </>
    )
}
export default Test;