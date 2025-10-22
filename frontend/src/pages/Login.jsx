import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EmailIcon from '../../public/icons/registrationicons/EmailIcon'
import EyeIcon from '../../public/icons/registrationicons/EyeIcon'
import { login } from '../features/auth/authSlice'

const Login = () => {
  const [form, setForm] = useState({
      email: "",
      password: "",
    })
  
    const dispatch=useDispatch()
  
    const {message, error} = useSelector((state)=>state.auth)
  
    const onChangeEmail = (e) => {
      setForm({ ...form, email: e.target.value })
    }
  
    const onChangePassword = (e) => {
      setForm({ ...form, password: e.target.value })
    }
  
    
     
    const handleClick=(e)=>{
      e.preventDefault()
      dispatch(login(form))
     }


  return (
    <div className="bg-[#014743] max-w-full  items-center mx-auto md:min-h-screen p-4 md:grid-cols-3 [box-shadow:0_2px_10px_-3px_rgba(14,14,14,0.3)] rounded-xl overflow-hidden">
      <div className="">
        {/* <div className="max-md:order-1 flex flex-col justify-center md:space-y-16 space-y-8 max-md:mt-16 min-h-full bg-gradient-to-r from-slate-900 to-slate-700 lg:px-8 px-4 py-4">
          <div>
            <h3 className="text-white text-lg ">Create Your Account</h3>
            <p className="text-[13px] text-slate-300 mt-3 leading-relaxed">Welcome to our registration page! Get started by creating your account.</p>
          </div>
          <div>
            <h3 className="text-white text-lg">Simple & Secure Registration</h3>
            <p className="text-[13px] text-slate-300 mt-3 leading-relaxed">Our registration process is designed to be straightforward and secure. We prioritize your privacy and data security.</p>
          </div>
        </div> */}

        <form className="md:col-span-3 w-full py-6 px-6 sm:px-14 max-w-lg mx-auto">
          <div className="mb-8">
            <h1 className="text-slate-900 text-2xl font-bold items-center text-center">Login Now</h1>
          </div>

          <div className="space-y-6">
            
            <div>
              <label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
              <div className="relative flex items-center">
                <input name="email" type="email" onChange={onChangeEmail} required className="text-slate-900 bg-white border border-slate-300 w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-500" placeholder="Enter email" />
                <EmailIcon className="w-4 h-4 absolute right-4" />
              </div>
            </div>
            <div>
              <label className="text-slate-900 text-sm font-medium mb-2 block">Password</label>
              <div className="relative flex items-center">
                <input name="password" type="password" onChange={onChangePassword} required className="text-slate-900 bg-white border border-slate-300 w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-500" placeholder="Enter password" />
                <EyeIcon className="w-4 h-4 absolute right-4 cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-600">
                I accept the <a href="javascript:void(0);" className="text-blue-600 font-medium hover:underline ml-1">Terms and Conditions</a>
              </label>
            </div>
          </div>

          <div className="mt-8">
            <button type="button" className="w-full py-2.5 px-4 tracking-wider text-sm rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none cursor-pointer" onClick={handleClick}>
              Login
            </button>
          </div>
          <p className="text-slate-600 text-sm mt-6 text-center">Already have an account? <a href="javascript:void(0);" className="text-blue-600 font-medium hover:underline ml-1">Login here</a></p>
        </form>
      </div>
    </div>
  )
}

export default Login