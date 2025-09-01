import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ConfirmationDialog({
  confirmOpen,
  closeConfirm,
  pendingAction,
  getDialogStyles,
}) {
  return (
    <Dialog
      open={confirmOpen}
      onClose={closeConfirm}
      PaperProps={{
        sx: {
          borderRadius: 5,
          background: pendingAction
            ? getDialogStyles(pendingAction.type).bg
            : undefined,
          boxShadow:
            getDialogStyles(pendingAction?.type)?.dialogShadow ||
            "0 2px 10px rgba(0,0,0,0.15)",
          backdropFilter: "blur(12px)",
          minWidth: 340,
          maxWidth: 420,
          mx: 2,
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(30,41,59,0.55)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: pendingAction
            ? getDialogStyles(pendingAction.type).color
            : undefined,
          fontWeight: 700,
          fontSize: 24,
          textAlign: "center",
          fontFamily: "monospace",
        }}
      >
        {pendingAction ? getDialogStyles(pendingAction.type).title : "Confirm"}
      </DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            color: pendingAction
              ? getDialogStyles(pendingAction.type).textColor
              : "#000",
            fontSize: 18,
            textAlign: "center",
            mb: 2,
            fontWeight: 500,
            fontFamily: "monospace",
          }}
        >
          {pendingAction
            ? getDialogStyles(pendingAction.type).message
            : "Are you sure?"}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={closeConfirm}
          sx={{
            borderRadius: 2,
            fontFamily: "monospace",
            textTransform: "none",
            px: 3,
            fontWeight: 800,
            background: pendingAction
              ? getDialogStyles(pendingAction.type).buttonCancel
              : undefined,
            color: pendingAction
              ? getDialogStyles(pendingAction.type).buttonTextColor
              : "#fff",
            boxShadow: pendingAction
              ? getDialogStyles(pendingAction.type).buttonShadow
              : "0 2px 8px 0 rgba(0,0,0,0.10)",
            "&:hover": {
              background: pendingAction
                ? getDialogStyles(pendingAction.type).hoverCancel
                : undefined,
              boxShadow: pendingAction
                ? getDialogStyles(pendingAction.type).canelButtonShadow
                : undefined,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (pendingAction && pendingAction.onConfirm)
              pendingAction.onConfirm();
            closeConfirm();
          }}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 700,
            textTransform: "none",
            fontFamily: "monospace",
            background: pendingAction
              ? getDialogStyles(pendingAction.type).button
              : undefined,
            color: pendingAction
              ? getDialogStyles(pendingAction.type).buttonTextColor
              : "#fff",
            boxShadow: pendingAction
              ? getDialogStyles(pendingAction.type).buttonShadow
              : "0 2px 8px 0 rgba(0,0,0,0.10)",
            "&:hover": {
              background: pendingAction
                ? getDialogStyles(pendingAction.type).hoverConfirm
                : undefined,
              boxShadow: pendingAction
                ? getDialogStyles(pendingAction.type).confirmButtonShadow
                : undefined,
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
