import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { driverAPI } from "@/services/api";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  details?: any;
}

interface NotificationProps {
  userId: string;
  onNotificationClick?: () => void;
}

const DriverNotification: React.FC<NotificationProps> = ({
  userId,
  onNotificationClick,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await driverAPI.getNotifications();
      setNotifications(response.data.data);
      setHasUnread(response.data.data.some((n: Notification) => !n.read));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await driverAPI.markNotificationAsRead(notificationId);

      // Update local state
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );

      // Update unread status
      const stillHasUnread = notifications.some(
        (n) => n.id !== notificationId && !n.read
      );
      setHasUnread(stillHasUnread);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Different actions based on notification type
    if (notification.type === "new_ride_request") {
      toast.info("New ride request", {
        description: `Check the ride requests tab for details.`,
      });
    }

    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  // Poll for new notifications
  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {hasUnread && (
            <Badge
              className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"
              aria-label="New notifications"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="py-2 px-4 text-center">Loading...</div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`p-3 cursor-pointer ${
                !notification.read ? "bg-muted/50" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="w-full">
                <div className="flex justify-between items-start">
                  <p className="font-medium">{notification.message}</p>
                  {!notification.read && (
                    <Badge variant="default" className="ml-2">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="py-2 px-4 text-center">No notifications</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DriverNotification;
