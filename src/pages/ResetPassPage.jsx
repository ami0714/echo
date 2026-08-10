import React,{useState} from 'react'
import '../css/ResetPassPage.css';
import {getEmail} from '../api/auth'

const ResetPassPage = () => {
 const [email,setEmail] = useState('')
 const [status,setStatus] = useState(null)
 const [loading,setLoading] = useState(false)


    const handleSubmit = async () =>{
        event.preventDefault();
        try {
        setLoading(true)
         const status = await getEmail(email)
          if(status){
            setStatus(status)
            setLoading(false)
          }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
  return (
    <div className='resetPassPage-layout'>
          {
            status !==null &&(
                  <section className='message' >
                {status}
            </section>
            )
          }
        <h1> Reset password with email</h1>


 <section className='reset-container' >

    <h2> Reset your EcHo password</h2>
 <form className="reset-form"  >
            
              <div className="form-reset" >
                <input 
                onChange={(e) => setEmail(e.target.value) }
                  type="email"
                  placeholder='email' 
                  aria-label='email'
                />
              </div>
         
            
      
            <button style={{cursor: loading?'not-allowed':'pointer'}} onClick={handleSubmit} className="submit-btn">
              reset
            </button>
          </form>
 </section>
    
   


    </div>
  )
}

export default ResetPassPage