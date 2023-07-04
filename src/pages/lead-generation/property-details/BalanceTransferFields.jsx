import { CurrencyInput, DropDown, TextInput } from '../../../components';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { IconRupee } from '../../../assets/icons';
import { loanTenureOptions } from '../utils';
import { updateLeadDataOnBlur } from '../../../global';
import { PropertyDetailContext } from '.';

const fieldsRequiredForSubmitting = [
  'banker_name',
  'loan_tenure',
  'loan_amount',
  'purpose_of_loan',
  'property_type',
];

const BalanceTransferFields = () => {
  const { showOTPInput, emailOTPVerified } = useContext(PropertyDetailContext);
  const { values, errors, touched, handleBlur, handleChange, setDisableNextStep, currentLeadId } =
    useContext(AuthContext);

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
        placeholder='Ex: Axis'
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
        <div className='grow'>
          <TextInput
            name='loan_tenure'
            placeholder='Ex: 10'
            label='Loan Tenure'
            required
            value={values.loan_tenure}
            displayError={false}
            onBlur={(e) => {
              const target = e.currentTarget;
              handleBlur(e);
              updateLeadDataOnBlur(currentLeadId, target.getAttribute('name'), target.value);
            }}
            onChange={handleChange}
            type='number'
            min='0'
            onInput={(e) => {
              if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
            }}
            inputClasses='hidearrow'
          />
        </div>
        <div className='mt-1 grow'>
          <DropDown
            options={loanTenureOptions}
            placeholder='Months'
            showError={false}
            showIcon={false}
          />
        </div>
      </div>

      <span className='text-xs text-primary-red'>
        {errors.loan_tenure && touched.loan_tenure ? errors.loan_tenure : String.fromCharCode(160)}
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

export default BalanceTransferFields;
