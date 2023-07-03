import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import otpVerified from '../../assets/icons/otp-verified.svg';
import otpNotVerified from '../../assets/icons/otp-not-verified.svg';

let currentOtpIndex = 0;
const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];

const OtpInput = ({
  label,
  required,
  verified,
  setOTPVerified,
  onSendOTPClick,
  disableSendOTP,
  verifyOTPCB,
  defaultResendTime,
}) => {
  const [otp, setOtp] = useState(new Array(5).fill(''));
  const [activeOtpIndex, setActiveOtpIndex] = useState(null);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [timer, setTimer] = useState(false);
  const [resendTime, setResendTime] = useState(defaultResendTime || 10);
  const [sentOnce, setSentOnce] = useState(false);

  const inputRef = useRef(null);

  const handleOnChange = useCallback(
    (e) => {
      const { value } = e.target;
      const newOTP = [...otp];
      newOTP[currentOtpIndex] = value.substring(value.length - 1);

      if (!value) setActiveOtpIndex(currentOtpIndex - 1);
      else setActiveOtpIndex(currentOtpIndex + 1);

      setOtp(newOTP);
      const otpAsString = newOTP.join('');
      if (otpAsString.length >= 5) {
        setInputDisabled(true);
        setActiveOtpIndex(null);
        verifyOTPCB(otpAsString).then((isVerifed) => {
          setInputDisabled(isVerifed);
        });
        setTimer(false);
      }
    },
    [otp, verifyOTPCB],
  );

  const handleOnOTPSend = useCallback(() => {
    setActiveOtpIndex(0);
    setInputDisabled(false);
    onSendOTPClick();
    setTimer(true);
  }, [onSendOTPClick]);

  useEffect(() => {
    let interval = null;
    if (timer) {
      setOTPVerified(null);
      let time = defaultResendTime || 10;
      interval = setInterval(() => {
        time -= 1;
        setResendTime(time);

        if (time <= 0) {
          clearInterval(interval);
          setTimer(false);
        }
      }, 1000);
    } else {
      clearInterval(interval);
      setTimer(false);
    }

    return () => {
      clearInterval(interval);
    };
  }, [verified, timer, setOTPVerified, defaultResendTime]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  const handleKeyDown = useCallback((e, index) => {
    currentOtpIndex = index;
    if (e.key === 'Backspace') setActiveOtpIndex(currentOtpIndex - 1);
    if (e.key === 'Enter') setActiveOtpIndex(currentOtpIndex + 1);
  }, []);

  const inputClasses = useMemo(() => {
    if (!sentOnce) return 'border-stroke';
    if (sentOnce && verified === null)
      return 'border-secondary-blue shadow-secondary-blue shadow-primary';
    if (!verified) return 'border-primary-red shadow-primary shadow-primary-red';
    if (verified) return 'border-dark-grey';
  }, [verified, sentOnce]);

  return (
    <div className='otp-container'>
      <h3 className='flex gap-0.5 text-primary-black'>
        {label}
        {required && <span className='text-primary-red text-sm'>*</span>}
      </h3>
      <div className='flex gap-2 mt-1'>
        {otp.map((_, index) => (
          <input
            autoComplete='one-time-code'
            disabled={inputDisabled}
            ref={index === activeOtpIndex ? inputRef : null}
            key={index}
            className={`
              w-full h-12 border bg-transparent outline-none text-center text-base font-normal text-primary-black transition spin-button-none rounded-lg hidearrow
              ${inputClasses}
            `}
            onChange={handleOnChange}
            onKeyDown={(e) => {
              if (DISALLOW_CHAR.includes(e.key)) {
                e.preventDefault();
                return;
              }
              handleKeyDown(e, index);
            }}
            value={otp[index]}
            pattern='\d*'
            onPaste={(e) => {
              e.preventDefault();
              const text = (e.originalEvent || e).clipboardData.getData('text/plain').split('');
              const copiedOTP = new Array(5).fill('').map((_, i) => text[i] || '');
              setOtp(copiedOTP);
              if (text.length === otp.length) {
                setActiveOtpIndex(null);
                verifyOTPCB(text.join(''));
              }
            }}
            type='number'
          />
        ))}
      </div>
      <div className='mt-3 flex justify-between items-center'>
        <div className='flex gap-0.5'>
          {verified === null && timer && (
            <span className='text-primary-red text-xs leading-[18px]'>0:{resendTime}s</span>
          )}
          {verified === true && !timer && (
            <span className='flex text-primary-black text-xs leading-[18px]'>
              OTP Verified
              <img src={otpVerified} alt='Otp Verified' role='presentation' />
            </span>
          )}
          {verified === false && (
            <span className='flex text-primary-black text-xs leading-[18px]'>
              OTP not verified
              <img src={otpNotVerified} alt='Otp Verified' role='presentation' />
            </span>
          )}
        </div>
        {!sentOnce && disableSendOTP && !timer ? (
          <button
            type='button'
            className='text-primary-red cursor-pointer font-semibold'
            onClick={() => {
              setSentOnce(true);
              handleOnOTPSend();
            }}
          >
            <span>Send OTP</span>
          </button>
        ) : (
          ''
        )}
        {sentOnce && disableSendOTP && !timer && verified !== true ? (
          <button
            type='button'
            className='text-primary-red cursor-pointer font-semibold'
            onClick={() => {
              setOtp(new Array(5).fill(''));
              handleOnOTPSend();
            }}
          >
            <span>Resend OTP</span>
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default OtpInput;

OtpInput.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  verified: PropTypes.any,
  setOTPVerified: PropTypes.func,
  onSendOTPClick: PropTypes.func,
  disableSendOTP: PropTypes.bool,
  verifyOTPCB: PropTypes.func,
  defaultResendTime: PropTypes.number,
};
