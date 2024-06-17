import { NavLink, Link} from 'react-router-dom'
import logo from '../../Images/Logo.png'
import { useState} from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { resetState } from '../../redux/slices/userSlice';

function Navbar() {
  let {loginUserStatus,errorOccurred,errMsg,currentUser}=useSelector(state=>state.useruserLoginReducer)
  const [menuOpen, setMenuOpen] = useState(false);
  let navigate = useNavigate()
  let Dispatch=useDispatch();
  function Signout(){
    localStorage.removeItem('token')
    Dispatch(resetState())
    navigate('');
  }

  return (
    <nav className='mn shadow bg'>
      <div className='row'>
        <div className='col-5 d-flex align-items-center justify-content-center'>
          <Link to='' className='logo ms-2 '>
            <img src={logo} alt="logo" className='rounded'/>
          </Link>
        </div>
        <div className='col-6 d-flex align-items-center justify-content-center'>
          <h3 className='display-6 fs-2' style={{ color: 'white' }}><b>Feasto</b></h3>
        </div>
      </div>
      <div className='main2'>
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuOpen ? "open" : ''}>
          {loginUserStatus === false ? (
            <>
              <li>
                <NavLink to=''>Home</NavLink>
              </li>
              <li>
                <NavLink to='/explore'>Explore</NavLink>
              </li>
              <li>
                <NavLink to='/register'>Register</NavLink>
              </li>
              <li>
                <NavLink to='/login'>Login</NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to=''>Home</NavLink>
              </li>
              <li>
                <NavLink to='/explore'>Explore</NavLink>
              </li>
              <li>
                <NavLink to='/cart'>Cart</NavLink>
              </li>
              <li>
                <NavLink to='/userdashboard'>{currentUser.username.charAt(0).toUpperCase()+currentUser.username.slice(1)}</NavLink>
              </li>
              <li onClick={Signout}>
                <NavLink to=''>Signout</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );  
}

export default Navbar;