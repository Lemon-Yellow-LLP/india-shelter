import LeadGenerationForm from './LeadGenerationForm';
import { AuthContext } from '../../context/AuthContext';
import FormButton from './FormButton';
import { useCallback, useContext, useRef } from 'react';
import AnimationBanner from './AnimationBanner';
import { addToSalesForce, editLeadById, verifyPan, checkCibil } from '../../global';
import CongratulationBanner from './CongratulationBanner';
import { AnimatePresence, motion } from 'framer-motion';

const LeadGeneration = () => {
  const modalRef = useRef(null);
  const formContainerRef = useRef(null);
  const { processingBRE, setProcessingBRE, allowCallPanAndCibil } = useContext(AuthContext);

  const onFormButtonClick = useCallback(() => {
    modalRef.current?.snapTo(1);
    formContainerRef.current?.scrollTo(0, 0);
  }, []);

  const onSubmit = useCallback(
    async (leadId, values) => {
      editLeadById(leadId, values).then(() => setProcessingBRE(true));
      if (allowCallPanAndCibil.allowCallPanRule) {
        await verifyPan(leadId).catch(() => {});
      }
      if (allowCallPanAndCibil.allowCallCibilRule) {
        await checkCibil(leadId).catch(() => {});
      }
      await addToSalesForce(leadId).catch(() => {});
    },
    [allowCallPanAndCibil],
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
  );
};

export default LeadGeneration;
