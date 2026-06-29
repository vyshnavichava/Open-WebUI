import { useEffect, useRef } from "react";
import Message from "./Message";

export default function ChatWindow({ messages }) {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-3 bg-white rounded-lg shadow-inner"
    >
      {messages.map((msg) => (
        <Message key={msg._id} message={msg} />
      ))}
    </div>
  );
}
