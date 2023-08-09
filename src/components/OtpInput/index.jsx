import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import otpVerified from '../../assets/icons/otp-verified.svg';
import otpNotVerified from '../../assets/icons/otp-not-verified.svg';

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
  hasSentOTPOnce,
}) => {
  const [otp, setOtp] = useState('');
  const [activeOtpIndex, setActiveOtpIndex] = useState(null);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [timer, setTimer] = useState(hasSentOTPOnce);
  const [resendTime, setResendTime] = useState(defaultResendTime || 10);
  const inputRef = useRef(null);

  const handleOnChange = useCallback(
    (e) => {
      const { value } = e.target;
      setOtp(value);
      if (value.length >= 5) {
        setInputDisabled(true);
        verifyOTPCB(value).then((isVerifed) => {
          setInputDisabled(isVerifed);
        });
        setTimer(false);
      }
    },
    [otp, verifyOTPCB],
  );

  const handleOnOTPSend = useCallback(() => {
    setInputDisabled(false);
    onSendOTPClick();
    setTimer(true);
  }, [onSendOTPClick]);

  useEffect(() => {
    if (!hasSentOTPOnce) return;
    setActiveOtpIndex(0);
    setInputDisabled(false);
    setTimer(true);
  }, [hasSentOTPOnce]);

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
    inputRef.current?.focus({ preventScroll: true });
  }, [activeOtpIndex]);

  const inputClasses = useMemo(() => {
    if (!hasSentOTPOnce) return 'border-stroke';
    if (hasSentOTPOnce && verified === null)
      return 'border-secondary-blue shadow-secondary-blue shadow-primary';
    if (!verified) return 'border-primary-red shadow-primary shadow-primary-red';
    if (verified) return 'border-dark-grey';
  }, [verified, hasSentOTPOnce]);

  return (
    <div className='otp-container'>
      <h3 className='flex gap-0.5 text-primary-black'>
        {label}
        {required && <span className='text-primary-red text-sm'>*</span>}
      </h3>
      <div className='flex gap-2 mt-1'>
        <input
          type='number'
          autoComplete='one-time-code'
          disabled={inputDisabled}
          ref={inputRef}
          className={`
              w-full h-12 border bg-transparent outline-none px-4 text-base font-normal text-primary-black transition spin-button-none rounded-lg hidearrow
              ${inputClasses}
            `}
          onChange={handleOnChange}
          onKeyDown={(e) => {
            if (DISALLOW_CHAR.includes(e.key)) {
              e.preventDefault();
              return;
            }
          }}
          value={otp}
          pattern='\d*'
          min='0'
          onInput={(e) => {
            if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
          }}
          onPaste={(e) => {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain');
            console.log(text);
            setOtp(text);
            if (text.length >= 5) {
              verifyOTPCB(text);
            }
          }}
        />
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
        {hasSentOTPOnce && disableSendOTP && !timer && verified !== true ? (
          <button
            type='button'
            className='text-primary-red cursor-pointer font-semibold'
            onClick={() => {
              setOtp('');
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
