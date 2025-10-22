import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ?"http://localhost:5001" : "/";

export const useAuthStore = create((set,get) => {
  // ----- ACTIONS -----
  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      console.log("✅ Auth checked:", res.data);
      get().connectSocket()
    } catch (error) {
      console.error("❌ Error in CheckAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  };

  const signup = async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
      get().connectSocket()
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Error in signup");
    } finally {
      set({ isSigningUp: false });
    }
  };

  const login = async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
      get().connectSocket()
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Error in login");
    } finally {
      set({ isLoggingIn: false });
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket()
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Error in logout");
    }
  };

  const updateProfile = async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated!");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error?.response?.data?.message || "Error updating profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  };

  const connectSocket = () => {
    const {authUser} = get() 
    if(!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL,{
      query: {userId: authUser._id}
    })
    socket.connect()
    set({socket})

    socket.on("online-users",(userId)=>{
      set({onlineUsers: userId})
    })
  }

  const disconnectSocket = () => {
    if(get().socket?.connected) {
      get().socket.disconnect()
    }
  }

  // ----- INITIAL STATE -----
  return {
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    checkAuth,
    signup,
    login,
    logout,
    updateProfile,
    connectSocket,
    disconnectSocket
  };
});
