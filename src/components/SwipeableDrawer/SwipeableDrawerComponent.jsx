import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { steps } from '../../pages/lead-generation/utils';
import { Suspense } from 'react';
import Loader from '../Loader';
import DesktopStepper from '../DesktopStepper';
import Stepper from '../Stepper';
import propTypes from 'prop-types';
import BottomSheetHandle from '../BottomSheetHandle';

const drawerBleeding = 300;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

export default function SwipeableDrawerComponent({ formContainerRef }, props) {
  const { drawerOpen, setDrawerOpen } = useContext(AuthContext);
  const { activeStepIndex } = useContext(AuthContext);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleWindowResize() {
      setInnerWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const onClick = useCallback(() => {
    setDrawerOpen(true);
  }, [setDrawerOpen]);

  const ActiveStepComponent = steps.find((_, index) => index === activeStepIndex)?.Component;

  const Form = useMemo(
    () => (
      <Suspense fallback={<Loader extraClasses='bg-transparent md:pr-[175px]' />}>
        <div className={innerWidth < 768 ? 'relative' : 'relative h-full'}>
          <DesktopStepper steps={steps} activeStep={activeStepIndex} />

          <div
            id='formStyledBox'
            ref={formContainerRef}
            role='presentation'
            onClick={onClick}
            onKeyDown={onClick}
            onTouchStart={onClick}
            className={`mt-2 md:mr-3 pb-24 md:pb-[260px] md:pr-[156px] px-1 no-scrollbar
              ${innerWidth < 768 ? '' : 'h-screen overflow-auto no-scrollbar'}`}
          >
            <ActiveStepComponent />
          </div>
        </div>
      </Suspense>
    ),
    [activeStepIndex, formContainerRef, innerWidth, onClick],
  );

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  if (innerWidth < 768) {
    return (
      <Root>
        <CssBaseline />
        <Global
          styles={{
            '.MuiDrawer-root > .MuiPaper-root': {
              height: `calc(90% - ${drawerBleeding}px)`,
              overflow: 'visible',
            },
          }}
        />

        <SwipeableDrawer
          anchor='bottom'
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          allowSwipeInChildren={true}
          disableSwipeToOpen={false}
          disableBackdropTransition
          ModalProps={{
            keepMounted: true,
          }}
        >
          <StyledBox
            sx={{
              position: 'relative',
              marginTop: `${-drawerBleeding}px`,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: 'visible',

              right: 0,
              left: 0,
            }}
          >
            <div className='pt-2 flex justify-center flex-col'>
              <BottomSheetHandle />
              <Stepper steps={steps} activeStep={activeStepIndex} />
            </div>
          </StyledBox>

          <StyledBox
            id='formStyledBox'
            sx={
              drawerOpen
                ? {
                    px: 2,
                    pb: 6,
                    overflow: 'auto',
                  }
                : {
                    px: 2,
                    pb: 6,
                  }
            }
            className='no-scrollbar'
          >
            {Form}
          </StyledBox>
        </SwipeableDrawer>
      </Root>
    );
  }
  return Form;
}

SwipeableDrawerComponent.propTypes = {
  formContainerRef: propTypes.object,
  window2: propTypes.object,
};
