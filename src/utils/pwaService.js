class PWAService {
  constructor() {
    this.deferredPrompt = null;
    this._isInstalled = false;
    this._isInstallable = false;
    this.serviceWorkerRegistration = null;
  }

  // Initialize PWA service
  async init() {
    this.checkInstallationStatus();
    this.setupEventListeners();
    await this.registerServiceWorker();
  }

  // Getters for latest states
  get isInstalled() {
    return this._isInstalled;
  }

  set isInstalled(value) {
    this._isInstalled = value;
  }

  get isInstallable() {
    return this._isInstallable;
  }

  set isInstallable(value) {
    this._isInstallable = value;
  }

  // Check if app is installed
  checkInstallationStatus() {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isIOSStandalone = window.navigator.standalone === true;
    const isAndroidInstalled = document.referrer.includes("android-app://");

    this.isInstalled = isStandalone || isIOSStandalone || isAndroidInstalled;

    // Listen for display mode changes
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", () => {
        this.checkInstallationStatus();
      });

    return this.isInstalled;
  }

  // Setup event listeners
  setupEventListeners() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstallable = true;
      console.log("beforeinstallprompt event captured");

      window.dispatchEvent(
        new CustomEvent("pwa-installable", {
          detail: { isInstallable: true },
        })
      );
    });

    window.addEventListener("appinstalled", (e) => {
      this.isInstalled = true;
      this.isInstallable = false;
      this.deferredPrompt = null;
      console.log("App was installed");

      window.dispatchEvent(
        new CustomEvent("pwa-installed", {
          detail: { isInstalled: true },
        })
      );
    });
  }

  // Register service worker
  async registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      console.log("Service Worker not supported");
      return false;
    }

    try {
      this.serviceWorkerRegistration = await navigator.serviceWorker.register(
        "/sw.js",
        {
          scope: "/",
        }
      );

      console.log(
        "Service Worker registered successfully:",
        this.serviceWorkerRegistration
      );

      if (this.serviceWorkerRegistration.active) {
        console.log("Service Worker is active");
      } else if (this.serviceWorkerRegistration.installing) {
        console.log("Service Worker is installing");
        this.serviceWorkerRegistration.installing.addEventListener(
          "statechange",
          (e) => {
            if (e.target.state === "activated") {
              console.log("Service Worker activated");
            }
          }
        );
      } else if (this.serviceWorkerRegistration.waiting) {
        console.log("Service Worker is waiting");
      }

      return true;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return false;
    }
  }

  // Check if service worker is registered
  async isServiceWorkerRegistered() {
    if (!("serviceWorker" in navigator)) {
      return false;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      return registrations.length > 0;
    } catch (error) {
      console.error("Error checking service worker registrations:", error);
      return false;
    }
  }

  // Trigger install prompt
  async triggerInstall() {
    if (!this.deferredPrompt) {
      throw new Error("Install prompt not available");
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
        return { success: true, outcome: "accepted" };
      } else {
        console.log("User dismissed the install prompt");
        return { success: true, outcome: "dismissed" };
      }
    } catch (error) {
      console.error("Error triggering install:", error);
      throw error;
    } finally {
      this.deferredPrompt = null;
      this.isInstallable = false;
    }
  }

  // Get PWA status summary
  async getPWAStatus() {
    const isServiceWorkerSupported = "serviceWorker" in navigator;
    const isNotificationsSupported = "Notification" in window;
    const isHTTPS =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost";
    const manifestExists = !!document.querySelector('link[rel="manifest"]');
    const swRegistered = await this.isServiceWorkerRegistered();

    return {
      serviceWorkerSupported: isServiceWorkerSupported,
      notificationsSupported: isNotificationsSupported,
      isHTTPS,
      manifestExists,
      swRegistered,
      beforeInstallPromptSupported: this.isInstallable,
      isInstalled: this.isInstalled,
    };
  }

  // Helper methods
  isHTTPS() {
    return (
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost"
    );
  }

  hasManifest() {
    return !!document.querySelector('link[rel="manifest"]');
  }
}

const pwaService = new PWAService();

export default pwaService;
