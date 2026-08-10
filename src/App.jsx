import { useState } from 'react'
import {BrowserRouter , Routes, Route} from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MainPage from './pages/MainPage';
import AuthContextProvider from './context/AuthContext';
import ProfileUser from './pages/profileUser'
import OtherProfileUser from './pages/OtherProfile'
import EditProfile from './pages/EditProfile';
import ResetPassPage from './pages/ResetPassPage';
import ResetPasswordPage from './pages/SetNewPass';
function App() {
 

  return (
    <AuthContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthPage/>} />
        <Route path='/reset' element={<ResetPassPage />} />
        <Route path='/password-reset/:token' element={<ResetPasswordPage />} />
        <Route path='/home' element={<MainPage/>} />
        <Route path='/userProfile' element={<ProfileUser />} />
        <Route path='/profile/:id' element={<OtherProfileUser />} />
        <Route path='/editProfile' element={<EditProfile />} />

      </Routes>
    </BrowserRouter>
    </AuthContextProvider>

  )
}

export default App
