import { post,del } from "../utils/apiHelper";

export function logUser(email,password){
      const body={
        email:email,
        password:password,

    }
    return post('/login',body)
  
}

export function registerUser(username,email, password,password_confirmation){
    const body={
        name:username,
        email:email,
        password:password,
        password_confirmation:password_confirmation

    }

    return post('/register',body);

}


/*reset pass */



export async function getEmail(email){
    const body ={
        email:email
    }
     
try {
    const res = await post('/forgot-password',body)
    return res.status
} catch (error) {
    console.log(error)
}
}


export async function SetNewPass(token,email, password,password_confirmation){
    const body = {
        token:token,
        email:email,
        password:password,
        password_confirmation:password_confirmation
    }

    try {
    const res = await post('/reset-password',body)
    return res.status
} catch (error) {
    console.log(error)
}
}

