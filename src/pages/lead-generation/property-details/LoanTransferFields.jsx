import { CurrencyInput, TextInput } from '../../../components';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { IconRupee } from '../../../assets/icons';
import { updateLeadDataOnBlur } from '../../../global';
import { PropertyDetailContext } from '.';

const fieldsRequiredForSubmitting = [
  'banker_name',
  'loan_tenure',
  'loan_amount',
  'purpose_of_loan',
  'property_type',
];

const LoanTransferFields = () => {
  const { showOTPInput, emailOTPVerified } = useContext(PropertyDetailContext);
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setDisableNextStep,
    currentLeadId,
    setFieldValue
  } = useContext(AuthContext);

  const [loanTenureError, setLoanTeureError] = useState('')

  const fileteredValueOnBlur = (e) => {
    const target = e.currentTarget;
    if(target.value && target.value > 30){
      setLoanTeureError('Loan Tenure should must be in between 1-30 year')
    }else{
      console.log(target.value);
      setLoanTeureError('');
      updateLeadDataOnBlur(currentLeadId, target.getAttribute('name'), target.value.toString());
    }
  }; 

  useEffect(() => {
    if (showOTPInput && emailOTPVerified) setDisableNextStep(false);
    let disableSubmit = fieldsRequiredForSubmitting.reduce((acc, field) => {
      const keys = Object.keys(errors);
      if (!keys.length) return acc && false;
      return acc && !Object.keys(errors).includes(field);
    }, true);
    setDisableNextStep(!disableSubmit);
  }, [emailOTPVerified, errors, setDisableNextStep, showOTPInput]);



  return (
    <div className='flex flex-col gap-2'>
      <TextInput
        name='banker_name'
        label='Banker Name'
        required
        placeholder='Eg: Axis'
        value={values.banker_name}
        error={errors.banker_name}
        touched={touched.banker_name}
        onBlur={(e) => {
          const target = e.currentTarget;
          handleBlur(e);
          updateLeadDataOnBlur(currentLeadId, target.getAttribute('name'), target.value);
        }}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const pattern = /^[A-Za-z ]+$/;
          if (pattern.exec(value[value.length - 1])) {
            handleChange(e);
          }
        }}
      />

      <div className='flex gap-2 items-end'>
        <div className='grow relative'>
          <TextInput
            name='loan_tenure'
            label='Loan Tenure'
            placeholder='Eg.10'
            required
            value={values.loan_tenure}
            displayError={false}
            onBlur={(e) => {
              handleBlur(e);
              fileteredValueOnBlur(e);
            }}
            onChange={(e) => {
              if (e.currentTarget.value < 0) {
                e.preventDefault();
                return;
              }
              if (values.loan_tenure.length >= 2) {
                return;
              }
              const value = e.currentTarget.value;
              setFieldValue('loan_tenure', value);
            }}
            type='number'
            min='0'
            onInput={(e) => {
              if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
            }}
            inputClasses='hidearrow'
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                setFieldValue(
                  'loan_tenure',
                  values.loan_tenure.slice(0, values.loan_tenure.length - 1),
                );
                e.preventDefault();
                return;
              }
            }}
          />
          <span className='absolute top-6 bottom-0 right-4 flex items-center text-base text-light-grey'>
            years
          </span>{' '}
        </div>
      </div>

      <span className='text-xs text-primary-red'>
        {loanTenureError && touched.loan_tenure ? loanTenureError : String.fromCharCode(160)}
      </span>

      <CurrencyInput
        name='loan_amount'
        label='Loan Amount'
        required
        pattern='\d*'
        Icon={IconRupee}
        placeholder='1,00,000'
        value={values.loan_amount}
        error={errors.loan_amount}
        touched={touched.loan_amount}
        onBlur={(e) => {
          const target = e.currentTarget;
          handleBlur(e);
          updateLeadDataOnBlur(currentLeadId, target.getAttribute('name'), target.value);
        }}
        onChange={handleChange}
        inputClasses='font-semibold'
      />
    </div>
  );
};

export default LoanTransferFields;
