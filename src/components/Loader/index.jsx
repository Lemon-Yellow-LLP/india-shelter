import React from 'react';
import Lottie from 'react-lottie-player';
import LoaderAnimation from '../../assets/anim/Loader.json'

const Loader = ({ extraClasses }) => {

  return (
    <div className={`w-full h-screen bg-black bg-opacity-50 ${extraClasses}`}>
        <div className='flex justify-center items-center w-full h-full'>
          <Lottie animationData={LoaderAnimation} loop play className='w-[84px] h-[60px]'/>
        </div>
    </div>
  )
}

export default Loader
