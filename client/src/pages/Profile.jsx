import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const {currentUser} = useSelector(state => state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2"></img>
        <input type='text' placeholder='Company Name' id='companyname' className='border rounded-lg p-3'></input>
        <input type='text' placeholder='Email' id='email' className='border rounded-lg p-3'></input>
        <input type='text' placeholder='Password' id='password' className='border rounded-lg p-3'></input>

        <button className='w-full py-2.5 px-8 flex items-center justify-center rounded-lg text-white text-base tracking-wider font-semibold border-none outline-none bg-blue-500 hover:bg-blue-600'>Update</button>
        <button className='w-full py-2.5 px-8 flex items-center justify-center rounded-lg text-white text-base tracking-wider font-semibold border-none outline-none bg-[#00bf6f] hover:bg-[#009b5b]'>Add Event</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
