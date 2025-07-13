'use client'

const { useGetNotificationsQuery } = require("@/store/features/notification/notificationApiService");


export default function NotificationsPage() {
  const { data } = useGetNotificationsQuery({ read: 'any' });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Notifications</h2>
      <ul>
        {data?.data?.map(n => (
          <li key={n._id} className="mb-2 border p-3 rounded bg-white">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
              </div>
              {!n.isRead && <span className="text-xs text-red-500">New</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
