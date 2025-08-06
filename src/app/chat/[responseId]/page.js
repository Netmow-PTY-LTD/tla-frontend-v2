

import ChatBox from "../components/ChatBox";

export default async function ChatPage({ params }) {
  const responseId = params.responseId;

  // (Optional) Fetch response, validate permission, preload messages
  // const res = await fetch(`${process.env.API_URL}/api/responses/${responseId}`);
  // const response = await res.json();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Chat for Response: {responseId}</h2>
      <ChatBox responseId={responseId} />
    </div>
  );
}
















