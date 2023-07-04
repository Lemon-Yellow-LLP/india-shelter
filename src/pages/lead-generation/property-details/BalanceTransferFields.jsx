import { CurrencyInput, DropDown, TextInput } from '../../../components';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { IconRupee } from '../../../assets/icons';
import { loanTenureOptions, loanTypeOptions } from '../utils';
import { updateLeadDataOnBlur } from '../../../global';
import { PropertyDetailContext } from '.';
import { useDebounce } from '../../../hooks';

const fieldsRequiredForSubmitting = [
  'banker_name',
  'loan_tenure',
  'loan_amount',
  'purpose_of_loan',
  'property_type',
];

const BalanceTransferFields = () => {
  const { showOTPInput, emailOTPVerified } = useContext(PropertyDetailContext);
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setDisableNextStep,
    currentLeadId,
    setFieldValue,
  } = useContext(AuthContext);

  const [selectedLoanTenure, setSelectedLoanTenure] = useState(loanTypeOptions[0].value);

  const deferredFilteredLoanTenure = useDebounce(values.loan_tenure, 5000);

  useEffect(() => {
    const fileteredValueOnBlur = () => {
      if (selectedLoanTenure === 'years') {
        if (deferredFilteredLoanTenure) {
          const filteredValue = deferredFilteredLoanTenure * 12;
          console.log(filteredValue.toString());
          updateLeadDataOnBlur(currentLeadId, 'loan_tenure', filteredValue.toString());
        }
      } else {
        console.log(typeof parseInt(deferredFilteredLoanTenure));
        if (deferredFilteredLoanTenure) {
          console.log('data sent');
          updateLeadDataOnBlur(currentLeadId, 'loan_tenure', deferredFilteredLoanTenure.toString());
        }
      }
    };
    fileteredValueOnBlur();
  }, [selectedLoanTenure, deferredFilteredLoanTenure]);

  useEffect(() => {
    if (showOTPInput && emailOTPVerified) setDisableNextStep(false);
    let disableSubmit = fieldsRequiredForSubmitting.reduce((acc, field) => {
      const keys = Object.keys(errors);
      if (!keys.length) return acc && false;
      return acc && !Object.keys(errors).includes(field);
    });
    setDisableNextStep(!disableSubmit);
  }, [emailOTPVerified, errors, setDisableNextStep, showOTPInput, loanTenureOptions]);

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
              handleBlur(e);
              // fileteredValueOnBlur(e);
              // updateLeadDataOnBlur(currentLeadId, target.getAttribute('name'), target.value);
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
        </div>
        <div className='mt-1 grow'>
          <DropDown
            options={loanTenureOptions}
            placeholder='Months'
            showError={false}
            showIcon={false}
            value={selectedLoanTenure}
            onChange={(value) => {
              setSelectedLoanTenure(value);
              console.log(value);
            }}
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
