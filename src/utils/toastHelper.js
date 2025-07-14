import { toast } from "react-hot-toast";

let lastMessage = null;

export const showToastOnce = (message) => {
  if (lastMessage === message) return;
  toast.error(message);
  lastMessage = message;
  setTimeout(() => (lastMessage = null), 2000);
};
