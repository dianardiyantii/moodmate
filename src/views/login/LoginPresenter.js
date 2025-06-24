import { renderNavbar } from "../../components/Navbar";
import ApiService from "../../services/apiService";
import bcrypt from "bcryptjs";
import { db, serverTimestamp } from "../../utils/firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function showNotification(message, type = "info") {
  const existingNotifications = document.querySelectorAll(
    ".moodmate-notification"
  );
  existingNotifications.forEach((notification) => notification.remove());

  const iconSVG = {
    success: `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    error: `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    warning: `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
    info: `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  };

  const colorClasses = {
    success: "bg-green-500 border-green-600 text-white",
    error: "bg-red-500 border-red-600 text-white",
    warning: "bg-yellow-500 border-yellow-600 text-white",
    info: "bg-blue-500 border-blue-600 text-white",
  };

  const notification = document.createElement("div");
  notification.className = `moodmate-notification fixed top-4 right-4 p-4 rounded-lg shadow-lg border z-50 transition-all duration-500 transform translate-x-full opacity-0 max-w-sm flex items-start ${colorClasses[type]}`;
  notification.innerHTML = `${iconSVG[type]}<div class="text-sm font-medium">${message}</div>`;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.replace("translate-x-full", "translate-x-0");
    notification.classList.replace("opacity-0", "opacity-100");
  }, 100);

  const hideNotification = () => {
    notification.classList.replace("translate-x-0", "translate-x-full");
    notification.classList.replace("opacity-100", "opacity-0");
    setTimeout(() => notification.remove(), 500);
  };

  setTimeout(hideNotification, type === "error" ? 5000 : 3000);
  notification.addEventListener("click", hideNotification);
}

export function initPasswordToggle() {
  const togglePassword = document.getElementById("toggle-password-login");
  const passwordInput = document.getElementById("login-password");
  const iconLogin = document.getElementById("icon-password-login");

  if (togglePassword && passwordInput && iconLogin) {
    togglePassword.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        iconLogin.classList.remove("fa-eye");
        iconLogin.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        iconLogin.classList.remove("fa-eye-slash");
        iconLogin.classList.add("fa-eye");
      }
      passwordInput.focus();
    });
  }
}

export function initModalPasswordToggle() {
  const toggleNewPassword = document.getElementById("toggle-new-password");
  const newPasswordInput = document.getElementById("new-password");
  const iconNewPassword = document.getElementById("icon-new-password");

  if (toggleNewPassword && newPasswordInput && iconNewPassword) {
    toggleNewPassword.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (newPasswordInput.type === "password") {
        newPasswordInput.type = "text";
        iconNewPassword.classList.remove("fa-eye");
        iconNewPassword.classList.add("fa-eye-slash");
      } else {
        newPasswordInput.type = "password";
        iconNewPassword.classList.remove("fa-eye-slash");
        iconNewPassword.classList.add("fa-eye");
      }
      newPasswordInput.focus();
    });
  }

  const toggleConfirmPassword = document.getElementById(
    "toggle-confirm-password"
  );
  const confirmPasswordInput = document.getElementById("confirm-password");
  const iconConfirmPassword = document.getElementById("icon-confirm-password");

  if (toggleConfirmPassword && confirmPasswordInput && iconConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        iconConfirmPassword.classList.remove("fa-eye");
        iconConfirmPassword.classList.add("fa-eye-slash");
      } else {
        confirmPasswordInput.type = "password";
        iconConfirmPassword.classList.remove("fa-eye-slash");
        iconConfirmPassword.classList.add("fa-eye");
      }
      confirmPasswordInput.focus();
    });
  }
}

export function initForgotPasswordModal() {
  const modal = document.getElementById("forgot-password-modal");
  const forgotLink = document.getElementById("forgot-password-link");
  const closeBtn = document.getElementById("close-modal");

  if (forgotLink && modal && closeBtn) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.remove("hidden");
      setTimeout(() => {
        initModalPasswordToggle();
      }, 50);
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }
}

