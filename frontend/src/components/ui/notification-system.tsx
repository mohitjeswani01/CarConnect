import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  timestamp: Date;
}

interface NotificationSystemProps {
  userId: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Function to fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:5050/api/notifications/user/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();

        setNotifications(
          data.map((n: any) => ({
            id: n._id,
            message: n.message,
            type: n.type,
            read: n.read,
            timestamp: new Date(n.createdAt),
          }))
        );

        // Check if there are any unread notifications
        setHasUnread(data.some((n: any) => !n.read));

        // Show toast for new notifications
        const newNotifications = data.filter((n: any) => !n.read);
        if (newNotifications.length > 0) {
          toast.info(
            `You have ${newNotifications.length} new notification${
              newNotifications.length > 1 ? "s" : ""
            }`
          );
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Set up polling - check every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:5050/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Update local state
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      // Check if there are still unread notifications
      setHasUnread(notifications.some((n) => n.id !== id && !n.read));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`http://localhost:5050/api/notifications/mark-all-read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId }),
      });

      // Update local state
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setHasUnread(false);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <Bell size={20} />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 mt-2 w-80 z-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Notifications</h3>
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>

          <ScrollArea className="h-64">
            {notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 rounded-md text-sm ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() =>
                      !notification.read && handleMarkAsRead(notification.id)
                    }
                  >
                    <div className="flex justify-between">
                      <Badge
                        variant={!notification.read ? "default" : "outline"}
                        className="mb-1"
                      >
                        {notification.type === "booking_update"
                          ? "Booking"
                          : notification.type === "payment"
                          ? "Payment"
                          : "General"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </span>
                    </div>
                    <p>{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No notifications</p>
              </div>
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default NotificationSystem;
