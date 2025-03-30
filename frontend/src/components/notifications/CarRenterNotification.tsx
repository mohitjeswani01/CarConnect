import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { notificationAPI } from "@/services/api";

interface NotificationProps {
  userId: string;
  onNotificationClick?: () => void;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  details?: any;
}

const CarRenterNotification: React.FC<NotificationProps> = ({
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
      const response = await notificationAPI.getUserNotifications(userId);
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
      await notificationAPI.markAsRead(notificationId);

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
    if (notification.type === "driver_accepted") {
      toast.success("Driver accepted your request", {
        description: `Driver has been assigned to your booking.`,
      });
    } else if (notification.type === "driver_rejected") {
      toast.info("Booking updated", {
        description: `Your car is booked without a driver.`,
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
                {notification.details && notification.details.carModel && (
                  <p className="text-sm mt-1">
                    Car: {notification.details.carModel}
                  </p>
                )}
                {notification.details && notification.details.driverName && (
                  <p className="text-sm mt-1">
                    Driver: {notification.details.driverName}
                  </p>
                )}
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

export default CarRenterNotification;
