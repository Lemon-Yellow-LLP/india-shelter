import { lazy, useRef } from 'react';

const BackgroundAnimation = lazy(() => import('./BackgroundAnimation'));
const HomeLoanAnimation = lazy(() => import('./HomeLoanAnimation'));

export default function HomePageDesktopAnimation() {
  const lottiePlayerRef = useRef(null);
  return (
    <div>
      <BackgroundAnimation
        id='home-loan-bg-animation'
        className={`absolute bottom-0 left-0 w-full max-h-[80vh]`}
        loop
        play
      />
      <HomeLoanAnimation
        ref={lottiePlayerRef}
        id='home-loan-animation'
        className='md:absolute bottom-0 left-0 w-full max-h-[80vh]'
      />
    </div>
  );
}
