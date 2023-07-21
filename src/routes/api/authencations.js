
import { createToken, verifyToken} from "./jwtUtils"
const USERS_KEY = 'users';
const JWT_KEY = 'user_token';
const SECREAT_KEY = 'svelteapp'

const saveUsersToLocalStorage = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUsersFromLocalStorage = () => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return JSON.parse(usersJson) || [];
};

export const saveJWTToLocalStorage = (jwt) => {
  localStorage.setItem(JWT_KEY, jwt);
};

export const getJWTFromLocalStorage = () => {
  return localStorage.getItem(JWT_KEY) || null;
};

export const userRegister = (user) => {
  const users = getUsersFromLocalStorage();
  users.push(user);
  saveUsersToLocalStorage(users);
};

// API for User Login 

export const userLogin = ({email, password}) => {
  //getting user from local storage
  const users = getUsersFromLocalStorage();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    const jwt_t = createToken(user)
    console.log(jwt_t)
    saveJWTToLocalStorage(jwt_t);
    return Promise.resolve({status:'green', message: 'Sign up successful',token:jwt_t});
  }
  return Promise.reject({ status:'red', message: 'User Does Not Exists' });
};

export function userSignUp(userData) {
 
  // Check if the email already exists in localStorage
  const users = getUsersFromLocalStorage()
  const existingUser = users.find((user) => user.email === userData.email);

  if (existingUser) {
    return Promise.reject({ status:'red', message: 'Email already exists' });
  }
  
  // If the email doesn't exist, add the new user to localStorage
  userRegister(userData);
  return Promise.resolve({status:'green', message: 'Sign up successful' });

}

//function to logout

export const userLogout = () => {
  localStorage.removeItem(JWT_KEY);
};


  