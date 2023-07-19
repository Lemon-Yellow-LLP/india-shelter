import PropTypes from 'prop-types';

const Stepper = ({ steps, activeStep }) => {
  return (
    <div className='pt-5 pl-4 pr-4 flex md:hidden justify-between mt-2'>
      {steps.map(
        (step, index) =>
          activeStep === index && (
            <span className='text-primary-black text-xl leading-[30px] font-semibold' key={index}>
              {step.label}
            </span>
          ),
      )}
      <div>
        {steps.map(
          (step, index) =>
            activeStep === index && (
              <h4 className='text-xs text-right text-primary-black leading-[18px]' key={index}>
                <span className='font-semibold text-xs'>{activeStep + 1}</span>/{steps.length}
              </h4>
            ),
        )}
        <div className='flex gap-1'>
          {steps.map((_, index) => (
            <span
              key={index}
              className={`${index <= activeStep ? 'bg-primary-red' : 'bg-stroke'}
                h-1 w-2.5 rounded-[10px]`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stepper;

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object),
  activeStep: PropTypes.number,
};
