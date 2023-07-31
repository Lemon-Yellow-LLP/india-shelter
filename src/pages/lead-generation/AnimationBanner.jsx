import { Header } from '../../components';
import { create } from '@lottiefiles/lottie-interactivity';
import { lazy, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import iconBack from '../../assets/icons/back.svg';
import logo from '../../assets/logo.svg';
import { AnimatePresence, motion } from 'framer-motion';

const BackgroundAnimation = lazy(() => import('./BackgroundAnimation'));
const HomeLoanAnimation = lazy(() => import('./HomeLoanAnimation'));
import LoanAgainstPropertyAnimation from './LoanAgainstPropertyAnimation';
import { useState } from 'react';

const frames = [
  [0, 3],
  [3, 38],
  [34, 90],
];

const AnimationBanner = () => {
  const { activeStepIndex, previousStepIndex, goToPreviousStep, selectedLoanType } =
    useContext(AuthContext);
  const lottiePlayerRef = useRef(null);

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleWindowResize() {
      setInnerWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    if (lottiePlayerRef.current && selectedLoanType !== 'LAP')
      create({
        player: lottiePlayerRef.current,
        mode: 'chain',
        actions: [
          {
            state: 'autoplay',
            frames:
              previousStepIndex.current > activeStepIndex
                ? [...frames[activeStepIndex + 1]].reverse()
                : frames[activeStepIndex],
            repeat: 1,
          },
        ],
      });
  }, [activeStepIndex, previousStepIndex, selectedLoanType]);

  return (
    <div
      style={
        innerWidth < 768
          ? { backgroundColor: '#CCE2BE', position: 'fixed', overflow: 'hidden' }
          : { backgroundColor: '#CCE2BE' }
      }
      className='flex flex-col w-full md:w-[597px] 2xl:w-2/4 relative transition-colors ease-out duration-300'
    >
      <div className='relative md:hidden'>
        <Header />
      </div>
      <div className='flex w-full items-center justify-between md:items-start p-4 md:pl-12 md:pr-24 md:pt-[52px] gap-1 z-50'>
        <button
          title='Go back'
          onClick={goToPreviousStep}
          type='button'
          className={`${
            activeStepIndex ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          } w-8 h-8 md:w-11 md:h-11 md:mt-2 cursor-pointer`}
        >
          <img className='w-full h-full pointer-events-none' src={iconBack} alt='Back' />
        </button>
        <div className='flex flex-col gap-7 items-center flex-1'>
          <img
            style={{ width: '174px', height: '43px' }}
            className='hidden md:inline'
            src={logo}
            alt='India Shelter'
          />
          <h4
            style={{ color: '#04584C' }}
            className='text-center text-base md:text-xl font-medium pr-4 md:pr-0'
          >
            {selectedLoanType === 'LAP'
              ? 'Get the right value for your property'
              : 'Find your shelter with us'}
          </h4>
        </div>
      </div>

      <AnimatePresence>
        {selectedLoanType !== 'LAP' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transitionDuration: 2 }}
            exit={{ opacity: 0 }}
          >
            <BackgroundAnimation
              id='home-loan-bg-animation'
              className={`absolute bottom-0 left-0 w-full max-h-[600px] 2xl:max-h-[80vh]`}
              loop
              play
            />
            <HomeLoanAnimation
              ref={lottiePlayerRef}
              id='home-loan-animation'
              className='md:absolute bottom-0 left-0 w-full max-h-[600px] 2xl:max-h-[80vh]'
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedLoanType === 'LAP' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transitionDuration: 2 }}
            exit={{ opacity: 0 }}
          >
            <LoanAgainstPropertyAnimation
              play
              className='md:absolute bottom-0 left-0 w-full max-h-[600px] 2xl:max-h-[80vh]'
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimationBanner;
