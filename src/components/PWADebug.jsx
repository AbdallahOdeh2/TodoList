import React, { useState, useEffect } from "react";
import { Box, Typography, Chip, Alert } from "@mui/material";
import pwaService from "../utils/pwaService";

const PWADebug = () => {
  const [pwaStatus, setPwaStatus] = useState({});

  useEffect(() => {
    const initializePWA = async () => {
      // Initialize PWA service
      await pwaService.init();

      // Get initial status
      const status = await pwaService.getPWAStatus();
      setPwaStatus(status);

      // Listen for PWA events
      const handlePWAInstallable = () => {
        setPwaStatus((prev) => ({
          ...prev,
          beforeInstallPromptSupported: true,
        }));
      };

      const handlePWAInstalled = () => {
        setPwaStatus((prev) => ({ ...prev, isInstalled: true }));
      };

      window.addEventListener("pwa-installable", handlePWAInstallable);
      window.addEventListener("pwa-installed", handlePWAInstalled);

      // Periodically check status (every 2 seconds for first 10 seconds)
      let checkCount = 0;
      const statusCheckInterval = setInterval(async () => {
        const currentStatus = await pwaService.getPWAStatus();
        setPwaStatus(currentStatus);
        checkCount++;

        if (checkCount >= 5) {
          clearInterval(statusCheckInterval);
        }
      }, 2000);

      return () => {
        window.removeEventListener("pwa-installable", handlePWAInstallable);
        window.removeEventListener("pwa-installed", handlePWAInstalled);
        clearInterval(statusCheckInterval);
      };
    };

    initializePWA();
  }, []);

  const getStatusColor = (condition) => {
    return condition ? "success" : "error";
  };

  const getStatusText = (condition) => {
    return condition ? "✅ Pass" : "❌ Fail";
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        left: 16,
        maxWidth: 300,
        zIndex: 1000,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: 2,
        borderRadius: 2,
        fontSize: "12px",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, color: "white" }}>
        PWA Debug
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Chip
          label={`Service Worker: ${getStatusText(
            pwaStatus.serviceWorkerSupported
          )}`}
          color={getStatusColor(pwaStatus.serviceWorkerSupported)}
          size="small"
        />
        <Chip
          label={`Notifications: ${getStatusText(
            pwaStatus.notificationsSupported
          )}`}
          color={getStatusColor(pwaStatus.notificationsSupported)}
          size="small"
        />
        <Chip
          label={`HTTPS: ${getStatusText(pwaStatus.isHTTPS)}`}
          color={getStatusColor(pwaStatus.isHTTPS)}
          size="small"
        />
        <Chip
          label={`Manifest: ${getStatusText(pwaStatus.manifestExists)}`}
          color={getStatusColor(pwaStatus.manifestExists)}
          size="small"
        />
        <Chip
          label={`SW Registered: ${getStatusText(pwaStatus.swRegistered)}`}
          color={getStatusColor(pwaStatus.swRegistered)}
          size="small"
        />
        <Chip
          label={`Install Prompt: ${getStatusText(
            pwaStatus.beforeInstallPromptSupported
          )}`}
          color={getStatusColor(pwaStatus.beforeInstallPromptSupported)}
          size="small"
        />
        <Chip
          label={`Installed: ${getStatusText(pwaStatus.isInstalled)}`}
          color={getStatusColor(pwaStatus.isInstalled)}
          size="small"
        />
      </Box>

      {!pwaStatus.isHTTPS && (
        <Alert severity="warning" sx={{ mt: 1, fontSize: "10px" }}>
          PWA requires HTTPS in production
        </Alert>
      )}
    </Box>
  );
};

export default PWADebug;
