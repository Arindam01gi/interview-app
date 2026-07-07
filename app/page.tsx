import { ChatProvider } from "@/context/ChatContext";
import ChatWindow from "@/components/chat/ChatWindow";

export default function Home() {
  return (
    <ChatProvider>
      <ChatWindow />
    </ChatProvider>
  );
}
