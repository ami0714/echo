import React,{useState} from 'react'
import { motion } from 'framer-motion';
import Sidebar from '../components/common/SideBar';
import {useNavigate} from 'react-router-dom'
import '../css/EditProfile.css'
import {updateProfile} from '../api/profile'
import {useAuth} from '../context/AuthContext'
import { Icon } from "@iconify/react";

const EditProfile = () => {
  const navigate = useNavigate()
    const {user} = useAuth()
    const BASEURL_STORAGE = import.meta.env.VITE_BASE_URL_STORAGE;
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [username, setUsername] = useState(user?.username);
    const handleImageChange = (event) => {
      const file = event.target.files?.[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));

      }
    }
  



    const handleSaveChanges = async () => {
       const formData = new FormData();

       if(imageFile){
        formData.append('image', imageFile);
       }
       
       formData.append('username', username);

       try {
        if(formData){
            const res = await updateProfile(formData);
            navigate('/userProfile')
            if(res.status == 'success'){
                console.log('Profile updated successfully:', res);
                
            }
        }else{
            console.log('No changes to save.');
        }
        
       } catch (error) {
        console.error('Error updating profile:', error);
       }



    }
  return (
    <div className="edit-profile-layout">
        <div className="sidebar-spacer"><Sidebar/></div>

      {/* Bahagian Tengah */}
      <motion.main 
        className="profile-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        
        <div className="edit-profile-container">
            <h1>Edit Profile</h1>
            <div className="edit">
                <section className='profile-box'>
                  <div className="profile-avatar">
               
                
                
                   <img src={imagePreview == null?`${BASEURL_STORAGE}${user?.profilePath}`:imagePreview } alt="Profile Avatar" />
                  
                </div>
                <input type="file" id='input-profile' className='input-profile' accept="image/*" onChange={handleImageChange} />
                <label htmlFor='input-profile' className='labelInput'>
                  <Icon className='edit-icon' icon="material-symbols:edit-outline"/>
                </label>
                </section>
                <section className="edit-profile-form">
                
                <div className="profile-info">
                <h2 className="profile-username">{user?.username == null?'name':user?.username}</h2>
                <p className="profile-email">Email: {user?.email == null?'email':user?.email}</p>
                </div>
                <form className="edit-profile-form">
                <label htmlFor="username">Username: </label>
                <input onChange={(e)=>setUsername(e.target.value)} type="text" className='input-username' defaultValue={user?.username == null?'name':user?.username} />

            </form>

                    </section>
                    
            </div>
            <button onClick={handleSaveChanges} className="save-btn">Save Changes</button>

           


        </div>
          

        
      
      

      </motion.main>



    </div>
  )
}

export default EditProfile