import React from 'react'
import LoginForm from './login-form'


const LoginPage = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm h-96 shadow-xl py-10 flex flex-col" style={{ backgroundColor: "#fff", padding: "10px", borderRadius: "5%" }}>
      <span className='mt-8 center grid justify-items-center text-xl'>Dashboard Authentication</span>
      <LoginForm />
    </div>
  )
}

export default LoginPage
