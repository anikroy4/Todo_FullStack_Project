import api from "../../api";



export const registration=(data)=>{
    return api.post("/auth/registration",data);
}



export const login=(data)=>{
    return api.post("/auth/login",data);
}





export const verifyEmail=(token)=>{
    return api.get(`/auth/verify/${token}`);
}




export const forgotPassword=(data)=>{
    return api.post("/auth/forgot-password",data);
}




export const resetPassword=(token, data)=>{
    return api.post(`/auth/reset-password/${token}`,data);
}

