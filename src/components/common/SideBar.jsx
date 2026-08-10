import React,{useEffect,useState} from 'react';
import { motion } from 'framer-motion';
import {useAuth} from '../../context/AuthContext'
import {useLocation, useNavigate} from 'react-router-dom';
import { Icon } from "@iconify/react";


const Sidebar =  ({postType}) => {
   const {user,logout,loading} = useAuth()
    const navigate = useNavigate();
    const BASEURL_STORAGE = import.meta.env.VITE_BASE_URL_STORAGE;
    const location = useLocation();
    const [activeNav, setActiveNav] = useState(() => {
      if (location.pathname === '/userProfile') return 'profile';
      if (location.pathname === '/home') return 'home';
      return 'home';
    });

    useEffect(() => {
      if (location.pathname === '/userProfile') {
        setActiveNav('profile');
      } else if (location.pathname === '/home') {
        setActiveNav('home');
      }
    }, [location.pathname]);

    
   

 

  


   

    const handlelogOut = async () => {
      const token = localStorage.getItem('token');
      

      if(token){
        
        logout();
        navigate('/')

        
      }
      
    }

    const handleNaigate = (path)=>{
      setActiveNav(path);

      if(path === 'home'){
        navigate('/home')
        postType('global')
      }else if(path === 'following'){
        navigate('/home')
        postType('following') 
      }else if(path === 'profile'){
        navigate('/userProfile')
      }
    }

  return (
    <motion.aside 
      className="sidebar"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
        <header className='Side-bar-header'>
             <h1 className="logo-text-sidebar">EcHo</h1> 
           <div className='profileHeader' >
             <p>{loading?'please log in':user?.username || user?.name}</p>
            <div className="sidebar-avatar">
                {
              user?.profilePath == null? <span>avatar</span>:<img src={`${BASEURL_STORAGE}${user?.profilePath}`} />
            }
              </div>
           </div>
        </header>
     
      
      <nav className="sidebar-nav" aria-label="Sidebar Navigation">
        <a onClick={() =>handleNaigate('home')} className={`sidebar-link ${activeNav === 'home' ? 'active' : ''}`} aria-label="Home">
          {/* Home Icon SVG */}
          <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </a>
        
        <a onClick={() =>  handleNaigate('following') } className={`sidebar-link ${activeNav === 'following' ? 'active' : ''}`} aria-label="Following">
          {/* Following Icon SVG */}
          <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
          Following
        </a>
        
        <a onClick={()=>handleNaigate('profile')} className={`sidebar-link ${activeNav === 'profile' ? 'active' : ''}`} aria-label="Profile">
          {/* Profile Icon SVG */}
          <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Profile
        </a>
      </nav>



      <Icon onClick={ handlelogOut } className='logout' icon="basil:logout-solid" />
    </motion.aside>
  );
};

export default Sidebar;