"use client";

import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    await onSend(input);
    setInput("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-2 border-t rounded-b-lg">
      <input
        type="text"
        className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "..." : "Send"}
      </button>
    </form>
  );
}
