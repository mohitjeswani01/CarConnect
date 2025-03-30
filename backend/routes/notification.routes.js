const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const notificationController = require("../controllers/notification.controller");

// Protect all routes
router.use(protect);

// User notification routes
router.get("/user/:userId", notificationController.getUserNotifications);
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/mark-all-read", notificationController.markAllAsRead);
router.get("/unread-count", notificationController.getUnreadCount);
router.delete("/:id", notificationController.deleteNotification);

// Admin only routes
router.post("/", authorize("admin"), notificationController.createNotification);
router.delete(
  "/cleanup",
  authorize("admin"),
  notificationController.cleanupOldNotifications
);

module.exports = router;
