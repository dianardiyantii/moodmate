import ApiService from "../../services/apiService";

export default function RegisterPresenter() {
  function showNotification(message, type = "info") {
    // ... (Fungsi notifikasi Anda, tidak ada perubahan di sini)
    const existingNotifications = document.querySelectorAll(
      ".moodmate-notification"
    );
    existingNotifications.forEach((notification) => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    });

    const iconSVG = {
      success: `<svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
      error: `<svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
      warning: `<svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>`,
      info: `<svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
    };

    const colorClasses = {
      success: "bg-green-500 border-green-600 text-white shadow-green-500/25",
      error: "bg-red-500 border-red-600 text-white shadow-red-500/25",
      warning:
        "bg-yellow-500 border-yellow-600 text-white shadow-yellow-500/25",
      info: "bg-blue-500 border-blue-600 text-white shadow-blue-500/25",
    };

    const notification = document.createElement("div");
    notification.className = `moodmate-notification fixed top-4 right-4 p-4 rounded-lg shadow-lg border z-50 transition-all duration-500 transform translate-x-full opacity-0 max-w-sm flex items-start ${colorClasses[type]}`;

    notification.innerHTML = `
      ${iconSVG[type] || ""}
      <div class="text-sm font-medium leading-relaxed">${message}</div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove("translate-x-full", "opacity-0");
      notification.classList.add("translate-x-0", "opacity-100");
    }, 100);

    const hideNotification = () => {
      notification.classList.remove("translate-x-0", "opacity-100");
      notification.classList.add("translate-x-full", "opacity-0");

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    };

    const autoHideTime =
      type === "error" ? 5000 : type === "success" ? 3000 : 4000;
    setTimeout(hideNotification, autoHideTime);

    notification.addEventListener("click", hideNotification);
    notification.style.cursor = "pointer";
  }

  setTimeout(() => {
    const form = document.getElementById("form-register");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("reg-confirm").value;
        const submitButton = form.querySelector('button[type="submit"]');

        if (
          !name ||
          !email ||
          password.length < 8 ||
          password !== confirmPassword
        ) {
          showNotification(
            "Harap periksa kembali semua isian Anda.",
            "warning"
          );
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Mendaftar...";

        try {
          const result = await ApiService.register({ name, email, password });

          if (result.success) {
            showNotification("Registrasi berhasil! Silakan Masuk.", "success");
            form.reset();
            setTimeout(() => {
              window.location.hash = "/login";
            }, 1500);
          } else {
            throw new Error(result.message || "Registrasi gagal!");
          }
        } catch (error) {
          console.error("Registration Error:", error);
          showNotification(`❌ ${error.message}`, "error");
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = "Daftar";
        }
      });
    }
  }, 100);
}
