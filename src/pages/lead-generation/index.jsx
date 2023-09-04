import { AuthContext } from '../../context/AuthContext';
import FormButton from './FormButton';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AnimationBanner from './AnimationBanner';
import { addToSalesForce, editLeadById, checkBre100 } from '../../global';
import CongratulationBanner from './CongratulationBanner';
import { AnimatePresence, motion } from 'framer-motion';
import SwipeableDrawerComponent from '../../components/SwipeableDrawer/SwipeableDrawerComponent';
import { ToastMessage } from '../../components';
import MetaPixel from '../../meta/MetaPixel';

let leadID = null;

const LeadGeneration = () => {
  const formContainerRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    processingBRE,
    setProcessingBRE,
    allowCallPanAndCibil,
    setProgress,
    setIsQualified,
    setLoadingBRE_Status,
    setAllowedLoanAmount,
    setDrawerOpen,
    toastMessage,
    setToastMessage,
    allowCallBre100,
  } = useContext(AuthContext);

  const onFormButtonClick = useCallback(() => {
    // modalRef.current?.snapTo(1);
    let myDiv = document.getElementById('formStyledBox');
    myDiv.scrollTop = 0;
    setDrawerOpen(false);
    formContainerRef.current?.scrollTo(0, 0);
  }, [setDrawerOpen]);

  const handleTestClick = () => {
    console.log('Test Button Clicked');
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '355833938473241');
    fbq('track', 'PageView');
  };

  const onSubmit = useCallback(
    (leadId, values) => {
      delete values.date_of_birth;
      setIsSubmitted(true);
      leadID = leadId;
      handleTestClick();
      editLeadById(leadId, values).then(async () => {
        let interval = 10;
        setProcessingBRE(true);
        setLoadingBRE_Status(true);
        setTimeout(() => {
          interval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 60) {
                clearInterval(interval);
                return 60;
              }
              return prev + 1;
            }, 500);
          });
        }, 500);
      });
    },
    [
      setProcessingBRE,
      setLoadingBRE_Status,
      allowCallPanAndCibil.allowCallPanRule,
      allowCallPanAndCibil.allowCallCibilRule,
      setProgress,
      setIsQualified,
      setAllowedLoanAmount,
    ],
  );

  useEffect(() => {
    isSubmitted &&
      allowCallBre100 &&
      setTimeout(async () => {
        try {
          if (!allowCallBre100) return;

          const res = await checkBre100(leadID);
          const breResponse = res.data.bre_100_response;

          if (breResponse.statusCode === 200) {
            setLoadingBRE_Status(false);
            setIsQualified(true);
            const offeredAmount = breResponse.body.find(
              (rule) => rule.Rule_Name === 'Amount_Offered',
            );
            if (offeredAmount.Rule_Value == 0) {
              throw new Error('Loan amount is 0');
            }
            setAllowedLoanAmount(offeredAmount.Rule_Value);
          } else {
            setIsQualified(false);
            setLoadingBRE_Status(false);
          }
          setLoadingBRE_Status(false);
        } catch (error) {
          setIsQualified(false);
          setLoadingBRE_Status(false);
        }

        await addToSalesForce(leadID).catch(() => {});
      }, 1000);
  }, [allowCallBre100, isSubmitted]);

  if (processingBRE) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transitionDuration: 2 }}
          exit={{ opacity: 0 }}
          className='w-full md:w-screen'
        >
          <CongratulationBanner />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <MetaPixel />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transitionDuration: 2 }}
        exit={{ opacity: 0 }}
        className='flex w-full flex-col md:flex-row md:justify-between 2xl:justify-start h-screen overflow-y-hidden  md:gap-[111px]'
      >
        <AnimationBanner />
        <div
          style={{ flex: '1 1 10%' }}
          className='mt-[58px] lg:mt-0 relative overflow-hidden lg:overflow-visible min-h-screen lg:min-h-fit lg:static '
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            id='lead-form-container'
            className='w-full relative'
          >
            <div className='overflow-auto'>
              <SwipeableDrawerComponent formContainerRef={formContainerRef} />
            </div>
            <FormButton onButtonClickCB={onFormButtonClick} onSubmit={onSubmit} />
            <ToastMessage message={toastMessage} setMessage={setToastMessage} />
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadGeneration;
