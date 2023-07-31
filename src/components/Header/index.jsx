import indiaShelterLogo from '../../assets/logo.svg';

const Header = () => {
  return (
    <div className='px-4 py-4 bg-neutral-white w-full'>
      <img
        style={{ width: '100px', height: '24.64px' }}
        src={indiaShelterLogo}
        alt='India Shelter'
      />
    </div>
  );
};

export default Header;
