"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import Sidebar from "./components/Sidebar";

export default function ChatPage() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const token = await getToken();
        const res = await fetch("/api/chat", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    }
    fetchConversations();
  }, [getToken]);

  useEffect(() => {
    if (!selectedConv) {
      setMessages([]);
      return;
    }
    async function fetchMessages() {
      try {
        const token = await getToken();
        const res = await fetch(`/api/messages/${selectedConv._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }
    fetchMessages();
  }, [selectedConv, getToken]);

  const handleSend = async (content) => {
    let convId = selectedConv?._id;

    if (!convId) {
      try {
        const token = await getToken();
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: "New Conversation" }),
        });
        const data = await res.json();

        if (!data.conversation?._id) {
          alert("Failed to create conversation");
          return;
        }

        convId = data.conversation._id;
        setConversations((prev) => [data.conversation, ...prev]);
        setSelectedConv(data.conversation);
      } catch (err) {
        console.error("Error creating conversation:", err);
        alert("Error creating conversation");
        return;
      }
    }

    try {
      const token = await getToken();
      const res = await fetch(`/api/messages/${convId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: "user", content }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Error sending message");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        conversations={conversations}
        onSelect={setSelectedConv}
        selectedConv={selectedConv}
        setConversations={setConversations}
        setSelectedConv={setSelectedConv}
        getToken={getToken}
      />
      <div className="flex-1 flex flex-col p-4 gap-2">
        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
