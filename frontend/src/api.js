import axios from "axios";
import {jwtDecode} from "jwt-decode";

const api=axios.create({
    baseURL:"http://localhost:8000/api/",
    withCredentials:true, // This is for send cookies permission

})

let accessToken=null;
export const setToken=(token)=>{
    accessToken=token;
}

api.interceptors.request.use(async (config)=>{
    console.log("this is api call");
    if (accessToken){
        const decoded=jwtDecode(accessToken);
        if (decoded.exp*1000<Date.now()){
            const res= await api.post("/auth/refresh")
            accessToken=res.data.accessToken;
            
        }
        config.headers.Authorization=`Bearer ${accessToken}`;
    }
    return config;
    
})
 
export default api;