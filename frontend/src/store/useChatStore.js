import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {useAuthStore} from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
 getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.response?.data?.message || "Failed to fetch messages");
      set({ messages: [] }); // Clear messages on error
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage : async(messageData) =>{
     try{
       const {selectedUser,messages}=get();
        if (!selectedUser) {
      toast.error("No user selected to send a message to.");
      return; 
    }
      const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
      set({messages:[...messages,res.data]});
     }catch(error)
     {
  const errorMessage = error.response?.data?.message || "Failed to send message.";
    toast.error(errorMessage);
     }
  },

  subscribeToNewMessages: () => {
   const { selectedUser, messages } = get();
   if (!selectedUser) return;
   const { socket } = useAuthStore.getState();
   if (!socket) return;
   socket.on("newMessage", (newMessage) => {
    if (newMessage.senderId !== selectedUser._id && newMessage.receiverId !== selectedUser._id) {
      // Message is not relevant to the current chat
      return;
    }
    set({
       messages: [...get().messages, newMessage] 
      });
  });
},
unsubscribeFromMessages: () => {
  const { socket } = useAuthStore.getState();
  if (!socket) return;
  socket.off("newMessage");
},
   setSelectedUser: (selectedUser) => set({ selectedUser }),

   deleteUser: async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      
      // Update the state by removing the deleted user
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
        // If the deleted user was selected, unselect them
        selectedUser: state.selectedUser?._id === userId ? null : state.selectedUser,
      }));

    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  },
}));