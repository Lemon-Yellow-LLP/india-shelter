import { lazy, useContext, useEffect, useState } from 'react';
import { Header } from '../../components';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types';
import { currencyFormatter } from '../../components/CurrencyInput';
import time24 from '../../assets/icons/time-24.svg';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../../assets/logo.svg';
import { checkBre100 } from '../../global';
import { IconClose } from '../../assets/icons';

const LoanAgainstPropertyDesktopAnimation = lazy(() => import('./LapDesktopAnimation'));
const HomeLoanDesktopAnimation = lazy(() => import('./HomeLoanDesktopAnimation'));
const BackgroundAnimation = lazy(() => import('./BackgroundAnimation'));
const HomeLoanAnimation = lazy(() => import('./HomeLoanAnimation'));
const LoanAgainstPropertyAnimation = lazy(() => import('./LoanAgainstPropertyAnimation'));

const CongratulationBanner = () => {
  const {
    values,
    currentLeadId,
    setProcessingBRE,
    setIsQualified,
    isQualified,
    setLoadingBRE_Status,
    loadingBRE_Status,
  } = useContext(AuthContext);
  const [allowedLoanAmount, setAllowedLoanAmount] = useState(values.bre_100_amount_offered || 0);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'initial');
  }, []);

  useEffect(() => {
    const paths = document.querySelectorAll('.foreground path');
    paths.forEach((path) => {
      path.style.transition = `all ease-out 300ms`;
      path.style.fill = loadingBRE_Status ? '#FFF1CD' : '#EEF0DD';
    });
  }, [loadingBRE_Status]);

  useEffect(() => {
    if (!currentLeadId || isQualified !== null) return;
    setLoadingBRE_Status(true);
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev > 98) {
          clearInterval(interval);
          return prev;
        }
        return (prev += 1);
      });
    }, 120);

    checkBre100(currentLeadId).then((res) => {
      clearInterval(interval);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      });
      const breResponse = res.data.bre_100_response;
      if (breResponse.statusCode === 200) {
        setLoadingBRE_Status(false);
        setIsQualified(true);
        const offeredAmount = breResponse.body.find((rule) => rule.Rule_Name === 'Amount_Offered');
        setAllowedLoanAmount(offeredAmount.Rule_Value);
      } else {
        setIsQualified(false);
        setLoadingBRE_Status(false);
      }
      setLoadingBRE_Status(false);
    });
  }, [currentLeadId, isQualified, setIsQualified, setLoadingBRE_Status]);

  return (
    <div
      style={{ backgroundColor: loadingBRE_Status ? '#FFF1CD' : '#EEF0DD', minHeight: '100dvh' }}
      className='flex flex-col w-full relative transition-colors ease-out duration-300 overflow-hidden'
    >
      <div className='relative md:hidden'>
        <Header />
      </div>
      <div className='flex w-full items-center justify-between md:items-start p-4 md:px-16 md:pt-10 gap-1 z-50'>
        <div className='flex flex-col gap-7 items-center flex-1'>
          <img
            style={{
              maxWidth: 175,
            }}
            className='hidden md:inline self-start md:ml-20'
            src={logo}
            alt='India Shelter'
          />
          <h4
            style={{ color: '#04584C' }}
            className='text-center text-base md:text-xl font-medium flex items-center w-full mx-4 gap-1 md:hidden'
          >
            <span className='flex-1'>
              {values.loan_type === 'LAP'
                ? 'Get the right value for your property'
                : 'Find your shelter with us'}
            </span>
          </h4>
        </div>
        <a href='/'>
          <div className='bg-white rounded-full p-0.5'>
            <IconClose />
          </div>
        </a>
      </div>

      <AnimatePresence>
        {values.loan_type !== 'LAP' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transitionDuration: 2 }}
            exit={{ opacity: 0 }}
            className='relative w-full md:flex-1'
          >
            <BackgroundAnimation
              id='home-loan-bg-animation'
              className={`md:hidden absolute top-0 md:top-auto md:bottom-0 left-0 w-full max-h-[600px] 2xl:max-h-screen`}
              loop
              play
            />
            <HomeLoanAnimation
              id='home-loan-animation'
              play
              loop={false}
              style={{
                maxWidth: 636,
              }}
              className='md:hidden md:absolute bottom-0 md:bottom-10 left-0 md:left-2/4 md:-translate-x-2/4 w-full max-h-[318px]'
            />
            <HomeLoanDesktopAnimation
              play
              loop={false}
              className='hidden md:block md:absolute md:w-screen md:bottom-[-270px]'
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {values.loan_type === 'LAP' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transitionDuration: 2 }}
            exit={{ opacity: 0 }}
          >
            <LoanAgainstPropertyAnimation
              loop={false}
              play
              className='md:hidden md:absolute bottom-0 left-0 md:left-2/4 md:-translate-x-2/4 w-full md:h-2/4'
            />
            <LoanAgainstPropertyDesktopAnimation
              play
              loop={false}
              className='hidden md:block md:absolute md:w-screen md:bottom-[-220px]'
            />
          </motion.div>
        )}
      </AnimatePresence>
      {values.loan_type === 'LAP' && (
        <div className='absolute top-2/4 w-full'>
          <div className='bg-transparent h-24 md:hidden'>
            {' '}
            <svg
              width='360'
              height='227'
              viewBox='0 0 360 227'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='w-full'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M404.054 71.2076C349.089 66.4928 347.603 49.6551 304.522 45.6135C232.023 38.8134 225.788 57.7374 163.395 55.717C125.344 54.484 76.7638 26.7981 44.5098 15.637C-33.6401 -11.4083 -87 4.83984 -87 4.83984V226.372H470.058V65.452C470.058 65.452 436.14 73.9605 404.054 71.2076Z'
                fill={loadingBRE_Status ? '#FFF1CD' : '#EEF0DD'}
                className='transition-colors ease-out duration-300'
              />
            </svg>
          </div>
          <div
            className={`md:fixed top-1/4 left-2/4 md:-translate-x-2/4 md:-translate-y-2/4 flex-1 transition-colors ease-out duration-300 flex flex-col items-center z-50 ${loadingBRE_Status ? 'bg-[#FFF1CD]' : 'bg-[#EEF0DD]'
              } md:bg-opacity-0`}
          >
            {loadingBRE_Status ? (
              <>
                <div
                  style={{
                    color: '#04584C',
                  }}
                  className='font-semibold text-lg md:text-2xl'
                >
                  Verifying your details
                </div>
                <div className='text-primary-red font-medium text-[22px] md:text-[32px] mt-2'>
                  {progress}%
                </div>
              </>
            ) : (
              ''
            )}

            {!loadingBRE_Status && isQualified ? (
              <div className='flex items-center flex-col'>
                <div
                  style={{
                    color: '#231F20',
                  }}
                  className='text-[22px] md:text-[32px] font-medium'
                >
                  Congratulations!
                </div>
                <div className='text-base text-black font-normal mt-1 md:mt-4 text-center'>
                  You have a pre-approved loan of upto
                </div>
                <div
                  style={{
                    color: '#277C5E',
                  }}
                  className='text-[32px] font-semibold mt-3 md:mt-4'
                >
                  ₹ {currencyFormatter.format(allowedLoanAmount)}/-
                  <sup className='text-[22px] font-medium text-primary-black mt-2'>*</sup>
                </div>
                {/* <div className='text-dark-grey md:text-base mt-1 md:mt-4 font-semibold'>
                  Terms and Condition applied!
                </div> */}
                <div className='flex w-full gap-2 p-6 mt-[18px] md:mt-1 md:p-0 justify-center'>
                  <img src={time24} role='presentation' alt='Time 24' />
                  <div className='text-xs md:text-sm text-black font-normal text-center text-opacity-50'>
                    Our loan officer will reach out to you in 24 hours
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}

            {!loadingBRE_Status && !isQualified ? (
              <h3 className='mx-4 text-center text-[22px] md:text-[32px] leading-8 md:leading-[48px]'>
                Thank you for choosing us.
                <br />
                We will get back to you!
              </h3>
            ) : (
              ''
            )}
          </div>
        </div>
      )}
      {values.loan_type !== 'LAP' && (
        <div
          className={`md:fixed top-1/4 left-2/4 md:-translate-x-2/4 md:-translate-y-2/4 flex-1 transition-colors ease-out duration-300 flex flex-col items-center z-50 ${loadingBRE_Status ? 'bg-[#FFF1CD]' : 'bg-[#EEF0DD]'
            } md:bg-opacity-0`}
        >
          {loadingBRE_Status ? (
            <>
              <div
                style={{
                  color: '#04584C',
                }}
                className='font-semibold text-lg md:text-2xl'
              >
                Verifying your details
              </div>
              <div className='text-primary-red font-medium text-[22px] md:text-[32px] mt-2'>
                {progress}%
              </div>
            </>
          ) : (
            ''
          )}

          {!loadingBRE_Status && isQualified ? (
            <div className='flex items-center flex-col'>
              <div
                style={{
                  color: '#231F20',
                }}
                className='text-[22px] md:text-[32px] font-medium'
              >
                Congratulations!
              </div>
              <div className='text-base text-black font-normal mt-1 md:mt-4 text-center'>
                You have a pre-approved loan of upto
              </div>
              <div
                style={{
                  color: '#277C5E',
                }}
                className='text-[32px] font-semibold mt-3 md:mt-4'
              >
                ₹ {currencyFormatter.format(allowedLoanAmount)}/-
                <sup className='text-[22px] font-medium text-primary-black mt-2'>*</sup>
              </div>
              <div className='flex w-full gap-2 p-6 mt-[18px] md:mt-1 md:p-0 justify-center'>
                <img src={time24} role='presentation' alt='Time 24' />
                <div className='text-xs md:text-sm text-black font-normal text-center text-opacity-50'>
                  Our loan officer will reach out to you in 24 hours
                </div>
              </div>
            </div>
          ) : (
            ''
          )}

          {!loadingBRE_Status && !isQualified ? (
            <h3 className='mx-4 text-center text-[22px] md:text-[32px] leading-8 md:leading-[48px]'>
              Thank you for choosing us.
              <br />
              We will get back to you!
            </h3>
          ) : (
            ''
          )}
        </div>
      )}

      {!loadingBRE_Status && isQualified ? (
        <div className='absolute z-50 w-full text-center bottom-4 text-xs text-light-grey md:text-dark-grey md:text-right md:text-sm md:bottom-5 md:right-14'>
          *Terms and Conditions applied
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default CongratulationBanner;

CongratulationBanner.propTypes = {
  setProcessingBRE: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  isQualified: PropTypes.bool,
  setIsQualified: PropTypes.func,
};
