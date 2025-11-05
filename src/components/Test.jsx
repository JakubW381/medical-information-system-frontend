import api from "../util/Axios";


export const Login = async ({email, password}) => {


    try {
        const response = await api.post("/api/auth/login",
            { "email": email, "password" : password }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        console.log("Yupi", response);
        return true
    } catch (err) {
        console.log(err);
        return false
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