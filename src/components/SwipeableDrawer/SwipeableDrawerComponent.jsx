import * as React from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
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
import FormButton from '../../pages/lead-generation/FormButton';

const drawerBleeding = 320;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

export default function SwipeableDrawerComponent({ formContainerRef }, props) {
  const { drawerOpen, setDrawerOpen } = useContext(AuthContext);
  const { window2 } = props;
  // const [open, setOpen] = useState(false);
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
    setDrawerOpen(true);
  }, [drawerOpen]);

  const ActiveStepComponent = steps.find((_, index) => index === activeStepIndex)?.Component;

  const Form = useMemo(
    () => (
      <Suspense fallback={<Loader extraClasses='bg-transparent md:pr-[175px]' />}>
        <div className={innerWidth < 768 ? 'relative' : 'relative h-full'}>
          <DesktopStepper steps={steps} activeStep={activeStepIndex} />

          <div
            ref={formContainerRef}
            role='presentation'
            onClick={onClick}
            onKeyDown={onClick}
            onTouchStart={onClick}
            className={
              innerWidth < 768
                ? 'mt-6 md:mr-3 pb-[180px] md:pb-[260px] md:pr-[156px]  px-1 no-scrollbar'
                : 'mt-6 md:mr-3 pb-[180px] md:pb-[260px] md:pr-[156px]  px-1 h-screen overflow-auto no-scrollbar'
            }
          >
            <ActiveStepComponent />
          </div>
        </div>
      </Suspense>
    ),
    [activeStepIndex, formContainerRef, innerWidth],
  );

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  const container = window2 !== undefined ? () => window2().document.body : undefined;

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
          container={container}
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
            <Puller />
            {/* <Typography sx={{ p: 2, color: 'text.secondary' }}>Title</Typography> */}
            <Stepper steps={steps} activeStep={activeStepIndex} />
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
          >
            {Form}
          </StyledBox>
        </SwipeableDrawer>
      </Root>
    );
  }
  return Form;
}