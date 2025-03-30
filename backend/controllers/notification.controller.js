const Notification = require("../models/Notification");

// @desc    Get user notifications
// @route   GET /api/notifications/user/:userId
// @access  Private/User
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.params.userId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private/User
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Ensure user owns the notification
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this notification",
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private/User
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        user: req.user.id,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      count: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private/User
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private/User
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Ensure user owns the notification
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this notification",
      });
    }

    await notification.remove();

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create a notification (for admin or system use)
// @route   POST /api/notifications
// @access  Private/Admin
exports.createNotification = async (req, res) => {
  try {
    const { userId, type, message, details } = req.body;

    // Validate required fields
    if (!userId || !type || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId, type, and message",
      });
    }

    const notification = await Notification.create({
      user: userId,
      type,
      message,
      details: details || {},
    });

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete all read notifications older than 30 days
// @route   DELETE /api/notifications/cleanup
// @access  Private/Admin
exports.cleanupOldNotifications = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Notification.deleteMany({
      read: true,
      createdAt: { $lt: thirtyDaysAgo },
    });

    res.status(200).json({
      success: true,
      message: "Old notifications cleaned up",
      count: result.deletedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
