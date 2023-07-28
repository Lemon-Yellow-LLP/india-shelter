import { AuthContext } from '../../context/AuthContext';
import FormButton from './FormButton';
import { useCallback, useContext, useRef } from 'react';
import AnimationBanner from './AnimationBanner';
import { addToSalesForce, editLeadById, verifyPan, checkCibil, checkBre100 } from '../../global';
import CongratulationBanner from './CongratulationBanner';
import { AnimatePresence, motion } from 'framer-motion';
import SwipeableDrawerComponent from '../../components/SwipeableDrawer/SwipeableDrawerComponent';
import { ToastMessage } from '../../components';

const LeadGeneration = () => {
  const formContainerRef = useRef(null);
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
    setToastMessage
  } = useContext(AuthContext);

  const onFormButtonClick = useCallback(() => {
    // modalRef.current?.snapTo(1);
    let myDiv = document.getElementById('formStyledBox');
    myDiv.scrollTop = 0;
    setDrawerOpen(false);
    formContainerRef.current?.scrollTo(0, 0);
  }, [setDrawerOpen]);

  const onSubmit = useCallback(
    (leadId, values) => {
      delete values.date_of_birth;

      editLeadById(leadId, values).then(async () => {
        let interval = 10;

        setProcessingBRE(true);
        setLoadingBRE_Status(true);

        setTimeout(() => {
          interval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 40) {
                clearInterval(interval);
                return 40;
              }
              return prev + 1;
            }, 1000);
          });
        }, 2000);

        if (allowCallPanAndCibil.allowCallPanRule) {
          try {
            await verifyPan(leadId);
          } catch (err) {
            console.error(err);
          }
        }

        if (allowCallPanAndCibil.allowCallCibilRule) {
          try {
            interval = setInterval(() => {
              setProgress((prev) => {
                if (prev >= 80) {
                  clearInterval(interval);
                  return 80;
                }
                return prev + 1;
              }, 1000);
            });
            await checkCibil(leadId);
          } catch (err) {
            console.error(err);
          }
        }

        interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 99) {
              clearInterval(interval);
              return 99;
            }
            return prev + 1;
          }, 2000);
        });

        try {
          const res = await checkBre100(leadId);
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

        await addToSalesForce(leadId).catch(() => {});
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transitionDuration: 2 }}
        exit={{ opacity: 0 }}
        className='flex w-full flex-col md:flex-row md:justify-between 2xl:justify-start h-screen md:gap-[111px] overflow-y-hidden'
      >
        <AnimationBanner />
        <div className='mt-[58px] lg:mt-0 relative overflow-hidden min-h-screen lg:min-h-fit lg:static'>
          <form
            onSubmit={(e) => e.preventDefault()}
            id='lead-form-container'
            className='w-full md:max-w-[732px]'
          >
            <div className='overflow-auto'>
              <SwipeableDrawerComponent formContainerRef={formContainerRef} />
            </div>
            <FormButton onButtonClickCB={onFormButtonClick} onSubmit={onSubmit} />
          </form>

          <ToastMessage 
            message={toastMessage}
            setMessage={setToastMessage}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadGeneration;
