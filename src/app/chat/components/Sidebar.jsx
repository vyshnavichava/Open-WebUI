"use client";

export default function Sidebar({
  conversations,
  onSelect,
  selectedConv,
  setConversations,
  setSelectedConv,
  getToken,
}) {
  const handleNewChat = async () => {
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
      if (!res.ok) throw new Error("Failed to create conversation");
      const data = await res.json();

      if (!data.conversation?._id) {
        alert("Failed to create a new conversation");
        return;
      }

      setConversations((prev) => [data.conversation, ...prev]);
      setSelectedConv(data.conversation);
    } catch (err) {
      console.error("Failed to create conversation:", err);
      alert("Error creating conversation");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const token = await getToken();
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete conversation");

      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (selectedConv?._id === id) setSelectedConv(null);
    } catch (err) {
      console.error("Error deleting conversation:", err);
      alert("Failed to delete conversation");
    }
  };

  return (
    <div className="w-64 bg-gray-50 p-4 border-r space-y-3">
      <h2 className="font-bold text-lg mb-2">Conversations</h2>
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        onClick={handleNewChat}
      >
        + New Chat
      </button>

      <div className="mt-4 flex flex-col gap-2">
        {conversations.map((conv) => (
          <div
            key={conv._id}
            className={`flex justify-between items-center p-2 rounded-lg hover:bg-gray-200 ${
              selectedConv?._id === conv._id ? "bg-gray-200" : ""
            }`}
          >
            <button
              className="text-left flex-1"
              onClick={() => onSelect(conv)}
            >
              {conv.title || "Untitled"}
            </button>
            <button
              className="text-red-500 ml-2"
              onClick={() => handleDelete(conv._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
