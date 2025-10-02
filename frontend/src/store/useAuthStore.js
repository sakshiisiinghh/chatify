import axios from 'axios';
import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL=import.meta.env.MODE==="development"?'http://localhost:5001': "/api";

export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,
     checkAuth: async()=>{
     try{
  const res=await axiosInstance.get('/auth/check');
        set({authUser:res.data});
        get().connectSocket();
    }catch(error){
        console.log("Error checking auth:",error);
        set({authUser:null});
     }
     finally{
        set({isCheckingAuth:false});
     }
    },

    signup: async (data) => {
        console.log('signup called with', data);
        set({ isSigningUp: true });
        try {
            const payload = {
                name: data.fullName || data.name,
                fullName: data.fullName || data.name,
                email: data.email,
                password: data.password,
            };
            await axiosInstance.post('/auth/signup', payload);
            toast.success("Signup successful! Please log in.");
            return true;
            get().connectSocket();
        } catch (error) {
            // Log complete error for debugging
            console.error('Signup error:', {
              message: error.message,
              status: error.response?.status,
              data: error.response?.data,
              url: error.config?.url,
              baseURL: error.config?.baseURL,
            });
            const serverMessage = error.response?.data?.message;
            const status = error.response?.status;
            const msg = serverMessage
              ? `Signup failed (${status || 'error'}): ${serverMessage}`
              : error.request
              ? `Cannot reach server at ${error.config?.baseURL}. Is the backend running?`
              : 'Signup failed';
            toast.error(msg);
            return false;
        } finally {
            set({ isSigningUp: false });
        }
    },
     login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },
    logout : async() => {
        try{
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }
        catch(error){
            toast.error(error.response?.data?.message || 'Logout failed');
            console.log("Error during logout:", error); 
    }
},
     updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const {authUser} = get();
    if(!authUser) return;
    if(get().socket?.connected) return; // already connected
    const socket = io(BASE_URL,{
      query: { userId: authUser._id },
    });
    socket.connect();
    
    set({ socket:socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });


  },
  disconnectSocket: () => {
    if (get().socket) {
      get().socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  }
  
}));