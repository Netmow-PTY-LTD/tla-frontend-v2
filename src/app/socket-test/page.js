// 'use client'


// import { useNotifications, useResponseRoom } from "@/hooks/useSocketListener";
// import { useAuthUserInfoQuery } from "@/store/features/auth/authApiService";
// import { useState } from "react";

// export default function Dashboard() {
//     const {data:user}=useAuthUserInfoQuery()
//     console.log('user data ==>',user)
//   const userId = user?.data?._id;
//   console.log('user Id',userId)
//   const responseId = "xyz789"; // from lead/message context
//   const [messages, setMessages] = useState([]);

//   useNotifications(userId, (data) => {
//     console.log("🔔 New notification:", data);
//     alert(data.text);
//   });

//   useResponseRoom(responseId, (data) => {
//     console.log("💬 Update in response room:", data);
//     setMessages((prev) => [...prev, data]);
//   });

//   return <div>Listening for notifications and chat updates...</div>;
// }



'use client';
import { useNotifications, useResponseRoom } from "@/hooks/useSocketListener";
import { useAuthUserInfoQuery } from "@/store/features/auth/authApiService";
import { useState } from "react";

export default function Dashboard() {
  const { data: user, isLoading } = useAuthUserInfoQuery();
  const userId = user?.data?._id;
  const responseId = "xyz789";
  const [messages, setMessages] = useState([]);

  useNotifications(userId, (data) => {
    console.log("🔔 New notification:", data);
    alert(data.text);
  });

  useResponseRoom(responseId, (data) => {
    console.log("💬 Update in response room:", data);
    setMessages((prev) => [...prev, data]);
  }, userId);

  if (isLoading) return <div>Loading user...</div>;

  return <div>Listening for notifications and chat updates...</div>;
}
