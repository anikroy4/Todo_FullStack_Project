import api from "../../api";



export const registration=(data)=>{
    api.post("/auth/registration",data)


}



export const login=(data)=>{
    api.post("/auth/login",data)


}



export const verifyEmail=(token)=>{
    api.get(`/auth//verify/${token}`)


}


export const forgotPassword=(data)=>{
    api.post("/auth/forgot-password",data)


}


export const resetPassword=(token, data)=>{
    api.post(`/auth//reset-password/${token}`,data)


}