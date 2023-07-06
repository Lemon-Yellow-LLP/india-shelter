import { useState, useContext, useEffect, useCallback } from 'react';
import CardRadio from '../../components/CardRadio';
import DropDown from '../../components/DropDown';
import IconSalaried from '../../assets/icons/salaried';
import IconSelfEmployed from '../../assets/icons/self-employed';
import { AuthContext } from '../../context/AuthContext';
import DatePicker from '../../components/DatePicker';
import { CurrencyInput, PanInput } from '../../components';
import {
  checkBre99,
  checkCibil,
  checkDedupe,
  editLeadById,
  isEighteenOrAbove,
  updateLeadDataOnBlur,
  verifyPan,
} from '../../global';
import { currencyToFloat } from '../../components/CurrencyInput';

const loanTypeData = [
  {
    label: 'Salaried',
    value: 'Cash Salaried',
    icon: <IconSalaried />,
    options: [
      {
        label: 'Bank Transfer',
        value: 'Bank Transfer Salaried',
      },
      {
        label: 'Cash',
        value: 'Cash Salaried',
      },
    ],
  },
  {
    label: 'Self employed',
    value: 'Self Employed',
    icon: <IconSelfEmployed />,
    options: [
      {
        label: 'Trading',
        value: 'Trading',
      },
      {
        label: 'Manufacturing',
        value: 'Manufacturing',
      },
      {
        label: 'Services',
        value: 'Services',
      },
      {
        label: 'Occupation 4',
        value: 'Occupation-4',
      },
    ],
  },
];

const professionData = {
  'Cash Salaried': (defaultValue, selectDropDownOption) => (
    <DropDown
      label='Mode of Salary'
      required
      options={loanTypeData[0].options}
      placeholder='Ex: Bank Transfer'
      onChange={selectDropDownOption}
      defaultSelected={defaultValue}
    />
  ),
  'Self Employed': (defaultValue, selectDropDownOption) => (
    <DropDown
      label='Occupation'
      required
      options={loanTypeData[1].options}
      placeholder='Ex: Purchase'
      onChange={selectDropDownOption}
      defaultSelected={defaultValue}
    />
  ),
};

const disableNextFields = [
  'pan_number',
  'date_of_birth',
  'profession',
  'mode_of_salary',
  'monthly_family_income',
  'ongoing_emi',
];

