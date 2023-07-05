import React from 'react';
import Lottie from 'react-lottie-player';
import LoaderAnimation from '../../assets/anim/Loader.json'

const Loader = ({ extraClasses }) => {

  return (
    <div className={`w-full h-screen ${extraClasses}`}>
        <div className='flex flex-col justify-center items-center gap-4 w-full h-full'>
          <Lottie animationData={LoaderAnimation} loop play className='w-[84px] h-[60px]'/>
          <p className={`font-semibold text-primary-black text-base`}>Loading...</p>
        </div>
    </div>
  )
}

export default Loader
