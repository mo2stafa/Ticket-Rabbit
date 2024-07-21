import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { app } from '../firebase';
import {useSelector} from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateEvent() {

  const {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    capacity: '1',
    price: '0',
    visibility: 'public',
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
      const fetchEvent = async () => {
        const eventId = params.eventId;
        const res = await fetch(`/api/event/get/${eventId}`);
        const data = await res.json();
        data.date = formatDate(data.date);

        setFormData(data);
        if(data.success === false) {
          console.log(data.message);
          return;
        }  
      }

      fetchEvent();
  }, []);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


  const handleImageUpload = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      }).catch((error) => {
        setImageUploadError("Image upload failed (2 mb max per image)");
        setUploading(false);
      });
    }else{
      setImageUploadError("You can only upload up to 6 images");
      setUploading(false);
    }
  };


  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      )
    });
  };


  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };


  const handleChange = (e) => {
    if (e.target.type === 'radio') {
      setFormData({
        ...formData,
        visibility: e.target.value,
      })
    };

    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'date' || e.target.type === 'time' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        setError('Please select at least one image');
        return;
      }
      setLoading(true);
      setError(false);

      const res = await fetch(`/api/event/update/${params.eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          creator: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/event/${data._id}`);

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update Event</h1>

      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input onChange={handleChange} value={formData.title} type="text" placeholder="title" className="border p-3 rounded-lg" id='title' maxLength={100} required/>  
          <textarea onChange={handleChange} value={formData.description} type="text" placeholder="description" className="border p-3 rounded-lg" id='description' required/>
          
          <input onChange={handleChange} value={formData.category} type="text" placeholder="category" className="border p-3 rounded-lg" id='category' required/>
          <input onChange={handleChange} value={formData.date} type="date" placeholder="date" className="border p-3 rounded-lg" id='date' required/>
          <input onChange={handleChange} value={formData.time} type="time" placeholder="time" className="border p-3 rounded-lg" id='time' required/>
          <input onChange={handleChange} value={formData.venue} type="text" placeholder="venue" className="border p-3 rounded-lg" id='venue' required/>
          
          <div className='flex gap-10 flex-wrap py-3'>
            <div className='flex items-center gap-2'>
              <input onChange={handleChange} value={formData.capacity} type="number" placeholder="capacity" className="border p-3 rounded-lg" id='capacity' min={1} required/>
              <p>Capacity</p>
            </div>
            <div className='flex items-center gap-2'>
              <input onChange={handleChange} value={formData.price} type="number" placeholder="price" className="border p-3 rounded-lg" id='price' min={0} required/>
              <div className='flex flex-col items-center'>
                <p>Price</p>  
                <span className='text-xs'>($ / ticket)</span>


              </div>
            </div>
          </div>
          
          <div className='flex gap-10 flex-wrap py-3'>
            <h3>Select Event Visibility</h3>
            <div className='flex gap-2'>
                <input onChange={handleChange} checked={formData.visibility === 'public'} type='radio' id='public' name='visibility' value='public' className='w-5' required/>
                <span className='ml-2'>Public</span>         
            </div>

            <div className='flex gap-2'>
                <input onChange={handleChange} checked={formData.visibility === 'private'} type='radio' id='private' name='visibility' value='private' className='w-5' required/>
                <span className='ml-2'>Private</span>         
            </div>



          </div>
        </div>

       <div className='flex flex-col gap-4 flex-1'>
        <div>
          <span className='font-semibold'>Images:</span>
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
        </div>
        <div className='flex gap-4'>
          <input onChange={(e) => setFiles(e.target.files)} type="file" className="p-3 border border-gray-300 rounded w-full" id='images' accept='image/*' multiple />
          <button type='button' disabled={uploading} onClick={handleImageUpload} className='p-3 border border-green-700 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading?'Uploading...':'Upload'}</button>
        </div>
        <p className='text-red-500 text-sm'>{imageUploadError && imageUploadError}</p>
        {
          formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
            <div key={url} className='flex justify-between p-3 border rounded-lg items-center'>
              <img src={url} alt="Event image" className="w-20 h-20 object-contain rounded-lg" />
              <button onClick={() => handleRemoveImage(index)} type='button' className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Remove</button>
            </div>
          ))
        }

        <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg Uppercase hover:opacity-95 disabled:opacity-80 my-3'>{loading?'updating...':'Update Event'}</button>
        <p className='text-red-500 text-sm'>{error && error}</p>

       </div>

      </form>
    </main>
  )
}
