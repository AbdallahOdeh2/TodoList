import React, { useState, useEffect } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import { GetApp as InstallIcon } from "@mui/icons-material";
import pwaService from "../utils/pwaService";

const PWAInstallButton = () => {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    // Check if app is already installed
    const isInstalled = pwaService.isInstalled;

    if (isInstalled) {
      return;
    }

    // Listen for PWA installable event
    const handlePWAInstallable = () => {
      setShowInstallButton(true);
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
        setAlertMessage("App installed successfully!");
        setShowInstallButton(false);
      } else {
        setAlertMessage("Installation was cancelled.");
      }
      setShowAlert(true);
    } catch (error) {
      setAlertMessage("Error installing app: " + error.message);
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  if (!showInstallButton) return null;

  return (
    <>
      <Button
        variant="contained"
        startIcon={<InstallIcon />}
        onClick={handleInstall}
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          color: "white",
          "&:hover": {
            background: "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 90%)",
          },
          zIndex: 1000,
        }}
      >
        Install App
      </Button>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertMessage.includes("Error") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PWAInstallButton;
