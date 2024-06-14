import React from 'react'
import logo from '../assets/Ticket-Rabbit-logo-wide.svg';
import {Link} from 'react-router-dom'

export default function Header() {
  return (
    <header className='bg-white shadow-sm'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-2'> {/*try different  p */}
        <Link to='/'>
          <img src={logo} alt="Logo" className="w-32 md:w-48 lg:w-64 h-auto flex flex-wrap"  />
        </Link>
        {/* <form className='bg-slate-100'>
          <input type='text' placeholder='Search...' className='bg-transparent'></input>
        </form> */}
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:text-green-500'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:text-green-500'>
              About
            </li>
          </Link>
          <Link to='/sign-in'>
            <li className='text-slate-700 hover:text-green-500'>
              Sign in
            </li>
          </Link>
        </ul>
      </div>
    </header>
  )
}
