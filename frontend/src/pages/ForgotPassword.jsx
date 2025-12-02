import React, { useState } from 'react'

import { Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { forgot } from '../features/auth/authSlice'

const ForgotPassword = () => {

  const [form, setForm] = useState({
    email: "",
  })

  const dispatch = useDispatch();
  const {message, error} = useSelector((state)=>state.auth)
  const handleSubmit=()=>{
    dispatch(forgot(form));
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Reset your password</h2>

      <p className="text-sm text-gray-600 mb-6">
        Enter the email associated with your account. We'll send a link to reset
        your password.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
          <button type="submit" className="mt-4 w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            Send Reset Link
          </button>
        </div>  
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-emerald-600 hover:underline">Back to sign in</Link>
      </div>
    </div>
  )
}

export default ForgotPassword