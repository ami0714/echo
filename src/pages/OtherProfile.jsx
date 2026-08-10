import React, { useEffect,useState } from 'react';
import { motion } from 'framer-motion';
import '../css/otherProfile.css';
import { Icon } from "@iconify/react";
import Sidebar from '../components/common/SideBar';
import CommentSection from '../components/common/Comment';
import {useAuth} from '../context/AuthContext'
import {getPostById,likePost} from '../api/post'
import {getProfile,handleFollow} from '../api/profile'
import { useParams } from 'react-router-dom';


const OtherProfileUser = () => {
  const { id } = useParams(); // Dapatkan ID pengguna dari URL
  const [profileData, setProfileData] = useState([]); // State untuk menyimpan data profil pengguna
  const BASEURL_STORAGE = import.meta.env.VITE_BASE_URL_STORAGE;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile(id); // Panggil API untuk mendapatkan data profil pengguna berdasarkan ID
        // Lakukan sesuatu dengan profileData, seperti menyimpannya dalam state
        setProfileData(profileData);
        console.log(profileData);
      } catch (error) {
        console.error('Gagal memuatkan profil pengguna:', error);
      }
    };

    fetchProfile();
  }, [id]); // Jalankan useEffect setiap kali ID berubah
 
    const [isShowComment, setIsShowComment] =useState(false)
    const [postData,setPostData] = useState([]);
    console.log(postData)
    const [postId,setPostId] = useState(null);
  // SEO Optimization
  useEffect(() => {
    document.title = `Profil ${profileData.username} - EcHo`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = `Lihat profil ${profileData.username} di EcHo, termasuk followers, following, dan senarai post.`;
    }
  }, []);

       useEffect(() => {
           const fetchData = async () => {
             try {
               const posts = await getPostById('other',id); 
               setPostData(posts); // simpan array ke state
             
             } catch (error) {
               console.error('Gagal memuatkan posts:', error);
             }
           };
       
           fetchData();
         }, []);
       
         const commentAction = (id) => {
              try {
                //  setIsShowComment((prev) => !prev) 

                setPostId((prevId)=>{
                  if (prevId === id) return null;
                  // Jika klik pada post lain -> buka yang baru
                  return id;
                })
              } catch (error) {
                console.log(error)
              }

}

const likeAction = async (postId,isLike) => {

      setPostData(prev=> prev.map(post=> post.postId === postId ?
        { ...post, isLike: !post.isLike  } : post
      ))


      if(isLike){
        setPostData(prev=> prev.map(post=> post.postId === postId ?
        { ...post, likes: post.likes - 1  } : post
      ))

      }else if(!isLike){
        setPostData(prev=> prev.map(post=> post.postId === postId ?
        { ...post, likes: post.likes + 1  } : post
      ))
      }

      try {
        const res = await likePost(postId);
        console.log(res)
      } catch (error) {
        console.error('Gagal like post:', error);
        setPostData(prev=> prev.map(post=> post.postId === postId ?
        { ...post, isLike: !post.isLike  } : post
      ))
      }



  }

  const followAction = async () => {

      setProfileData(prev =>( {...prev, isFollow: !prev.isFollow  }))

      try {
        const res = await handleFollow(profileData.userId);
        console.log(res)
      } catch (error) {
        console.error('Gagal follow user:', error);
        setProfileData(prev => ({ ...prev, isFollow: !prev.isFollow }));
      }



  }

        


  
  
     

  return (
    <div className="profile-layout">
      {/* Ruang Kosong untuk Sidebar (kerana anda sudah ada komponen sidebar sendiri) */}
      <div className="sidebar-spacer"><Sidebar/></div>

      {/* Bahagian Tengah (Kandungan Profil) */}
      <motion.main 
        className="profile-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        
        {/* 1. Header Profil (Avatar, Stats, Button) */}
        <motion.section 
          className="profile-header-card"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="profile-avatar">
           {
              profileData.profilePath == null? <span>avatar</span>:<img src={`${BASEURL_STORAGE}${profileData.profilePath}`} />
            }
          </div>
          
          <div className="profile-info">
            <h1 className="profile-username">{profileData.username}</h1>
            <div className="profile-stats">
              <span>{profileData.followings} following</span>
              <span>{profileData.followers} follower</span>
            </div>
            <button onClick={followAction} style={{backgroundColor: profileData.isFollow == true? '#F0F2F5':'#5C4AD2',color: profileData.isFollow == true? '#5C4AD2':'white'}} className="follow-btn" aria-label="Follow User">
             {profileData.isFollow == true ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        </motion.section>

        {/* 2. Senarai Post (Looping Map dengan dummy data) */}
        <section className="profile-posts-container">
          {postData.map((post, index) => (
           <motion.article 
                       key={index} 
                       className="post-card"
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: index * 0.1 }}
                     >
                      
                       <header className="post-header">
                         <div className="post-avatar">
                           {
                              post.profilePath == null? <span>avatar</span>:<img src={`${BASEURL_STORAGE}${post.profilePath}`} />
                            } 
                         </div>
                         <span onClick={()=> navigateToProfile(post.userId)} className="post-username">{post.username}</span>
                       </header>
                       
                       <p className="post-content">
                         {post.content}
                       </p>
                        
                       <footer className="post-actions">
                  
                           <div className="action-btn" aria-label="Like post">
                           <Icon
                             onClick={() => likeAction(post.postId,post.isLike)}
                             style={{ color: post.isLike == true ? '#5C4AD2' : 'black' }}
                             className='icon'
                             icon="icon-park-twotone:like"
                           />
                           {post.likes}
                           </div>
                      
                         
                         <button
                           className="action-btn"
                           aria-label="Lihat komen"
                           onClick={() => commentAction(post.postId)}//prev ialah nilai sebelum
                         >
                           <svg viewBox="0 0 24 24">
                             <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                           </svg>
                           {post.comments}
                         </button>
                       </footer>
                     </motion.article>
          ))}
        </section>

      </motion.main>
      {/* 3. Comment Section Kanan (Hantar dummy comments sebagai props) */}
       {postId !== null && (
        <CommentSection setNull={(value)=> setPostId(value)} postId={postId} />
      )}
    </div>
  );
};

export default OtherProfileUser;