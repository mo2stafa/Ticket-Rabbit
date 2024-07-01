import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser} = useSelector(state => state.user)
  const [file,setFile] = useState(null)
  const [filePerc,setFilePerc] = useState(0)
  const [fileUplodeError,setFileUplodeError] = useState(false)
  const [formData, setFormData] = useState({});

  
  useEffect(() => {
    if(file) {
      handelFileUpload(file);
    }
  }, [file]);

  const handelFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
    },
    (error) => {
      setFileUplodeError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({
          ...formData,
          avatar: downloadURL
        });
      })
    }
    );
  };


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} className='hidden' accept='image/*'/>
        <img onClick={() => fileRef.current.click()} src={formData.avatar ||currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2"></img>
        <p className='text-center text-sm'>
          {fileUplodeError ? <span className='text-red-700'>Error Image Upload</span> : filePerc > 0 && filePerc < 100 ? <span className='text-slate-700'>Uploading {filePerc}%</span> : filePerc === 100 ? <span className='text-green-700'>Image Successfully Uploaded</span> : ""}
        </p>
        
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
