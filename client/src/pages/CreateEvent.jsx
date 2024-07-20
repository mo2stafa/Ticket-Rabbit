import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';

export default function CreateEvent() {

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  console.log(formData);

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


  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Event</h1>

      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type="text" placeholder="title" className="border p-3 rounded-lg" id='title' maxLength={62} minLength={10} required/>  
          <textarea type="text" placeholder="description" className="border p-3 rounded-lg" id='description' required/>
          
          <input type="text" placeholder="category" className="border p-3 rounded-lg" id='category' required/>
          <input type="date" placeholder="date" className="border p-3 rounded-lg" id='date' required/>
          <input type="time" placeholder="time" className="border p-3 rounded-lg" id='time' required/>
          <input type="text" placeholder="venue" className="border p-3 rounded-lg" id='venue' required/>
          
          <div className='flex gap-10 flex-wrap py-3'>
            <div className='flex items-center gap-2'>
              <input type="number" placeholder="capacity" className="border p-3 rounded-lg" id='capacity' min={1} required/>
              <p>Capacity</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" placeholder="price" className="border p-3 rounded-lg" id='price' min={1} required/>
              <div className='flex flex-col items-center'>
                <p>Price</p>  
                <span className='text-xs'>($ / ticket)</span>


              </div>
            </div>
          </div>
          
          <div className='flex gap-10 flex-wrap py-3'>
            <h3>Select Event Visibility</h3>
            <div className='flex gap-2'>
                <input type='radio' id='public' name='visibility' value='public' className='w-5' required/>
                <span className='ml-2'>Public</span>         
            </div>

            <div className='flex gap-2'>
                <input type='radio' id='private' name='visibility' value='private' className='w-5' required/>
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


        <button className='p-3 bg-slate-700 text-white rounded-lg Uppercase hover:opacity-95 disabled:opacity-80 my-3'>Create Event</button>
       </div> 


      </form>
    </main>
  )
}
