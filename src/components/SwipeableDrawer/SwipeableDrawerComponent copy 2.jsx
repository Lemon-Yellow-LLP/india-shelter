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
import './SwipableDrawer.css';
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

const drawerBleeding = 200;

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

export default function SwipeableDrawerComponent({ formContainerRef, modalRef }) {
  // const { window } = props;
  const [open, setOpen] = useState(false);
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

  const ActiveStepComponent = steps.find((_, index) => index === activeStepIndex);

  const Form = useMemo(
    () => (
      <Suspense fallback={<Loader extraClasses='bg-transparent md:pr-[175px]' />}>
        <div className='relative h-full overflow-y-hidden'>
          <DesktopStepper steps={steps} activeStep={activeStepIndex} />

          <div
            ref={formContainerRef}
            role='presentation'
            onClick={onClick}
            onKeyDown={onClick}
            className='mt-6 md:mr-3 pb-[180px] md:pb-[260px] h-full overflow-auto md:pr-[156px] no-scrollbar px-1'
          >
            <ActiveStepComponent />
          </div>
        </div>
      </Suspense>
    ),
    [activeStepIndex, formContainerRef, onClick],
  );

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container = window !== undefined ? () => window().document.body : undefined;

  if (innerWidth < 768) {
    return (
      <Root>
        <CssBaseline />
        <Global
          styles={{
            '.MuiDrawer-root > .MuiPaper-root': {
              height: `calc(90% - ${drawerBleeding}px)`,
              overflow: 'visible', // tried to set to scroll and auto
            },
          }}
        />

        <SwipeableDrawer
          container={container}
          anchor='bottom'
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
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
            sx={{
              px: 2,
              pb: 6,
              // height: '100%',
              overflow: 'auto',
            }}
          >
            {/* {animals.map((animal) => {
            return <div>{animal}</div>;
          })} */}
            {Form}
          </StyledBox>
        </SwipeableDrawer>
      </Root>
    );
  }
  return Form;
}
