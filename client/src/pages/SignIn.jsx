import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = new useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if(data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/')
      console.log(data);
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div class="font-[sans-serif] text-[#333] min-h-screen flex fle-col items-center justify-center py-6 px-4">
      <div class="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
        <div>
          <h2 class="lg:text-5xl text-4xl font-extrabold lg:leading-[55px]">
            Everything You Need for Your Event and More!
          </h2>
          <p class="text-sm mt-6">From secure ticketing to insightful analytics, we provide seamless solutions and more to make your event a success.</p>

          <div class="space-y-10 mt-10">
          <div class="flex gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="sm:w-7 sm:h-7 w-5 h-5 bg-[#00bf6f] fill-white rounded-full p-1 shrink-0" viewBox="0 0 24 24">
              <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
            </svg>
            <h4 class="sm:text-lg text-base font-semibold">Simple, easy-to-use platform</h4>
          </div>
          <div class="flex gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="sm:w-7 sm:h-7 w-5 h-5 bg-[#00bf6f] fill-white rounded-full p-1 shrink-0" viewBox="0 0 24 24">
              <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
            </svg>
            <h4 class="sm:text-lg text-base font-semibold">In-depth event analytics</h4>
          </div>
          <div class="flex gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="sm:w-7 sm:h-7 w-5 h-5 bg-[#00bf6f] fill-white rounded-full p-1 shrink-0" viewBox="0 0 24 24">
              <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
            </svg>
            <h4 class="sm:text-lg text-base font-semibold">Touchless onsite solutions</h4>
          </div>
        </div>

        <p class="text-sm mt-10">Don't have an account<Link to={"/sign-up"}> <a href="javascript:void(0);" class="text-[#24a972] font-semibold hover:underline ml-1">Register here</a></Link></p>
      </div>
        
        <form onSubmit={handleSubmit} class="bg-white md:max-w-lg md:ml-auto w-full">
          <div class="mb-12">
            <h3 class="text-3xl font-extrabold">Sign In</h3>
          </div>
          <div class="mt-10">
            <label class="text-sm block mb-2">Email</label>
            <div class="relative flex items-center">
              <input name="email" type="text" required class="w-full bg-transparent text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none" placeholder="Enter email" id='email' onChange={handleChange}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-2" viewBox="0 0 682.667 682.667">
                <defs>
                  <clipPath id="a" clipPathUnits="userSpaceOnUse">
                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                  </clipPath>
                </defs>
                <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                  <path fill="none" stroke-miterlimit="10" stroke-width="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                  <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                </g>
              </svg>
            </div>
          </div>
          <div class="mt-10">
            <label class="text-sm block mb-2">Password</label>
            <div class="relative flex items-center">
              <input name="password" type="password" required class="w-full bg-transparent text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none" placeholder="Enter password" id='password' onChange={handleChange}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-2 cursor-pointer" viewBox="0 0 128 128">
                <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
              </svg>
            </div>
          </div>
          <div class="flex items-center mt-8">
            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 shrink-0 rounded"/>
            <label for="remember-me" class="ml-3 block text-sm">
              Remember me
            </label>
          </div>
          <div class="mt-12 space-y-4">
            <button disabled={loading} class="w-full py-2.5 px-8 text-sm font-semibold rounded text-white bg-[#333] hover:bg-[#222] focus:outline-none transition-all">
            {loading ? 'Loading...' : 'Sign In'}
            </button>

            <OAuth />

          </div>
          {error && <p className='text-red-500 mt-5'>{error}</p>}

        </form>
      </div>
    </div>
  )
}
