import { useCallback, useContext } from 'react';
import { Button } from '../../components';
import { AuthContext, defaultValues } from '../../context/AuthContext';
import { steps } from './utils';
import PropTypes from 'prop-types';
import { checkBre99, checkDedupe, editLeadById, NaNorNull } from '../../global';

const FormButton = ({ onButtonClickCB, onSubmit }) => {
  const {
    errors,
    activeStepIndex,
    goToNextStep,
    goToPreviousStep,
    disableNextStep,
    currentLeadId,
    values,
    setAllowCallPanAndCibil,
  } = useContext(AuthContext);

  const handlePanAndBre99Call = useCallback(
    async (_e) => {
      // call dedupe
      await checkDedupe(currentLeadId);

      //call bre99
      try {
        const bre99Res = await checkBre99(currentLeadId);

        if (bre99Res.status !== 200) return;

        const bre99Data = bre99Res.data.bre_99_response.body;
        const allowCallPanRule = bre99Data.find((rule) => rule.Rule_Name === 'PAN');
        const allowCallCibilRule = bre99Data.find((rule) => rule.Rule_Name === 'Bureau');

        if (allowCallCibilRule.Rule_Value === 'YES') {
          setAllowCallPanAndCibil((prev) => ({ ...prev, allowCallCibilRule: true }));
        }
        if (allowCallPanRule.Rule_Value === 'YES') {
          setAllowCallPanAndCibil((prev) => ({ ...prev, allowCallPanRule: true }));
        }
      } catch (err) {
        console.log(err);
      }
    },
    [currentLeadId, errors.pan_number, setAllowCallPanAndCibil, values.pan_number],
  );

  const onNextButtonClick = useCallback(() => {
    const filteredValue = {
      loan_type: values.loan_type.toString(),
      loan_request_amount: parseFloat(values.loan_request_amount),
      middle_name: values.middle_name,
      last_name: values.last_name,
      gender: values.gender,
      extra_params: {
        resume_journey_index: activeStepIndex + 1,
      },
    };
    if (activeStepIndex === 0) {
      editLeadById(currentLeadId, filteredValue);
    } else {
      editLeadById(currentLeadId, {
        extra_params: {
          resume_journey_index: activeStepIndex + 1,
        },
      });
    }

    if (activeStepIndex === 1) {
      handlePanAndBre99Call();
    }

    goToNextStep();
    onButtonClickCB && onButtonClickCB();
  }, [
    values.loan_type,
    values.loan_request_amount,
    values.middle_name,
    values.last_name,
    activeStepIndex,
    goToNextStep,
    onButtonClickCB,
    currentLeadId,
  ]);

  const onPreviousButtonClick = useCallback(() => {
    goToPreviousStep();
    onButtonClickCB && onButtonClickCB();
  }, [goToPreviousStep, onButtonClickCB]);

  return (
    <div
      style={{
        height: 100,
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 45.31%)',
        position: 'fixed',
      }}
      className={`${
        activeStepIndex > 0 ? 'justify-between' : 'justify-end'
      } btn-bg absolute h-[128px] md:h-[166px] flex bottom-0 w-full md:pr-[175px] md:pl-1  md:w-[732px] items-end pb-4 px-4 md:px-0`}
    >
      <Button
        type='button'
        onClick={onPreviousButtonClick}
        inputClasses={`w-2/4 ${
          activeStepIndex === 0
            ? 'pointer-events-none opacity-0'
            : 'opacity-100 pointer-events-auto'
        }`}
      >
        Previous
      </Button>

      <Button
        disabled={disableNextStep}
        type={activeStepIndex === steps.length - 1 ? 'submit' : 'button'}
        primary
        inputClasses='ml-4 md:ml-6 w-2/4 self-end'
        onClick={
          activeStepIndex === steps.length - 1
            ? (e) => {
                e.preventDefault();
                const allowedKeys = Object.keys(defaultValues);
                const filteredValue = Object.keys(values)
                  .filter((key) => allowedKeys.includes(key))
                  .reduce((obj, key) => {
                    if (values[key]) obj[key] = values[key];
                    return obj;
                  }, {});
                filteredValue['pincode'] = NaNorNull(parseInt(filteredValue['pincode']));
                filteredValue['property_pincode'] = NaNorNull(
                  parseInt(filteredValue['property_pincode']),
                );
                filteredValue['loan_request_amount'] = NaNorNull(
                  parseInt(filteredValue['loan_request_amount']),
                );
                filteredValue['phone_number'] = filteredValue['phone_number']?.toString();
                filteredValue['ongoing_emi'] = NaNorNull(parseFloat(filteredValue['ongoing_emi']));
                filteredValue['Out_Of_Geographic_Limit'] =
                  filteredValue['Out_Of_Geographic_Limit'] || false;
                filteredValue['Total_Property_Value'] = NaNorNull(
                  parseInt(filteredValue['property_estimation']),
                );
                filteredValue['property_estimation'] = NaNorNull(
                  parseInt(filteredValue['property_estimation']),
                );
                filteredValue['extra_params'] = '';
                filteredValue['loan_amount'] = filteredValue['loan_amount']?.toString();
                filteredValue['loan_tenure'] = filteredValue['loan_tenure']?.toString();
                filteredValue['is_submitted'] = true;
                onSubmit(currentLeadId, filteredValue);
              }
            : onNextButtonClick
        }
      >
        {activeStepIndex === steps.length - 1 ? 'Submit' : 'Next'}
      </Button>
    </div>
  );
};

export default FormButton;

FormButton.propTypes = {
  onButtonClickCB: PropTypes.func,
  onSubmit: PropTypes.func,
};
