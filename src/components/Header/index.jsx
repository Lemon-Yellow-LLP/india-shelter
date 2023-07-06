import indiaShelterLogo from '../../assets/logo.svg';

const Header = () => {
  return (
    <div className='px-4 py-4 bg-neutral-white w-full'>
      <img style={{ maxWidth: 100 }} src={indiaShelterLogo} alt='India Shelter' />
    </div>
  );
};

export default Header;
