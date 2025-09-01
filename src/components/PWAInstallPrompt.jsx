import React, { useState, useEffect } from "react";
import { Snackbar, Alert, Button, Box, Typography } from "@mui/material";
import { GetApp as InstallIcon, Close as CloseIcon } from "@mui/icons-material";
import pwaService from "../utils/pwaService";

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isInstalled = pwaService.isInstalled;

    if (isInstalled) {
      return;
    }

    // Listen for PWA installable event
    const handlePWAInstallable = () => {
      setShowPrompt(true);
    };

    window.addEventListener("pwa-installable", handlePWAInstallable);

    return () => {
      window.removeEventListener("pwa-installable", handlePWAInstallable);
    };
  }, []);

  const handleInstall = async () => {
    try {
      const result = await pwaService.triggerInstall();

      if (result.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }

      setShowPrompt(false);
    } catch (error) {
      console.error("Error triggering install:", error);
      setShowPrompt(false);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Snackbar
      open={showPrompt}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{ mb: 8 }} // Above the notification FAB
    >
      <Alert
        severity="info"
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              color="inherit"
              size="small"
              onClick={handleInstall}
              startIcon={<InstallIcon />}
              sx={{
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 90%)",
                },
              }}
            >
              Install
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={handleClose}
              startIcon={<CloseIcon />}
            >
              Later
            </Button>
          </Box>
        }
        sx={{
          width: "100%",
          maxWidth: "400px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          "& .MuiAlert-icon": { color: "white" },
          "& .MuiAlert-message": { color: "white" },
        }}
      >
        <Typography variant="body2" sx={{ color: "white" }}>
          Install this app for a better experience!
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default PWAInstallPrompt;
