export default function Attachment({ attachment }) {
  return (
    <div className="p-2 border rounded-lg bg-gray-50">
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {attachment.filename || "File"}
      </a>
    </div>
  );
}
