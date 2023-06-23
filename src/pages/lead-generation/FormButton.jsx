import { useCallback, useContext } from 'react';
import { Button } from '../../components';
import { AuthContext, defaultValues } from '../../context/AuthContext';
import { steps } from './utils';
import PropTypes from 'prop-types';
import { NaNorNull, editLeadById } from '../../global';

const FormButton = ({ onButtonClickCB, onSubmit }) => {
  const {
    activeStepIndex,
    goToNextStep,
    goToPreviousStep,
    disableNextStep,
    currentLeadId,
    values,
  } = useContext(AuthContext);

  const onNextButtonClick = useCallback(() => {
    const filteredValue = {
      loan_type: values.loan_type.toString(),
      loan_request_amount: parseFloat(values.loan_request_amount),
    };
    if (activeStepIndex === 0) {
      editLeadById(currentLeadId, filteredValue).then((res) => console.log(res));
    }
    goToNextStep();
    onButtonClickCB && onButtonClickCB();
  }, [
    values.loan_type,
    values.loan_request_amount,
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
        height: 127,
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 45.31%)',
      }}
      className={`${
        activeStepIndex > 0 ? 'justify-center' : 'justify-end'
      } btn-bg absolute h-[128px] md:h-[166px] flex gap-4 md:gap-6 bottom-0 w-full md:pr-[175px] md:pl-1  md:w-[732px] items-end pb-6 px-4 md:px-0`}
    >
      {activeStepIndex > 0 && (
        <Button type='button' onClick={onPreviousButtonClick}>
          Previous
        </Button>
      )}
      <Button
        // disabled={disableNextStep}
        type={activeStepIndex === steps.length - 1 ? 'submit' : 'button'}
        primary
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
                filteredValue['Out_Of_Geographic_Limit'] = false;
                filteredValue['Total_Property_Value'] = NaNorNull(
                  parseInt(filteredValue['property_estimation']),
                );
                filteredValue['property_estimation'] = NaNorNull(
                  parseInt(filteredValue['property_estimation']),
                );
                filteredValue['extra_params'] = '';
                filteredValue['loan_amount'] = filteredValue['loan_amount']?.toString();
                filteredValue['loan_tenure'] = filteredValue['loan_tenure']?.toString();
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
