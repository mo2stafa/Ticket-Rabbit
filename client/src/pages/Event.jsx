import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';


export default function Event() {
    const params = useParams();

    SwiperCore.use([Navigation]);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);


    useEffect(() => {
        
        const fetchEvent = async () => {
            try{
                setLoading(true);
                const res = await fetch(`/api/event/get/${params.eventId}`);
                const data = await res.json();
                if(data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }       
                data.date = formatDate(data.date);    
                setEvent(data);
                setLoading(false);
            }
            catch(error){
                setError(true);
                setLoading(false);
            }
        }

        fetchEvent();
    }, [params.eventId]);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const formatDate2 = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
      };

    const splitFormattedDate = (formattedDate) => {
    const [day, month, year] = formattedDate.split(' ');
    return { day, month, year };
    };
      
      
    const formattedDate = formatDate2(event?.date);
    const { day, month, year } = splitFormattedDate(formattedDate);



    const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-GB', options); 
    };
    
    const dayOfWeek = getDayOfWeek(event?.date);
      
      
    
    return (
        <div>
          {/* header */}
          <div className='flex flex-row justify-center gap-20 my-12 px-12'>
            <div>
              <div className="flex flex-col justify-center items-center rounded-lg bg-white overflow-hidden shadow-md w-24">
                <div className="bg-blue-500 text-white py-2 px-4 w-full">
                  <p className="text-base font-semibold uppercase tracking-wide text-center">{month}</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <p className="text-base text-gray-400 text-center pt-2 px-2 leading-none">{dayOfWeek}</p>
                  <p className="font-bold text-black text-center pb-2 px-2 leading-none text-3xl">{day}</p>
                </div>
              </div>
            </div>
      
            <div className='flex flex-col'>
              <h1 className='text-3xl font-semibold mb-4'>{event?.title} - {formattedDate}</h1>
              <div className='flex flex-row gap-8'>
                {/* description */}
                <div className='flex-3'>
                  <p className='font-semibold text-[#00bf6f] my-1'>Location</p>
                  <p>{event?.venue}</p>
                </div>
                <div className='border-l border-r border-gray-300 px-6 mx-6 flex-2'>
                  <p className='font-semibold text-[#00bf6f] my-1'>Date</p>
                  <p>{dayOfWeek}, {month} {day}</p>
                </div>
                <div className='flex-1'>
                  <p className='font-semibold text-[#00bf6f] my-1'>Time</p>
                  <p>{event?.time}</p>
                </div>
                <div className='flex items-center'>
                  <button className='p-3 border border-gray-300 rounded-lg'>Share</button>
                </div>
              </div>
            </div>
          </div>
      
          {/* {loading && <p>Loading...</p>}
          {error && <p>Error</p>} */}
      
          {/* {event && event.title} */}

          {event && !loading && !error && <>
          <Swiper navigation className='my-12 mx-40 border rounded-3xl shadow-md'>

            {event.imageUrls && event.imageUrls.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt="event" className="w-full h-[550px]" style={{objectFit: 'cover'}} />
              </SwiperSlide>
            ))}

          </Swiper>
        
          </>}




          {/* <div className='flex flex-row justify-center items-center'>
            <div>
                <div className='flex flex-row justify-between items-center'>
                    <div>
                        <div>Organized by</div>
                        

                    </div>
                    <div>
                        <button className='p-3 border border-gray-300 rounded-lg'>Only 3 tickets left</button>
                    </div>
                </div>

            </div>




            <div>
                col2

            </div>

          </div> */}
        </div>
      );
}
