import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Box,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Science as TestIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon,
} from "@mui/icons-material";
import notificationService from "../utils/notificationService";

const NotificationSettings = ({ open, onClose }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTestAlert, setShowTestAlert] = useState(false);
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    setIsEnabled(notificationService.isEnabled());
  }, [open]);

  const handlePermissionRequest = async () => {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermission();
      setIsEnabled(granted);
      if (granted) {
        setTestMessage("Notifications enabled successfully!");
        setShowTestAlert(true);
      } else {
        setTestMessage(
          "Permission denied. Please enable notifications in your browser settings."
        );
        setShowTestAlert(true);
      }
    } catch (error) {
      setTestMessage("Error requesting permission: " + error.message);
      setShowTestAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = () => {
    try {
      notificationService.showTestNotification();
      setTestMessage("Test notification sent! Check your notifications.");
      setShowTestAlert(true);
    } catch (error) {
      setTestMessage("Error sending test notification: " + error.message);
      setShowTestAlert(true);
    }
  };

  const getNotificationStatus = () => {
    if (!notificationService.isSupported) {
      return {
        color: "error",
        text: "Not Supported",
        icon: <NotificationsOffIcon />,
      };
    }

    if (notificationService.permission === "granted") {
      return { color: "success", text: "Enabled", icon: <NotificationsIcon /> };
    } else if (notificationService.permission === "denied") {
      return { color: "error", text: "Denied", icon: <NotificationsOffIcon /> };
    } else {
      return {
        color: "warning",
        text: "Not Requested",
        icon: <NotificationsOffIcon />,
      };
    }
  };

  const status = getNotificationStatus();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "16px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "white",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <NotificationsIcon />
        Notification Settings
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
            Notification Status
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Chip
              icon={status.icon}
              label={status.text}
              color={status.color}
              variant="filled"
              sx={{
                color: "white",
                "& .MuiChip-icon": { color: "white" },
              }}
            />
          </Box>

          {!notificationService.isSupported && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Notifications are not supported in this browser.
            </Alert>
          )}

          {notificationService.isSupported &&
            notificationService.permission !== "granted" && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Enable notifications to get reminders for your tasks.
              </Alert>
            )}
        </Box>

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
            Notification Features
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ScheduleIcon color="primary" />
              <Typography variant="body2" sx={{ color: "white" }}>
                Due date reminders (1 day before, 1 hour before, and on due
                date)
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PriorityIcon color="error" />
              <Typography variant="body2" sx={{ color: "white" }}>
                Priority-based notifications with enhanced alerts for high
                priority tasks
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TestIcon color="info" />
              <Typography variant="body2" sx={{ color: "white" }}>
                Test notifications to verify everything is working
              </Typography>
            </Box>
          </Box>
        </Box>

        {showTestAlert && (
          <Alert
            severity={testMessage.includes("Error") ? "error" : "success"}
            onClose={() => setShowTestAlert(false)}
            sx={{ mb: 2 }}
          >
            {testMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          gap: 1,
          borderTop: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {notificationService.isSupported &&
          notificationService.permission !== "granted" && (
            <Button
              variant="contained"
              onClick={handlePermissionRequest}
              disabled={isLoading}
              startIcon={<NotificationsIcon />}
              sx={{
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 90%)",
                },
              }}
            >
              {isLoading ? "Requesting..." : "Enable Notifications"}
            </Button>
          )}

        {isEnabled && (
          <Button
            variant="outlined"
            onClick={handleTestNotification}
            startIcon={<TestIcon />}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Test Notification
          </Button>
        )}

        <Button
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationSettings;
