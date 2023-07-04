import { Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Stepper from '../../components/Stepper/index';
import DesktopStepper from '../../components/DesktopStepper/index';
import { AuthContext } from '../../context/AuthContext';
import Sheet from 'react-modal-sheet';
import { BottomSheetHandle } from '../../components';
import { steps } from './utils';
import PropTypes from 'prop-types';
import Loader from '../../components/Loader';

const snapPoints = [0.92, 0.46];
const initialSnap = 1;

const LeadGenerationForm = ({ formContainerRef, modalRef }) => {
  const { activeStepIndex } = useContext(AuthContext);

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleWindowResize() {
      setInnerWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  });

  const onClick = useCallback(() => {
    modalRef.current?.snapTo(0);
  }, [modalRef]);

  const ActiveStepComponent = steps.find((_, index) => index === activeStepIndex).Component;

  const Form = useMemo(
    () => (
      <Suspense fallback={<Loader extraClasses="bg-opacity-0 md:pr-[175px]" />}>
        <div className='relative h-full overflow-y-hidden'>
          <DesktopStepper steps={steps} activeStep={activeStepIndex} />

          <div
            ref={formContainerRef}
            role='presentation'
            onClick={onClick}
            onKeyDown={onClick}
            className='mt-6 pb-[180px] md:pb-[260px] h-full overflow-auto md:pr-[175px] no-scrollbar px-1'
          >
            <ActiveStepComponent />
          </div>
        </div>
      </Suspense>
    ),
    [activeStepIndex, formContainerRef, onClick],
  );

  if (innerWidth < 768) {
    return (
      <Sheet
        isOpen={true}
        ref={modalRef}
        onClose={() => ({})}
        snapPoints={snapPoints}
        initialSnap={initialSnap}
        className='md:hidden'
        mountPoint={document.getElementById('#lead-form-container')}
      >
        <Sheet.Container>
          <Sheet.Header
            className='py-2 px-4 flex justify-center flex-col'
            onPanEnd={(e) => {
              if (window.innerHeight * 0.8 < e.y) {
                modalRef.current?.snapTo(1);
              }
            }}
          >
            <BottomSheetHandle />
            <Stepper steps={steps} activeStep={activeStepIndex} />
          </Sheet.Header>
          <Sheet.Content className='px-3 text-dark-grey leading-6 mb-4'>{Form}</Sheet.Content>
        </Sheet.Container>
      </Sheet>
    );
  }
  return Form;
};

export default LeadGenerationForm;

LeadGenerationForm.propTypes = {
  formContainerRef: PropTypes.object,
  modalRef: PropTypes.object,
};
