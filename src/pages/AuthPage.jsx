import React, { useEffect,useState } from 'react';
import { motion } from 'framer-motion';
import '../css/AuthPage.css';
import {useAuth} from '../context/AuthContext'
import {registerUser,logUser} from '../api/auth'
import {useNavigate} from 'react-router-dom'


// Komponen ini boleh digunakan untuk halaman 'login' atau 'register'
// Contoh guna: <AuthPage type="register" /> atau <AuthPage type="login" />
const AuthPage = () => {
  const {login, user} = useAuth()
    const [isRegister, setIsRegister] = useState(false)
    const [username,setUsername] = useState('');
    const [email, setEmail]= useState('');
    const [password,setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const [isSuccess,setIsSuccess] = useState(false)
    const [status,setStatus] = useState('')
    const navigate = useNavigate();
    const[shouldRedirect,setShouldRedirect] = useState(false)

    

    


  // Mengemaskini Title dan Meta Description untuk SEO
  useEffect(() => {
    const pageTitle = isRegister ? 'Register - EcHo' : 'Log In - EcHo';
    document.title = pageTitle;
    
    // Mengemaskini meta description secara manual (alternatif kepada react-helmet)
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = isRegister 
        ? 'Daftar akaun EcHo sekarang untuk mula berhubung dengan dunia.' 
        : 'Log masuk ke akaun EcHo anda untuk terus berhubung.';
    }
  }, [isRegister]);
 
 
  const inputs = isRegister 
    ? [
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'username', label: 'Username', type: 'text' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'passwordConfirmation', label: 'Password Confirmation', type: 'password' },
      ]
    : [
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
      ];

  const handleInputChange = (name, value) => {
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'passwordConfirmation':
        setPasswordConfirmation(value);
        break;
      default:
        break;
    }
  };

  // Animasi Framer Motion
  const leftSideAnim = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const rightSideAnim = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isRegister) {
      const res = await registerUser(username, email, password, passwordConfirmation);
      if(res.status == 'success'){
        setIsSuccess(true)
        setStatus('successfully registered!')
      }
    } else {
      const res = await logUser(email, password);
      if(res){
        login(res.token,res.user)
        setShouldRedirect(true)
      }
      
      
    }
  };

  useEffect(() => {
  if (shouldRedirect) {
    navigate('/home');
  }
}, [shouldRedirect, navigate]);


  return (
    <main className="auth-container">
      {/* --- Bahagian Kiri (Logo) --- */}

      {isSuccess && (
        <motion.section
        style={{color:isSuccess?'green':'red',backgroundColor:'white'}}
      initial={{x: -30}}
      animate={{x:0, transition: {duration:0.5},delay:0.2, ease: 'easeOut'}}
      
      className='message' >
        {status}
      </motion.section>
      )

      }
      <motion.section 
        className="auth-left" 
        initial="hidden" 
        animate="visible" 
        variants={leftSideAnim}
      >


        <h1 className="welcome-text">Welcome to</h1>
        <div className="logo-text">
          <span className="text-purple">E</span>
          <span className="text-black">c</span>
          <span className="text-purple">H</span>
          <span className="text-purple">o</span>
        </div>
      </motion.section>

      {/* --- Bahagian Kanan (Form) --- */}
      <motion.section 
        className="auth-right" 
        initial="hidden" 
        animate="visible" 
        variants={rightSideAnim}
      >
        <div className="auth-card">
          <h2 className="form-title">{isRegister ? 'Register' : 'log in'}</h2>
          
          <form className="auth-form" autoComplete="off" onSubmit={handleSubmit}>
            {inputs.map((input, index) => (
              <div className="form-group" key={index}>
                <input 
                  type={input.type}
                  value={
                    input.name === 'username' ? username :
                    input.name === 'email' ? email :
                    input.name === 'password' ? password :
                    input.name === 'passwordConfirmation' ? passwordConfirmation : ''
                  }
                  onChange={(e) => handleInputChange(input.name, e.target.value)}
                  placeholder={input.label} 
                  aria-label={input.label}
                />
              </div>
            ))}
            
            {/* Perhatikan: teks butang adalah 'Log In' seperti di gambar asal */}
            <button type="submit" className="submit-btn">
              {isRegister?'Register':'log in'}
            </button>
          </form>

          <p style={{cursor : 'pointer'}} onClick={()=> setIsRegister(isRegister? false:true) } className="footer-text">
            { !isRegister?'No Account?Register Now!':'log in now'}
          </p>
          {
            !isRegister && (
              <p style={{cursor : 'pointer'}} onClick={()=> navigate('/reset')}>
                Forgot Password
              </p>
            )
          }
        </div>
      </motion.section>
    </main>
  );
};

export default AuthPage;