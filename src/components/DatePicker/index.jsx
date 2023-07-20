import ReactDatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import DatePickerHeader from './DatePickerHeader';
import { useRef } from 'react';
import DatePickerInput from './DatePickerInput';

const DatePicker = ({ startDate, setStartDate, label, ...props }) => {
  const datePickerRef = useRef(null);

  return (
    <ReactDatePicker
      {...props}
      customInput={<DatePickerInput {...props} label={label} datepickerref={datePickerRef} />}
      ref={datePickerRef}
      className='bg-white z-50'
      // Close popper when date is selected
      shouldCloseOnSelect={true}
      closeOnScroll={false}
      selected={startDate}
      renderCustomHeader={(props) => <DatePickerHeader {...props} />}
      showYearDropdown
      showMonthDropdown
      calendarClassName='bg-white w-[328px] border border-light-grey border-opacity-20 px-5 shadow-calendar rounded-lg'
      dayClassName={(date) => {
        const defaultDateStyles =
          'font-normal h-8 w-8 rounded-full hover:rounded-full text-sm inline-flex items-center justify-center ';
        if (!startDate) {
          const today = new Date();
          if (date.getMonth() !== today.getMonth()) return defaultDateStyles + ' text-light-grey';
          if (date.toDateString() === today.toDateString())
            return (
              defaultDateStyles +
              ' bg-secondary-green text-neutral-white font-normal hover:bg-secondary-green'
            );
          else return defaultDateStyles + ' text-primary-black';
        }
        if (date.getMonth() !== startDate.getMonth()) return defaultDateStyles + ' text-light-grey';
        if (date.toDateString() === startDate.toDateString())
          return (
            defaultDateStyles +
            ' bg-secondary-green text-neutral-white font-normal hover:bg-secondary-green'
          );
        else return defaultDateStyles + ' text-primary-black';
      }}
      weekDayClassName={(_) => 'mx-1 text-light-grey font-semibold text-base mx-auto my-0'}
      onChange={(date) => setStartDate(date)}
      // maxDate={today}
      dateFormat='dd/MM/yyyy'
    >
      {/* Removed Apply button */}
      {/* <div className='w-full h-fit flex justify-end'>
        <button
          onClick={() => {
            setStartDate(datePickerRef.current.state.preSelection);
            datePickerRef.current.setOpen(false);
          }}
          className='px-4 py-2 bg-primary-red text-white font-semibold rounded-lg ml-auto'
          type='button'
          title='Apply'
        >
          Apply
        </button>
      </div> */}
    </ReactDatePicker>
  );
};

export default DatePicker;

DatePicker.propTypes = {
  startDate: PropTypes.object,
  setStartDate: PropTypes.func,
  label: PropTypes.string,
};