const ProfessinalDetail = () => {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    setFieldError,
    setDisableNextStep,
    currentLeadId,
    validPancard,
    setValidPancard,
    processingPanCard,
    setProcessingPanCard,
  } = useContext(AuthContext);
  const [date, setDate] = useState();
  const [selectedProfession, setSelectedProfession] = useState(null);

  useEffect(() => {
    setSelectedProfession(values.profession);
  }, [values.profession]);

  useEffect(() => {
    if (!values.date_of_birth) return;
    if (date) return;
    setDate(new Date(values.date_of_birth));
  }, [values.date_of_birth, date]);

  const onProfessionChange = useCallback(
    (e) => {
      const value = e.currentTarget.value;
      setSelectedProfession(value);
      setFieldValue('profession', value);
      setFieldValue('mode_of_salary', null);
      setFieldValue('occupation', null);
      updateLeadDataOnBlur(currentLeadId, 'profession', value);
    },
    [currentLeadId, setFieldValue],
  );

  useEffect(() => {
    let disableNext = disableNextFields.reduce((acc, field) => {
      const keys = Object.keys(errors);
      if (!keys.length) return acc && false;
      return acc && !keys.includes(field);
    }, !errors[disableNextFields[0]]);
    disableNext =
      disableNext &&
      validPancard &&
      (values.mode_of_salary || values.occupation) &&
      !processingPanCard;
    setDisableNextStep(!disableNext);
  }, [
    errors,
    processingPanCard,
    validPancard,
    setDisableNextStep,
    values.mode_of_salary,
    values.occupation,
  ]);

  useEffect(() => {
    if (!date) return;
    if (!isEighteenOrAbove(date)) {
      setFieldError('date_of_birth', 'To apply for loan the minimum age must be 18 or 18+');
      return;
    }
    setFieldValue('date_of_birth', date);
    updateLeadDataOnBlur(currentLeadId, 'date_of_birth', date);
  }, [currentLeadId, date, setFieldError, setFieldValue]);

  const handleOnProfessionChange = useCallback(
    (value) => {
      if (selectedProfession === 'Cash Salaried') {
        setFieldValue('mode_of_salary', value);
        setFieldValue('occupation', '');
        updateLeadDataOnBlur(currentLeadId, 'mode_of_salary', value);
        updateLeadDataOnBlur(currentLeadId, 'occupation', null);
      } else if (selectedProfession === 'Self Employed') {
        setFieldValue('occupation', value);
        setFieldValue('mode_of_salary', '');
        updateLeadDataOnBlur(currentLeadId, 'occupation', value);
        updateLeadDataOnBlur(currentLeadId, 'mode_of_salary', null);
      }
    },
    [currentLeadId, selectedProfession, setFieldValue],
  );

  const handleOnPanBlur = useCallback(
    async (_e) => {
      if (errors.pan_number) return;
      setProcessingPanCard(true);
      setValidPancard(false);

      const updatedPanCard = await editLeadById(currentLeadId, {
        pan_number: values.pan_number,
      });

      if (updatedPanCard?.status !== 200) {
        setProcessingPanCard(false);
        return;
      }

      //call dedupe
      await checkDedupe(currentLeadId);

      //call bre99
      const bre99Res = await checkBre99(currentLeadId);

      if (bre99Res.status !== 200) {
        setProcessingPanCard(false);
        return;
      }

      const bre99Data = bre99Res.data.bre_99_response.body;
      const allowCallPanRule = bre99Data.find((rule) => rule.Rule_Name === 'PAN');
      const allowCallCibilRule = bre99Data.find((rule) => rule.Rule_Name === 'Bureau');

      if (allowCallPanRule.Rule_Value === 'YES') {
        const res = await verifyPan(currentLeadId);

        if (res.status === 'Valid') {
          setValidPancard(true);
          setProcessingPanCard(false);
          return;
        }
        setFieldError('pan_number', 'Please enter your valid PAN number');
        setProcessingPanCard(false);
        setValidPancard(false);
      }
      if (allowCallCibilRule.Rule_Value === 'YES') {
        await checkCibil(currentLeadId);
      }
      setProcessingPanCard(false);
    },
    [currentLeadId, errors.pan_number, setFieldError, values.pan_number],
  );

  return (
    <div className='flex flex-col gap-2'>
      <PanInput
        label='PAN number'
        required
        name='pan_number'
        placeholder='ABCDE1234A'
        value={values.pan_number.toUpperCase()}
        error={errors.pan_number}
        touched={touched.pan_number}
        processing={processingPanCard}
        onBlur={(e) => {
          handleBlur(e);
          handleOnPanBlur(e);
        }}
        onChange={(value) => {
          setFieldValue('pan_number', value);
        }}
      />

      <DatePicker
        startDate={date}
        setStartDate={setDate}
        required
        name='date_of_birth'
        label='Date of Birth'
      />
      <span className='text-xs text-primary-red'>
        {errors.date_of_birth || touched.date_of_birth
          ? errors.date_of_birth
          : String.fromCharCode(160)}
      </span>

      <div>
        <label htmlFor='property-identication' className='flex gap-0.5 font-medium text-black'>
          Profession <span className='text-primary-red text-xs'>*</span>
        </label>
        <div className='flex justify-between gap-4 mt-2'>
          {loanTypeData.map((data, index) => {
            return (
              <CardRadio
                key={index}
                name='profession'
                label={data.label}
                onChange={onProfessionChange}
                current={selectedProfession}
                value={data.value}
              >
                {data.icon}
              </CardRadio>
            );
          })}
        </div>
        <span className='text-sm text-primary-red mt-1'>{false || String.fromCharCode(160)}</span>
      </div>

      {selectedProfession &&
        professionData[selectedProfession](
          values.mode_of_salary || values.occupation,
          handleOnProfessionChange,
        )}

      <CurrencyInput
        label='Monthly Family Income'
        hint='Total monthly earnings of all family members. <br /> This helps to improve your loan eligibility'
        required
        name='monthly_family_income'
        placeholder='Ex: 1,00,000'
        value={values.monthly_family_income}
        error={errors.monthly_family_income}
        touched={touched.monthly_family_income}
        onBlur={(e) => {
          const target = e.currentTarget;
          handleBlur(e);
          updateLeadDataOnBlur(
            currentLeadId,
            target.getAttribute('name'),
            currencyToFloat(target.value).toString(),
          );
        }}
        onChange={handleChange}
        inputClasses='font-semibold'
      />

      <CurrencyInput
        label='Ongoing EMI'
        hint='Mention all of the ongoing monthly payments'
        required
        name='ongoing_emi'
        placeholder='Ex: 10,000'
        value={values.ongoing_emi}
        error={errors.ongoing_emi}
        touched={touched.ongoing_emi}
        onBlur={(e) => {
          const target = e.currentTarget;
          handleBlur(e);
          updateLeadDataOnBlur(
            currentLeadId,
            target.getAttribute('name'),
            currencyToFloat(target.value),
          );
        }}
        onChange={handleChange}
        inputClasses='font-semibold'
      />
    </div>
  );
};

export default ProfessinalDetail;
