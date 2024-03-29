/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import PropTypes from 'prop-types';
import { memo } from 'react';

const CardRadio = memo(({ label, current, children, value, onChange }) => {
  return (
    <div className={`flex flex-col gap-2 w-full cursor-pointer`}>
      <div
        className={`w-full border rounded-lg py-4 flex items-center justify-center cursor-pointer
        ${
          current === value
            ? 'bg-light-green border-secondary-green stroke-secondary-green'
            : 'bg-transparent stroke-light-grey border-stroke hover:bg-grey-white'
        } transition-all duration-300 ease-out`}
        tabIndex={0}
        role='radio'
        aria-checked={current === value}
        onClick={() => onChange(value)}
        onTouchStart={() => onChange(value)}
      >
        {children}
      </div>

      {label && (
        <div
          className={`text-center text-xs  leading-normal
        ${
          current === value
            ? 'text-secondary-green font-semibold'
            : 'text-primary-black font-normal'
        } transition-colors ease-out duration-300
        `}
        >
          {label}
        </div>
      )}
    </div>
  );
});

CardRadio.propTypes = {
  label: PropTypes.string,
  current: PropTypes.string,
  children: PropTypes.element,
  value: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  containerClasses: PropTypes.string,
};

export default CardRadio;
