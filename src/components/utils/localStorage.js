// Local storage utility for managing authentication token
export const setToken = (token) => {
    localStorage.setItem('authToken', token);
  };
  
  export const getToken = () => {
    return localStorage.getItem('authToken');
  };
  
  export const removeToken = () => {
    localStorage.removeItem('authToken');
  };
  
  export const isAuthenticated = () => {
    return !!getToken();
  };