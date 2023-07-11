import { useCallback, useContext, useEffect, useState } from 'react';
import { TextInput, Header, OtpInput, Button } from '../../components';
import { AuthContext } from '../../context/AuthContext';
import { getLeadById, sendMobileOTP, verifyMobileOtp } from '../../global';
import { useNavigate, useParams } from 'react-router-dom';
import otpVerifiedIcon from '../../assets/icons/otp-verified.svg';
import indiaShelterLogo from '../../assets/logo.svg';

const WelcomeBack = () => {
  const {
    values,
    handleBlur,
    handleChange,
    setFieldValue,
    inputDisabled,
    phoneNumberVerified,
    setPhoneNumberVerified,
    setCurrentLeadId,
    setInputDisabled,
    setIsLeadGenearted,
    setValues,
    setFieldError,
    setActiveStepIndex,
    setProcessingBRE,
    setIsQualified,
  } = useContext(AuthContext);

  let { id: leadId } = useParams();
  const navigate = useNavigate();
  const [showOTPInput, setShowOTPInput] = useState(true);

  useEffect(() => {
    setCurrentLeadId(leadId);
    setInputDisabled(true);
    getLeadById(leadId).then((res) => {
      if (res.status !== 200) return;
      setIsLeadGenearted(true);
      const data = {};
      Object.entries(res.data).forEach(([fieldName, fieldValue]) => {
        if (typeof fieldValue === 'number') {
          data[fieldName] = fieldValue.toString();
          return;
        }
        data[fieldName] = fieldValue || '';
      });
      setValues({ ...values, ...data });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValues, setCurrentLeadId, setInputDisabled, setIsLeadGenearted]);

  const onOTPSendClick = useCallback(() => {
    sendMobileOTP(values.phone_number, true).then((res) => {
      if (res.status === 500) {
        setFieldError('otp', res.data.message);
        return;
      }
      if ('OTPCredential' in window) {
        window.addEventListener('DOMContentLoaded', (_) => {
          const ac = new AbortController();
          navigator.credentials
            .get({
              otp: { transport: ['sms'] },
              signal: ac.signal,
            })
            .then((otp) => {
              console.log(otp.code);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      } else {
        console.error('WebOTP is not supported in this browser');
      }
    });
  }, [setFieldError, values.phone_number]);

  const verifyLeadOTP = useCallback(
    async (otp) => {
      try {
        const res = await verifyMobileOtp(values.phone_number, { otp });
        if (res.status === 200) {
          setPhoneNumberVerified(true);
          setInputDisabled(false);
          setFieldError('phone_number', undefined);
          setShowOTPInput(false);
          return true;
        }
        setPhoneNumberVerified(false);
        return false;
      } catch {
        setPhoneNumberVerified(false);
        return false;
      }
    },
    [setFieldError, setInputDisabled, setPhoneNumberVerified, values.phone_number],
  );

  const onResumeClick = useCallback(() => {
    if (values.is_submitted) {
      setProcessingBRE(true);
      setIsQualified(true);
      navigate('/');
      return;
    }

    const resumeJourneyIndex = values.extra_params.resume_journey_index;
    if (resumeJourneyIndex !== undefined) {
      setActiveStepIndex(parseInt(resumeJourneyIndex));
      navigate('/');
    }
  }, [
    navigate,
    setActiveStepIndex,
    setIsQualified,
    setProcessingBRE,
    values.extra_params.resume_journey_index,
    values.is_submitted,
  ]);

  return (
    <div
      style={{
        minHeight: '100dvh',
      }}
      className='flex  flex-col w-full relative transition-colors ease-out duration-300 bg-white isolate'
    >
      <img
        src='/welcome-bg.png'
        alt='Welcome'
        role='presentation'
        className='fixed bottom-0 left-0 right-0 hidden md:inline -z-10'
      />

      <div className='relative md:hidden border-b border-solid border-stroke'>
        <Header />
      </div>
      <div className='hidden md:block px-16 pt-10 pb-4 border-b border-solid border-stroke w-full'>
        <img style={{ maxWidth: 192 }} src={indiaShelterLogo} alt='India Shelter' />
      </div>

      <div
        style={{
          maxWidth: 534,
        }}
        className='p-4 md:pt-6 flex flex-col gap-1 md:self-center w-full'
      >
        <h2 className='text-primary-black text-xl md:text-[32px] font-semibold leading-8 md:leading-[48px]'>
          Welcome back!
        </h2>
        <p className='text-dark-grey text-xs md:text-sm leading-[18px] md:leading-[22px]'>
          To continue the journey, please verify your identity by entering the OTP sent to your
          mobile number.
        </p>
      </div>

      <div
        style={{
          maxWidth: 534,
        }}
        className='mt-4 md:mt-8 flex flex-col gap-2 md:gap-4 px-4 md:self-center w-full'
      >
        <TextInput
          label='Mobile number'
          placeholder='Please enter 10 digit mobile no'
          required
          name='phone_number'
          type='tel'
          value={values.phone_number}
          onBlur={handleBlur}
          pattern='\d*'
          onFocus={(e) =>
            e.target.addEventListener(
              'wheel',
              function (e) {
                e.preventDefault();
              },
              { passive: false },
            )
          }
          min='0'
          onInput={(e) => {
            if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
          }}
          onChange={(e) => {
            if (e.currentTarget.value < 0) {
              e.preventDefault();
              return;
            }
            if (values.phone_number.length >= 10) {
              return;
            }
            const value = e.currentTarget.value;
            if (value.charAt(0) === '0') {
              e.preventDefault();
              return;
            }
            setFieldValue('phone_number', value);
            //   handleOnPhoneNumberChange(e);
          }}
          onPaste={(e) => {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain').replace('');
            e.target.value = text;
            handleChange(e);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              setFieldValue(
                'phone_number',
                values.phone_number.slice(0, values.phone_number.length - 1),
              );
              e.preventDefault();
              return;
            }
          }}
          disabled={inputDisabled}
          inputClasses='hidearrow'
          message={
            phoneNumberVerified
              ? `OTP Verfied
            <img src="${otpVerifiedIcon}" alt='Otp Verified' role='presentation' />
            `
              : null
          }
        />

        {showOTPInput && (
          <OtpInput
            label='Enter OTP'
            required
            verified={phoneNumberVerified}
            setOTPVerified={setPhoneNumberVerified}
            onSendOTPClick={onOTPSendClick}
            defaultResendTime={30}
            disableSendOTP={!phoneNumberVerified}
            verifyOTPCB={verifyLeadOTP}
          />
        )}
      </div>

      <div
        style={{
          maxWidth: 534,
        }}
        className='w-full flex flex-1 md:flex-grow-0 flex-row gap-4 items-end px-4 pb-6 pt-14 justify-center md:self-center'
      >
        <div className='pointer-events-none flex-1'></div>
        <Button
          type='button'
          title='Resume'
          primary
          inputClasses='flex-1'
          disabled={!!showOTPInput}
          onClick={onResumeClick}
        >
          Resume
        </Button>
      </div>
    </div>
  );
};

export default WelcomeBack;
