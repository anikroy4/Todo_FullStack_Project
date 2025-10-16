import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as authApi from "./authApi";

export const registration= createAsyncThunk("auth/registration",async(data,{rejectWithValue})=>{
    try {
        const res= await authApi.registration(data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error)
    }

})
export const login= createAsyncThunk("auth/login",async(data,{rejectWithValue})=>{
    try {
        const res= await authApi.login(data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error)
    }

})
export const verify= createAsyncThunk("auth/verify",async(data,{rejectWithValue})=>{
    try {
        const res= await authApi.verifyEmail(data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error)
    }

})
export const forgot= createAsyncThunk("auth/forgot",async(data,{rejectWithValue})=>{
    try {
        const res= await authApi.forgotPassword(data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error)
    }

})
export const reset= createAsyncThunk("auth/reset",async({token, data},{rejectWithValue})=>{
    try {
        const res= await authApi.resetPassword(token, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error)
    }

})


export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:null,
    accessToken:null,
    loading: false,
    error:null,
    message:null
  },
  reducers: {
    logout: (state) => {
        state.user=null;
        state.accessToken=null
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state) => {
      state.loading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.loading = true;
      state.user={
        username:action.payload.username,
        email:action.payload.email

      }
      state.accessToken=action.payload.accessToken
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error=action.payload.error
    })

    .addCase(registration.pending, (state) => {
      state.loading = true;
      
    })
    .addCase(registration.fulfilled, (state, action) => {
      state.loading = true;
      state.message=action.payload.message;
    })
    .addCase(registration.rejected, (state, action) => {
      state.loading = false;})

    .addCase(verify.pending, (state) => {
      state.loading = true;
      
    })
    .addCase(verify.fulfilled, (state, action) => {
        state.loading = true;
      state.message=action.payload.message

    })
    .addCase(verify.rejected, (state, action) => {
      state.loading = false;
      state.error=action.payload.error

    })



  }
    
})

// Action creators are generated for each case reducer function
export const { logout } = counterSlice.actions

export default authSlice.reducer