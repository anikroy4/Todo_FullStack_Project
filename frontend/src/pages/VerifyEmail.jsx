import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { verify } from '../features/auth/authSlice';

const VerifyEmail = () => {

  const {token}=useParams();
  const dispatch= useDispatch();
  const {message, error} = useSelector((state)=>state.auth)

  useEffect(() => {
    if(token){
      dispatch(verify(token));
    } 
  }, []);

  return (
    <div>Verifying your email. Please wait...</div>
  )
}

export default VerifyEmail