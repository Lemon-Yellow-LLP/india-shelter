import LeadGenerationForm from './LeadGenerationForm';
import AuthContextProvider from '../../context/AuthContext';
import FormButton from './FormButton';
import { Suspense, useCallback, useRef, useState } from 'react';
import AnimationBanner from './AnimationBanner';
import { editLeadById } from '../../global';
import CongratulationBanner from './CongratulationBanner';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from '../../components/Loader';

const LeadGeneration = () => {
  const modalRef = useRef(null);
  const formContainerRef = useRef(null);
  const [processingBRE, setProcessingBRE] = useState(false);
  const [isQualified, setIsQualified] = useState(null);
  const [loadingBRE_Status, setLoadingBRE_Status] = useState(processingBRE);

  const onFormButtonClick = useCallback(() => {
    modalRef.current?.snapTo(1);
    formContainerRef.current?.scrollTo(0, 0);
  }, []);

  const onSubmit = useCallback(async (leadId, values) => {
    editLeadById(leadId, values).then(() => setProcessingBRE(true));
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <AuthContextProvider
        setProcessingBRE={setProcessingBRE}
        setIsQualified={setIsQualified}
        isQualified={isQualified}
        setLoadingBRE_Status={setLoadingBRE_Status}
        loadingBRE_Status={loadingBRE_Status}
      >
        {processingBRE ? (
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
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transitionDuration: 2 }}
              exit={{ opacity: 0 }}
              className='flex w-full flex-col md:flex-row md:justify-between 2xl:justify-start min-h-screen md:gap-[111px] overflow-y-hidden'
            >
              <AnimationBanner />
              <form
                onSubmit={(e) => e.preventDefault()}
                id='lead-form-container'
                className='w-full md:max-w-[732px]'
              >
                <div className='h-screen overflow-auto'>
                  <LeadGenerationForm modalRef={modalRef} formContainerRef={formContainerRef} />
                </div>
                <FormButton onButtonClickCB={onFormButtonClick} onSubmit={onSubmit} />
              </form>
            </motion.div>
          </AnimatePresence>
        )}
      </AuthContextProvider>
    </Suspense>
  );
};

export default LeadGeneration;
