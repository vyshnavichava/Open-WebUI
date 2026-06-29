import Attachment from "./Attachment";

export default function Message({ message }) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex flex-col gap-1 p-3 rounded-xl ${
        isUser ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
      } max-w-[75%]`}
    >
      {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}

      {message.attachments.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {message.attachments.map((att, idx) => (
            <Attachment key={idx} attachment={att} />
          ))}
        </div>
      )}
    </div>
  );
}