export default function LoginPresenter() {
  setTimeout(() => {
    const loginForm = document.getElementById("form-login");

    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        const submitButton = loginForm.querySelector('button[type="submit"]');

        if (!email || !password) {
          showNotification("Email dan password harus diisi!", "warning");
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Memproses...";

        try {
          const result = await ApiService.login({ email, password });

          if (result.success) {
            ApiService.setSessionData(result.data.sessionId, result.data.user);

            window.dispatchEvent(
              new CustomEvent("userLoggedIn", { detail: result.data.user })
            );
            renderNavbar();
            showNotification("Login berhasil!", "success");

            setTimeout(() => {
              window.location.hash = "/dashboard";
            }, 1500);
          } else {
            throw new Error(result.message || "Login gagal!");
          }
        } catch (error) {
          console.error("Login Error:", error);
          showNotification(`❌ ${error.message}`, "error");
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = "Masuk";
        }
      });
    }

    const resetForm = document.getElementById("reset-password-form");

    if (resetForm) {
      const captchaElement = document.getElementById("captcha-text");
      if (
        captchaElement &&
        (!captchaElement.textContent ||
          captchaElement.textContent.trim() === "")
      ) {
        captchaElement.textContent = generateCaptcha();
      }

      document
        .getElementById("refresh-captcha")
        ?.addEventListener("click", () => {
          document.getElementById("captcha-text").textContent =
            generateCaptcha();
          document.getElementById("captcha-input").value = "";
        });

      resetForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("reset-email").value.trim();
        const newPassword = document.getElementById("new-password").value;
        const confirmPassword =
          document.getElementById("confirm-password").value;
        const captchaInput = document.getElementById("captcha-input").value;
        const captchaText = document.getElementById("captcha-text").textContent;
        const submitButton = resetForm.querySelector('button[type="submit"]');

        if (!email) {
          showNotification("Email harus diisi!", "warning");
          return;
        }

        if (newPassword !== confirmPassword) {
          showNotification("Konfirmasi password tidak cocok!", "error");
          return;
        }

        if (newPassword.length < 8) {
          showNotification("Password minimal 8 karakter!", "error");
          return;
        }

        if (captchaInput.trim() !== captchaText.trim()) {
          showNotification("CAPTCHA tidak sesuai!", "error");
          document.getElementById("captcha-text").textContent =
            generateCaptcha();
          document.getElementById("captcha-input").value = "";
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Memproses...";

        try {
          const userRef = doc(db, "users", email);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            throw new Error("Email tidak terdaftar!");
          }

          const hashedPassword = await bcrypt.hash(newPassword, 10);

          await setDoc(
            userRef,
            {
              password: hashedPassword,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );

          showNotification("Password berhasil direset!", "success");
          document
            .getElementById("forgot-password-modal")
            .classList.add("hidden");
          resetForm.reset();
          document.getElementById("captcha-text").textContent =
            generateCaptcha();
        } catch (error) {
          showNotification(`Gagal reset password: ${error.message}`, "error");
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = "Simpan";
        }
      });
    }
  }, 100);
}

function handleLoginError(error) {
  console.error("Login Error:", error);

  const errorMessages = {
    "Server tidak tersedia": " Server tidak berjalan!",
    "tidak terdaftar": " Email tidak terdaftar di sistem!",
    "Password salah": " Password yang Anda masukkan salah!",
    "permission-denied": " Akses ditolak. Periksa aturan Firestore.",
    unavailable: " Koneksi database bermasalah. Coba lagi nanti.",
  };

  const message = Object.entries(errorMessages).find(
    ([key]) => error.message.includes(key) || error.code === key
  );

  showNotification(
    message?.[1] || ` ${error.message || "Terjadi kesalahan saat login"}`,
    "error"
  );
}
