import PropTypes from 'prop-types';

const CardRadio = ({ label, current, children, value, name, onChange, containerClasses }) => {
  return (
    <label
      htmlFor={value}
      className={`flex flex-col gap-2 w-full ${containerClasses} cursor-pointer`}
    >
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
      >
        <input
          type='radio'
          name={name}
          value={value}
          id={value}
          className='hidden'
          onChange={onChange}
        />
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
    </label>
  );
};

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
