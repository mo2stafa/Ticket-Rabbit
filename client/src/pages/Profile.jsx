import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure , deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure} from '../redux/user/userSlice';
import { Link, redirect } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector(state => state.user)
  const [file,setFile] = useState(null)
  const [filePerc,setFilePerc] = useState(0)
  const [fileUplodeError,setFileUplodeError] = useState(false)
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
  
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try
    {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
  
      const data = await res.json();
      if(data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    }
    catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} className='hidden' accept='image/*'/>
        <img onClick={() => fileRef.current.click()} src={formData.avatar ||currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover cursor-pointer self-center mt-2"></img>
        <p className='text-center text-sm'>
          {fileUplodeError ? <span className='text-red-700'>Error Image Upload</span> : filePerc > 0 && filePerc < 100 ? <span className='text-slate-700'>Uploading {filePerc}%</span> : filePerc === 100 ? <span className='text-green-700'>Image Successfully Uploaded</span> : ""}
        </p>
        
        <input type='text' placeholder='Organization Name' id='organizationName' defaultValue={currentUser.organizationName} onChange={handleChange} className='border rounded-lg p-3'></input>
        <input type='text' placeholder='Email' id='email' defaultValue={currentUser.email} onChange={handleChange} className='border rounded-lg p-3'></input>
        <input type='password' placeholder='Password' id='password' onChange={handleChange}  className='border rounded-lg p-3'></input>

        <button disabled={loading} className='w-full py-2.5 px-8 flex items-center justify-center rounded-lg text-white text-base tracking-wider font-semibold border-none outline-none bg-blue-500 hover:bg-blue-600'>{loading ? "loading..." : "Update"}</button>
        {/* <button className='w-full py-2.5 px-8 flex items-center justify-center rounded-lg text-white text-base tracking-wider font-semibold border-none outline-none bg-[#00bf6f] hover:bg-[#009b5b]'>Add Event</button> */}
        <Link className='w-full py-2.5 px-8 flex items-center justify-center rounded-lg text-white text-base tracking-wider font-semibold border-none outline-none bg-[#00bf6f] hover:bg-[#009b5b]' to={"/create-event"}>Create Event</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>

      <p className='text-red-700 mt-5'>
        {error ? error : ""}
      </p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? "Profile Updated Successfully" : ""}
      </p>
    </div>
  )
}
