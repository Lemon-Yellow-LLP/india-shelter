import { forwardRef, useRef } from 'react';
import { IconCalendar } from '../../assets/icons';
import PropTypes from 'prop-types';

const DatePickerInput = forwardRef(function DatePickerInput({ name, ...props }, _ref) {
  const inputRef = useRef(null);
  return (
    <div className='flex flex-col gap-1'>
      <label htmlFor={name} className='flex gap-0.5 items-center text-primary-black w-fit'>
        {props.label}
        {true && <span className='text-primary-red text-sm'>*</span>}
      </label>
      <div className='input-container px-4 py-3 border justify-between border-stroke rounded-lg flex w-full items-center'>
        <input
          {...props}
          placeholder='DD/MM/YYYY'
          className='w-full'
          name={name}
          ref={inputRef}
          onInput={(e) => {
            let value = e.currentTarget.value;
            if (value.length >= 2 && value.charAt(2) !== '/') {
              value = value.slice(0, 2) + '/' + value.slice(2);
            }

            if (value.length >= 5 && value.charAt(5) !== '/') {
              value = value.slice(0, 5) + '/' + value.slice(5);
            }

            if (value.length >= 10) {
              value = value.slice(0, 10);

              const year = value.slice(6);
              const month = value.slice(0, 2);
              const day = value.slice(3, 5);

              value = month + '/' + day + '/' + year;
            }
            e.currentTarget.value = value;
          }}
          onKeyDown={(e) => {
            const value = e.currentTarget.value;
            if (e.key === 'Backspace') {
              if (value[value.length - 1] === '/') {
                e.currentTarget.value = value.slice(0, value.length - 1);
              }
            }
            if (e.key === 'Enter') {
              props.datepickerref.current.setOpen(false);
            }
          }}
        />
        <button
          type='button'
          title='Open Calendar'
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            props.datepickerref.current.setOpen(!props.datepickerref.current.state.open);
          }}
        >
          <IconCalendar />
        </button>
      </div>
    </div>
  );
});

export default DatePickerInput;

DatePickerInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.string,
  datepickerref: PropTypes.object,
};
