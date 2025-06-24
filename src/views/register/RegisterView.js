import RegisterPresenter from "./RegisterPresenter.js";

export default async function RegisterView() {
  setTimeout(() => RegisterPresenter(), 0);

  setTimeout(() => {
    initPasswordToggle();
  }, 100);

  return `
    <section class="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg
                    border border-gray-200
                    dark:bg-gray-900 dark:border-gray-700
                    ">
      <h2 class="text-3xl font-extrabold text-center text-blue-600 mb-8
          dark:text-blue-400
          ">Daftar</h2>
      <form id="form-register" class="space-y-6">
        <input
          id="reg-name"
          type="text"
          class="w-full px-4 py-3 rounded-lg border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          placeholder="Nama Lengkap"
          required
          autocomplete="name"
        />
        <input
          id="reg-email"
          type="email"
          class="w-full px-4 py-3 rounded-lg border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          placeholder="Email"
          required
          autocomplete="email"
        />
        <div class="relative">
          <input
            id="reg-password"
            type="password"
            class="w-full px-4 py-3 pr-16 rounded-lg border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            placeholder="Kata Sandi (min. 8 karakter)"
            required
            minlength="8"
            autocomplete="new-password"
          />
          <button
            type="button"
            id="toggle-password-reg"
            class="absolute top-0 right-0 h-full px-4
            text-gray-500 hover:text-gray-700
            dark:text-gray-400 dark:hover:text-gray-200
            focus:outline-none
            transition-colors duration-200
            cursor-pointer"
            aria-label="Toggle password visibility"
            title="Tampilkan / sembunyikan kata sandi"
          >
            <i id="icon-password-reg" class="fas fa-eye"></i>
          </button>
        </div>
        <div class="relative">
          <input
            id="reg-confirm"
            type="password"
            class="w-full px-4 py-3 pr-16 rounded-lg border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            placeholder="Konfirmasi Kata Sandi"
            required
            autocomplete="new-password"
          />
          <button
            type="button"
            id="toggle-password-confirm"
            class="absolute top-0 right-0 h-full px-4
              text-gray-500 hover:text-gray-700
              dark:text-gray-400 dark:hover:text-gray-200
              focus:outline-none
              transition-colors duration-200
              cursor-pointer"
            aria-label="Toggle password visibility"
            title="Tampilkan / sembunyikan kata sandi"
          >
            <i id="icon-password-confirm" class="fas fa-eye"></i>
          </button>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800
            text-white py-3 rounded-lg font-semibold
            shadow-md transition duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            "
        >
          Daftar
        </button>
      </form>
      <p class="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
        Sudah punya akun? <a href="#/login" class="text-blue-600 hover:underline">Masuk</a>
      </p>
    </section>
  `;
}

function initPasswordToggle() {
  const togglePassword = document.getElementById("toggle-password-reg");
  const passwordInput = document.getElementById("reg-password");
  const iconReg = document.getElementById("icon-password-reg");

  if (togglePassword && passwordInput && iconReg) {
    togglePassword.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        iconReg.classList.remove("fa-eye");
        iconReg.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        iconReg.classList.remove("fa-eye-slash");
        iconReg.classList.add("fa-eye");
      }
      passwordInput.focus();
    });
  }

  const toggleConfirm = document.getElementById("toggle-password-confirm");
  const confirmInput = document.getElementById("reg-confirm");
  const iconConfirm = document.getElementById("icon-password-confirm");

  if (toggleConfirm && confirmInput && iconConfirm) {
    toggleConfirm.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (confirmInput.type === "password") {
        confirmInput.type = "text";
        iconConfirm.classList.remove("fa-eye");
        iconConfirm.classList.add("fa-eye-slash");
      } else {
        confirmInput.type = "password";
        iconConfirm.classList.remove("fa-eye-slash");
        iconConfirm.classList.add("fa-eye");
      }
      confirmInput.focus();
    });
  }
}
