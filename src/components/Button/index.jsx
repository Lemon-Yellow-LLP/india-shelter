import PropTypes from 'prop-types';

const Button = ({ primary, children, inputClasses, ...props }) => {
  return (
    <button
      className={`p-2 md:py-3 text-base md:text-lg rounded md:w-64 ${inputClasses} ${
        primary
          ? 'bg-primary-red border border-primary-red text-white disabled:bg-light-red disabled:border-light-red'
          : 'bg-neutral-white border border-primary-red text-primary-red disabled:text-light-red'
      } transition-colors ease-out duration-300`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

Button.propTypes = {
  primary: PropTypes.bool,
  children: PropTypes.elementType,
};
