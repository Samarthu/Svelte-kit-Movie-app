<script>
import { goto } from '$app/navigation';
import { success_toast ,error_toast,warning_toast} from './../services/toasts.js';
import { userLogin, userLogout, userSignUp,getJWTFromLocalStorage} from './api/authencations.js'
import { onMount } from "svelte";
import { user } from '../stores/stores.js';
import { flip } from 'svelte/animate';
  import { get_movies ,get_movie,search_movie,get_genre} from '../services/movie_api_services.js';
    

let logInOption = true;
let email = '';
let password ='';
let confirmPassword ='';
let email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

onMount(async()=>{
 
    const token = getJWTFromLocalStorage();
    // check if already Login Then redirect to movies
    if(token){
        goto('movies')
    }else{
      goto('/')
    }
})
// Function that Check Basic Validations For Login/Singup Credentials
const validations = () =>{
    if(email.trim().length == 0){
        error_toast('Please Enter Email Address',2000);
        return false;
    }
    else if(!email.match(email_regex)){
        email = '';
        error_toast('Please Enter Proper Email Address',2000);
        return false;
    }
    else if(password.trim().length == 0){
        error_toast('Please Enter Password',2000);
        return false;
    }
    else if(!password.match(password_regex)){
        error_toast('Password Should be at least 8 Characters and Uppercase Character a Lowercase Character and a Number',2000);
        password = '';
        return false;
    }
    else if(password !== confirmPassword && logInOption == false) {
        confirmPassword = ''
        error_toast('Confirm Password and Password')
        return false;
    }
    return true;
}


// Function For Login 
const handleLogIn = async () =>{
    if(validations()){
    try{
        const response = await userLogin({ email, password });
        success_toast(response.message)
        user.set([{email,password,is_logged_in:true }])
        console.log($user)
        setTimeout(()=>goto('movies',{replaceState:false}))
    }
    catch(err){
        error_toast(err.message)
    }
}   
}

// Function For Signup 
const handleSignUp = async () =>{
    if(validations()){
        try{
            const response = await userSignUp({ email, password })
            if(response.status  == 'green')
            {
                success_toast(response.message)
                logInOption = true
            }
        }
        catch(err){
            error_toast(err.message)
        }
    }
}

const dummy = async () =>{

    const response = await fetch('/api/signup', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response)
}
</script>

<div class="container mx-auto mt-32 " style="height: calc(100vh - 134px);">
   {#if logInOption}
    <div class="flex justify-center">
      <div class="w-full md:w-96 p-6 bg-white rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-5 flex justify-center">Login</h2>
        <!-- Login form -->
        <form>
          <div class="mb-4">
            <label for="email" class="block text-gray-600">Email:</label>
            <input type="email" id="email" bind:value={email} class="w-full mt-1 p-2 border rounded-lg">
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-600">Password:</label>
            <input type="password" id="password" bind:value={password} class="w-full mt-1 p-2 border rounded-lg">
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded-lg" on:click={handleLogIn}>Login</button>
        </form>
        <p class="mt-4 text-gray-600">Don't have an account? </p><a on:click={()=>logInOption=false} class="text-blue-500">Sign up here</a>
      </div>
    </div>
   {:else}
    <div class="flex justify-center">
        <div class="w-full md:w-96 p-6 bg-white rounded-lg shadow">
          <h2 class="text-2xl font-semibold mb-5 flex justify-center">Signup</h2>
          <!-- Login form -->
          <form>
            <div class="mb-4">
              <label for="email" class="block text-gray-600">Email:</label>
              <input type="email" id="email" bind:value={email} class="w-full mt-1 p-2 border rounded-lg">
            </div>
            <div class="mb-4">
              <label for="password" class="block text-gray-600">Password:</label>
              <input type="password" id="password" bind:value={password} class="w-full mt-1 p-2 border rounded-lg">
            </div>
            <div class="mb-4">
                <label for="Confirm password" class="block text-gray-600">Confirm Password:</label>
                <input type="text" id="password"  bind:value={confirmPassword} class="w-full mt-1 p-2 border rounded-lg">
              </div>
            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded-lg" on:click={handleSignUp}>Sing Up</button>
          </form>
          <p class="mt-4 text-gray-600">Already have an account? </p><a on:click={()=>logInOption=true} class="text-blue-500">Login here</a>
        </div>
      </div>
      {/if}
</div>



  