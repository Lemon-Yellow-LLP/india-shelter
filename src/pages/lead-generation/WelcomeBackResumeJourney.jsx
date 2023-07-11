import { useContext, useEffect, useState } from 'react';
import { TextInput } from '../../components';
import { AuthContext } from '../../context/AuthContext';
import { getLeadById } from '../../global';

const WelcomeBackResumeJourney = () => {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    inputDisabled,
    phoneNumberVerified,
    setCurrentLeadId,
    setInputDisabled,
    setIsLeadGenearted,
    setValidPancard,
  } = useContext(AuthContext);
 console.log(values);
  const [disablePhoneNumber, setDisablePhoneNumber] = useState(phoneNumberVerified);

  useEffect(() => {
    // setCurrentLeadId(_leadID);
    // setInputDisabled(true);
    // getLeadById(_leadID).then((res) => {
    //   if (res.status !== 200) return;
    //   setIsLeadGenearted(true);
    //   if (res.data.pan_number) { 
    //     setValidPancard(true);
    //   }
    //   const data = {};
    //   Object.entries(res.data).forEach(([fieldName, fieldValue]) => {
    //     if (typeof fieldValue === 'number') {
    //       data[fieldName] = fieldValue.toString();
    //       return;
    //     }
    //     data[fieldName] = fieldValue || '';
    //   });
    //   formik.setValues({ ...formik.values, ...data });
    // });
  }, []);

  return (
    <div>
      <TextInput
        label='Mobile number'
        placeholder='Please enter 10 digit mobile no'
        required
        name='phone_number'
        type='tel'
        // value={values.phone_number}
        // error={errors.phone_number}
        // touched={touched.phone_number}
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
          handleOnPhoneNumberChange(e);
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
          if (DISALLOW_CHAR.includes(e.key)) {
            e.preventDefault();
            return;
          }
        }}
        disabled={inputDisabled || disablePhoneNumber}
        inputClasses='hidearrow'
        message={
          phoneNumberVerified
            ? `OTP Verfied
          <img src="${otpVerified}" alt='Otp Verified' role='presentation' />
          `
            : null
        }
      />
    </div>
  );
};

export default WelcomeBackResumeJourney;
