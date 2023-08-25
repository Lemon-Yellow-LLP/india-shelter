import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { signUpSchema } from '../schemas/index';
import PropTypes from 'prop-types';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

export const defaultValues = {
  phone_number: '',
  loan_type: '',
  loan_request_amount: '500000',
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  pan_number: '',
  date_of_birth: '',
  profession: '',
  mode_of_salary: '',
  occupation: '',
  monthly_family_income: '',
  ongoing_emi: '',
  property_identification: '',
  property_estimation: '',
  purpose_of_loan: '',
  purpose_type: '',
  property_type: '',
  banker_name: '',
  loan_tenure: '',
  loan_amount: '',
  pincode: '',
  property_pincode: '',
  promo_code: '',
  email: '',
  Out_Of_Geographic_Limit: false,
  Total_Property_Value: '',
  extra_params: {},
  extra_1: null,
  extra_2: null,
  extra_3: null,
  extra_4: null,
  extra_5: null,
  extra_6: null,
  extra_7: null,
  extra_8: null,
  extra_9: null,
  extra_10: null,
  extra_11: null,
  extra_12: null,
  extra_13: null,
  extra_14: null,
  extra_15: null,
};

export const AuthContext = createContext(defaultValues);

const AuthContextProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [isLeadGenerated, setIsLeadGenearted] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [phoneNumberVerified, setPhoneNumberVerified] = useState(null);
  const [emailOTPVerified, setEmailOTPVerified] = useState(null);
  const [acceptedTermsAndCondition, setAcceptedTermsAndCondition] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);

  const formik = useFormik({
    initialValues: { ...defaultValues, promo_code: searchParams.get('promo_code') || '' },
    validationSchema: signUpSchema,
    onSubmit: (_, action) => {
      action.resetForm(defaultValues);
    },
  });

  const updateFieldsFromServerData = useCallback(
    (map) => {
      const data = {};
      Object.entries(map).forEach(([fieldName, fieldValue]) => {
        if (typeof fieldValue === 'number') {
          data[fieldName] = fieldValue.toString();
          return;
        }
        data[fieldName] = fieldValue || '';
      });
      formik.setValues({ ...formik.values, ...data });
    },
    [formik],
  );

  useEffect(() => {
    const _leadID = searchParams.get('li');
    if (!_leadID) return;
    navigate(`/${_leadID}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const terms_and_condition = searchParams.has('tc');
    if (terms_and_condition) {
      setShowTerms(true);
    }
  }, [searchParams]);

  const [processingBRE, setProcessingBRE] = useState(false);
  const [isQualified, setIsQualified] = useState(null);
  const [loadingBRE_Status, setLoadingBRE_Status] = useState(processingBRE);
  const [progress, setProgress] = useState(10);
  const [allowedLoanAmount, setAllowedLoanAmount] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const previousStepIndex = useRef(activeStepIndex);
  const [hidePromoCode, setHidePromoCode] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState(formik.values.loan_type);
  const [disableNextStep, setDisableNextStep] = useState(true);
  const [allowCallPanAndCibil, setAllowCallPanAndCibil] = useState({
    allowCallPanRule: false,
    allowCallCibilRule: false,
  });
  const [allowCallBre100, setAllowCallBre100] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setAllowedLoanAmount(formik.values?.bre_100_amount_offered || 0);
  }, [formik.values]);

  useEffect(() => {
    setSelectedLoanType(formik.values.loan_type);
  }, [formik.values.loan_type]);

  useEffect(() => {
    const promoCode = searchParams.get('promo_code');
    if (promoCode) {
      setHidePromoCode(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const utmParams = {};
    searchParams.forEach((value, key) => {
      if (key.includes('extra')) {
        utmParams[key] = value;
      }
    });
    formik.setValues((prev) => ({ ...prev, ...utmParams }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const goToPreviousStep = useCallback(() => {
    setActiveStepIndex((prev) => {
      previousStepIndex.current = prev;
      return prev - 1;
    });
  }, []);

  const goToNextStep = useCallback(() => {
    setActiveStepIndex((prev) => {
      previousStepIndex.current = prev;
      return prev + 1;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...formik,
        activeStepIndex,
        setActiveStepIndex,
        selectedLoanType,
        setSelectedLoanType,
        disableNextStep,
        setDisableNextStep,
        previousStepIndex,
        goToNextStep,
        goToPreviousStep,
        hidePromoCode,
        isLeadGenerated,
        setIsLeadGenearted,
        currentLeadId,
        setCurrentLeadId,
        inputDisabled,
        setInputDisabled,
        phoneNumberVerified,
        setPhoneNumberVerified,
        processingBRE,
        setProcessingBRE,
        isQualified,
        setIsQualified,
        loadingBRE_Status,
        setLoadingBRE_Status,
        acceptedTermsAndCondition,
        setAcceptedTermsAndCondition,
        updateFieldsFromServerData,
        allowCallPanAndCibil,
        setAllowCallPanAndCibil,
        showTerms,
        setShowTerms,
        progress,
        setProgress,
        allowedLoanAmount,
        setAllowedLoanAmount,
        drawerOpen,
        setDrawerOpen,
        setToastMessage,
        toastMessage,
        allowCallBre100,
        setAllowCallBre100,
        emailOTPVerified,
        setEmailOTPVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthContextLayout = () => {
  return (
    <AuthContextProvider>
      <Outlet />
    </AuthContextProvider>
  );
};

export default AuthContextLayout;

AuthContextProvider.propTypes = {
  children: PropTypes.element,
  setProcessingBRE: PropTypes.func,
  setIsQualified: PropTypes.func,
  isQualified: PropTypes.bool,
  loadingBRE_Status: PropTypes.bool,
  setLoadingBRE_Status: PropTypes.func,
};
