/* eslint-disable react/display-name */
import { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const PanInput = memo(
  ({ label, name, hint, error, touched, onChange, displayError = true, ...props }) => {
    const inputRef = useRef(null);
    const tempInputRef = useRef(null);
    const [inputType, setInputType] = useState('text');
    const [inputValue, setInputValue] = useState(props.value);

    useEffect(() => {
      if (inputValue.length >= 5 && inputValue.length < 9) {
        setInputType('number');
      } else {
        setInputType('text');
      }
    }, [inputValue]);

    const handleInput = (e) => {
      const value = e.currentTarget.value.toUpperCase();

      let pattern = /^[A-Za-z]/;
      if (inputType === 'number') {
        pattern = /^[0-9]+$/;
      }
      if (value.length < inputValue.length) {
        setInputValue(value);
        onChange(value);
      } else if (pattern.exec(value[value.length - 1])) {
        if (value.length <= 10) {
          setInputValue(value);
          onChange(value);
        }
      }
    };

    return (
      <div className='flex flex-col gap-1'>
        <label
          role='presentation'
          onClick={() => tempInputRef.current.focus()}
          htmlFor={name}
          className='flex gap-0.5 items-center text-primary-black'
        >
          {label}
          {props.required && <span className='text-primary-red text-sm'>*</span>}
        </label>

        {hint && (
          <span
            className='mb-1.5 text-light-grey text-sm font-normal'
            dangerouslySetInnerHTML={{
              __html: hint,
            }}
          />
        )}

        <input
          type='text'
          inputMode={inputType === 'number' ? 'numeric' : 'text'}
          value={inputValue}
          onChange={(e) => handleInput(e)}
          className={`input-container px-4 py-3 border rounded-lg
					inline-flex relative transition-all ease-out duration-150
					focus-within:border-secondary-blue focus-within:shadow-secondary-blue focus-within:shadow-primary hidearrow
					${error && touched ? 'border-primary-red shadow-primary shadow-primary-red' : 'border-light-grey'}
					${!props.value && !error && !touched && 'border-stroke'}
					${props.disabled ? 'bg-[#fafafa] pointer-events-none cursor-not-allowed' : ''}
					`}
          onBlur={props.onBlur}
          name='pan_number'
          ref={inputRef}
        />

        {displayError ? (
          <span
            className='text-xs text-primary-red'
            dangerouslySetInnerHTML={{
              __html: error && touched ? error : String.fromCharCode(160),
            }}
          />
        ) : (
          ''
        )}
      </div>
    );
  },
);

export default PanInput;

PanInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hint: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  touched: PropTypes.bool,
  Icon: PropTypes.elementType,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputClasses: PropTypes.string,
  displayError: PropTypes.bool,
  disabled: PropTypes.bool,
  message: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  processing: PropTypes.bool,
};
