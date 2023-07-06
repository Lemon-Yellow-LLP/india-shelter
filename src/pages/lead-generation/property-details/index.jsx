import { useCallback, useState, useContext, createContext, useEffect } from 'react';
import { DropDown, TextInput, OtpInput } from '../../../components';
import { AuthContext } from '../../../context/AuthContext';
import { propertyIdentificationOptions, propertyDetailsMap } from '../utils';
import { editLeadById, getEmailOtp, updateLeadDataOnBlur, verifyEmailOtp } from '../../../global';
import otpVerified from '../../../assets/icons/otp-verified.svg';

export const PropertyDetailContext = createContext(null);

const PropertyDetail = () => {
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [emailOTPVerified, setEmailOTPVerified] = useState(null);
  const [disableEmailInput, setDisableEmailInput] = useState(false);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    selectedLoanType,
    setFieldError,
    hidePromoCode,
    currentLeadId,
    setDisableNextStep,
  } = useContext(AuthContext);

  const [propertyIdentified, setPropertyIdentified] = useState(values.property_identification);
  const [loanPurpose, setLoanPurpose] = useState(values.purpose_of_loan);
  const [propertyType, setPropertyType] = useState(values.purpose_of_loan);
  const [propertyCategory, setPropertyCategory] = useState(values.property_category);

  useEffect(() => {
    setPropertyIdentified(values.property_identification);
  }, [values.property_identification]);

  useEffect(() => {
    setLoanPurpose(values.purpose_of_loan);
  }, [values.purpose_of_loan]);

  useEffect(() => {
    setPropertyType(values.property_type);
  }, [values.property_type]);

  useEffect(() => {
    setDisableNextStep(true);
  }, [setDisableNextStep]);

  const handleLoanPursposeChange = useCallback(
    (value) => {
      setLoanPurpose(value);
      setFieldValue('purpose_of_loan', value);
      updateLeadDataOnBlur(currentLeadId, 'purpose_of_loan', value);
    },
    [currentLeadId, setFieldValue],
  );

  const handlePropertyType = useCallback(
    (value) => {
      setFieldValue('property_type', value);
      updateLeadDataOnBlur(currentLeadId, 'property_type', value);
    },
    [currentLeadId, setFieldValue],
  );

  const value = {
    propertyCategory,
    setPropertyCategory,
    propertyIdentified,
    setPropertyIdentified,
    showOTPInput,
    emailOTPVerified,
  };

  const { email } = values;

  useEffect(() => {
    if (selectedLoanType !== 'LAP') setFieldValue('purpose_type', '');
  }, [selectedLoanType, setFieldValue]);

  const handleOnEmailBlur = useCallback(
    async (email) => {
      await editLeadById(currentLeadId, { email });
    },
    [currentLeadId],
  );

  const sendEmailOTP = useCallback(async () => {
    setDisableEmailInput(true);
    const res = await getEmailOtp(email);
    if (res.status !== 200) {
      setFieldError('otp', res.data.message);
    }
  }, [email, setFieldError]);

  const verifyLeadEmailOTP = useCallback(
    async (otp) => {
      try {
        const res = await verifyEmailOtp(email, { otp });
        if (res.status === 200) {
          setEmailOTPVerified(true);
          setShowOTPInput(false);
          return true;
        }
        setEmailOTPVerified(false);
        return false;
      } catch {
        setEmailOTPVerified(false);
        return false;
      }
    },
    [email],
  );

  const checkEmailValid = useCallback(
    (e) => {
      if (e.currentTarget.value && !errors.email) {
        setDisableNextStep(true);
        setShowOTPInput(true);
      } else {
        setShowOTPInput(false);
      }
    },
    [errors.email, setDisableNextStep],
  );

  return (
    <PropertyDetailContext.Provider value={value}>
      <div className='flex flex-col gap-2'>
        {propertyDetailsMap[selectedLoanType || 'Home Loan'].fields}

        <span className='text-xl font-semibold text-primary-black'>Last thing, promise!</span>

        <DropDown
          label='Purpose of Loan'
          required
          placeholder='Eg: Purchase'
          options={propertyDetailsMap[selectedLoanType || 'Home Loan']['loanPurposeOptions']}
          onChange={handleLoanPursposeChange}
          defaultSelected={loanPurpose}
        />

        {propertyIdentificationOptions[0].value === propertyIdentified ||
        selectedLoanType === 'Loan Transfer' ? (
          <DropDown
            label='Property Type'
            required
            placeholder='Eg: Residential'
            options={
              propertyDetailsMap[selectedLoanType || 'Home Loan']['propertyTypeOptions'][
                loanPurpose
              ] || []
            }
            onChange={handlePropertyType}
            defaultSelected={propertyType}
            disabled={!loanPurpose}
          />
        ) : null}

        {hidePromoCode ? (
          ''
        ) : (
          <TextInput
            label='Promo Code'
            hint='To avail advantages or perks associated with a loan'
            placeholder='Eg: AH34bg'
            name='promo_code'
            value={values.promo_code}
            error={errors.promo_code}
            touched={touched.promo_code}
            onBlur={(e) => {
              const target = e.currentTarget;
              handleBlur(e);
              updateLeadDataOnBlur(currentLeadId, target.getAttribute('name'), target.value);
            }}
            onChange={handleChange}
          />
        )}

        <TextInput
          label='Enter your Email ID'
          type='email'
          value={email}
          placeholder='Please enter your Email ID'
          name='email'
          autoComplete='off'
          error={errors.email}
          touched={touched.email}
          onBlur={(e) => {
            const target = e.currentTarget;
            handleOnEmailBlur(target.value);
            handleBlur(e);
            checkEmailValid(e);
            updateLeadDataOnBlur(currentLeadId, target.getAttribute('name'), target.value);
          }}
          disabled={disableEmailInput}
          onInput={checkEmailValid}
          onChange={(e) => {
            checkEmailValid(e);
            handleChange(e);
          }}
          message={
            emailOTPVerified
              ? `OTP Verfied
          <img src="${otpVerified}" alt='Otp Verified' role='presentation' />
          `
              : null
          }
        />

        {showOTPInput ? (
          <OtpInput
            label='Enter OTP'
            required
            verified={emailOTPVerified}
            defaultResendTime={30}
            setOTPVerified={setEmailOTPVerified}
            disableSendOTP={true}
            onSendOTPClick={sendEmailOTP}
            verifyOTPCB={verifyLeadEmailOTP}
          />
        ) : null}
      </div>
    </PropertyDetailContext.Provider>
  );
};

export default PropertyDetail;
