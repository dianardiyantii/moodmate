import LoginPresenter, {
  initPasswordToggle,
  initForgotPasswordModal,
} from "./LoginPresenter.js";

export default async function LoginView() {
  setTimeout(() => LoginPresenter(), 0);
  setTimeout(() => {
    initPasswordToggle();
    initForgotPasswordModal();
  }, 50);

  return `
    <section class="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <!-- Form Login -->
      <h2 class="text-3xl font-extrabold text-center text-blue-600 mb-8 dark:text-blue-400">Login</h2>
      <form id="form-login" class="space-y-6">
        <input
          type="email"
          id="login-email"
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          placeholder="Email"
          required
          autocomplete="email"
        />
        <div class="relative">
          <input
            type="password"
            id="login-password"
            class="w-full px-4 py-3 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            placeholder="Kata Sandi"
            required
            autocomplete="current-password"
          />
          <button
            type="button"
            id="toggle-password-login"
            class="absolute top-0 right-0 h-full px-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200 cursor-pointer"
            aria-label="Toggle password visibility"
            title="Tampilkan / sembunyikan kata sandi"
          >
            <i id="icon-password-login" class="fas fa-eye"></i>
          </button>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-lg font-semibold shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Masuk
        </button>
      </form>

      <!-- Link Lupa Password -->
      <p class="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
        <a href="#" id="forgot-password-link" class="text-blue-600 hover:underline dark:text-blue-400">Lupa Password?</a>
      </p>
      <p class="text-center text-sm mt-2 text-gray-600 dark:text-gray-400">
        Belum punya akun? <a href="#/register" class="text-blue-600 hover:underline dark:text-blue-400">Daftar di sini</a>
      </p>

      <!-- Modal Lupa Password dengan CAPTCHA dan Toggle Password -->
      <div id="forgot-password-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 hidden">
        <div class="flex items-center justify-center min-h-full">
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <!-- Header Modal -->
            <div class="text-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-2xl font-extrabold text-blue-600 dark:text-blue-400">Reset Password</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Silakan isi formulir di bawah untuk mereset password Anda</p>
            </div>

            <div class="p-6">
              <form id="reset-password-form" class="space-y-6">
                <!-- Email Field -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alamat Email</label>
                  <input
                    type="email"
                    id="reset-email"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                    placeholder="Masukkan email Anda"
                    required
                    autocomplete="email"
                  />
                </div>

                <!-- Password Baru Field dengan Toggle -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Baru</label>
                  <div class="relative">
                    <input
                      type="password"
                      id="new-password"
                      class="w-full px-4 py-3 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      placeholder="Minimal 8 karakter"
                      required
                      autocomplete="new-password"
                    />
                    <button
                      type="button"
                      id="toggle-new-password"
                      class="absolute top-0 right-0 h-full px-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200 cursor-pointer"
                      aria-label="Toggle password visibility"
                      title="Tampilkan / sembunyikan password baru"
                    >
                      <i id="icon-new-password" class="fas fa-eye"></i>
                    </button>
                  </div>
                </div>

                <!-- Konfirmasi Password Field dengan Toggle -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Konfirmasi Password</label>
                  <div class="relative">
                    <input
                      type="password"
                      id="confirm-password"
                      class="w-full px-4 py-3 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      placeholder="Ketik ulang password baru"
                      required
                      autocomplete="new-password"
                    />
                    <button
                      type="button"
                      id="toggle-confirm-password"
                      class="absolute top-0 right-0 h-full px-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200 cursor-pointer"
                      aria-label="Toggle password visibility"
                      title="Tampilkan / sembunyikan konfirmasi password"
                    >
                      <i id="icon-confirm-password" class="fas fa-eye"></i>
                    </button>
                  </div>
                </div>

                <!-- CAPTCHA Section -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Verifikasi CAPTCHA</label>
                  <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-3">
                      <span id="captcha-text" class="font-mono text-lg tracking-wider select-none bg-white dark:bg-gray-700 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold text-gray-800 dark:text-gray-200">
                        <!-- CAPTCHA akan di-generate oleh presenter -->
                      </span>
                      <button 
                        type="button" 
                        id="refresh-captcha" 
                        class="ml-3 p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        title="Refresh CAPTCHA"
                      >
                        <i class="fas fa-sync-alt text-lg"></i>
                      </button>
                    </div>
                    <input
                      type="text"
                      id="captcha-input"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      placeholder="Ketik teks CAPTCHA di atas"
                      required
                    />
                  </div>
                </div>

                <!-- Buttons -->
                <div class="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    class="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-lg font-semibold shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset Password
                  </button>
                  <button 
                    type="button" 
                    id="close-modal" 
                    class="flex-1 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 dark:text-gray-200 py-3 rounded-lg font-semibold shadow-md transition duration-200"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
