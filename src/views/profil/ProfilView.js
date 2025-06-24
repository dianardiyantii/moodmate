import { UserModel } from "../../models/UserModel.js";

export default async function ProfilView() {
  // Wait for UserModel to be ready
  let user = null;
  try {
    user = UserModel.getCurrent();
    if (!user) {
      user = await UserModel.getProfile();
    }
  } catch (error) {
    console.error("Error getting user data:", error);
  }

  const formatJoinDate = (dateString) => {
    if (!dateString || dateString === "undefined") {
      return "Tanggal tidak tersedia";
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Tanggal tidak valid";
      }
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long", 
        day: "numeric",
      });
    } catch (error) {
      return "Tanggal tidak tersedia";
    }
  };

  const htmlContent = `
    <section id="main-content" class="p-6 max-w-7xl mx-auto space-y-8">
      <!-- Header with Profile Title -->
      <div class="text-center mb-8">
        <h2 class="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Profil Pengguna
        </h2>
        <p class="text-gray-600 dark:text-gray-400">Kelola informasi profil Anda</p>
      </div>

      <!-- Profile Content -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Profile Header Section -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center">
            <div class="relative inline-block">
              <img id="profile-photo-preview"
                  src="${user?.profilePhoto || '/images/profile.png'}"
                  alt="Foto Profil"
                  class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-gray-100 transition-all duration-300 hover:scale-105"
                  onerror="this.src='/images/profile.png'" />
              
              <!-- Photo Overlay -->
              <div class="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center cursor-pointer group"
                  id="photo-overlay"
                  title="Klik untuk mengubah foto profil">
                <svg class="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Hidden file input -->
            <input type="file" 
                   id="upload-photo" 
                   accept="image/jpeg,image/jpg,image/png,image/gif" 
                   style="display: none;" />
            
            <div class="mt-6">
              <button id="change-photo-btn"
                  class="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 disabled:bg-opacity-10 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-white border-opacity-20 hover:scale-105 transform active:scale-95">
                <svg class="w-5 h-5 inline-block mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="whitespace-nowrap">Ubah Foto Profil</span>
              </button>
            </div>

            <!-- Photo Options Modal -->
            <div id="photo-options-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 backdrop-blur-sm">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl transform scale-95 transition-transform duration-300">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">Pilih Aksi</h3>
                <div class="space-y-3">
                  <button id="upload-photo-btn" 
                      class="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center active:scale-95">
                    <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span class="whitespace-nowrap">Upload Foto Baru</span>
                  </button>
                  
                  <button id="reset-photo-btn" 
                      class="w-full px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center active:scale-95">
                    <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span class="whitespace-nowrap">Reset ke Default</span>
                  </button>
                  
                  <button id="cancel-photo-options" 
                      class="w-full px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center active:scale-95">
                    <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span class="whitespace-nowrap">Batal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Information Section -->
          <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Personal Information Card -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-blue-100 dark:border-gray-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="p-3 bg-blue-500 rounded-xl">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white ml-3">Informasi Personal</h3>
                  </div>
                  <button id="edit-profile-btn" 
                          class="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 active:scale-95" 
                          title="Edit Profile">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                </div>
                
                <!-- View Mode -->
                <div id="profile-view-mode" class="space-y-4">
                  <div>
                    <label class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nama Lengkap</label>
                    <p id="display-name" class="text-lg font-bold text-gray-900 dark:text-white mt-1 break-words">${
                      user?.name || "Memuat..."
                    }</p>
                  </div>
                  
                  <div>
                    <label class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</label>
                    <p id="display-email" class="text-lg text-gray-700 dark:text-gray-200 mt-1 break-all">${
                      user?.email || "Memuat..."
                    }</p>
                  </div>
                  
                  <div>
                    <label class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Password</label>
                    <p class="text-lg text-gray-700 dark:text-gray-200 mt-1">••••••••</p>
                  </div>
                </div>

                <!-- Edit Mode -->
                <div id="profile-edit-mode" class="space-y-4 hidden">
                  <div>
                    <label for="edit-name" class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nama Lengkap</label>
                    <input type="text" 
                           id="edit-name" 
                           value="${user?.name || ""}" 
                           placeholder="Masukkan nama lengkap"
                           class="w-full mt-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
                           maxlength="50"
                           required />
                  </div>
                  
                  <div>
                    <label class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</label>
                    <input type="email" 
                           value="${user?.email || ""}" 
                           disabled
                           class="w-full mt-1 px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Email tidak dapat diubah</p>
                  </div>
                  
                  <div>
                    <label for="edit-current-password" class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Password Saat Ini</label>
                    <input type="password" 
                           id="edit-current-password" 
                           placeholder="Masukkan password saat ini"
                           class="w-full mt-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200" />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Diperlukan untuk mengubah password</p>
                  </div>
                  
                  <div>
                    <label for="edit-password" class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Password Baru</label>
                    <input type="password" 
                           id="edit-password" 
                           placeholder="Kosongkan jika tidak ingin mengubah password"
                           class="w-full mt-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
                           minlength="6" />
                  </div>
                  
                  <div>
                    <label for="edit-password-confirm" class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Konfirmasi Password</label>
                    <input type="password" 
                           id="edit-password-confirm" 
                           placeholder="Konfirmasi password baru"
                           class="w-full mt-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
                           minlength="6" />
                  </div>
                  
                  <div class="flex gap-3 pt-4">
                    <button id="save-profile-btn" 
                            class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium active:scale-95">
                      <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Simpan Perubahan
                    </button>
                    <button id="cancel-edit-btn" 
                            class="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 font-medium active:scale-95">
                      <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Batal
                    </button>
                  </div>
                </div>
              </div>

              <!-- Account Information Card -->
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-purple-100 dark:border-gray-600">
                <div class="flex items-center mb-4">
                  <div class="p-3 bg-purple-500 rounded-xl">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4V7a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v4a2 2 0 002 2h4a2 2 0 002-2v-4"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-800 dark:text-white ml-3">Informasi Akun</h3>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tanggal Bergabung</label>
                    <p class="text-lg text-gray-700 dark:text-gray-200 mt-1">${formatJoinDate(
                      user?.joined || user?.createdAt || user?.created_at
                    )}</p>
                  </div>
                  
                  <div>
                    <label class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status Akun</label>
                    <div class="flex items-center mt-1">
                      <div class="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <p class="text-lg text-green-600 dark:text-green-400 font-semibold">Aktif</p>
                    </div>
                  </div>
              
                </div>
              </div>
            </div>

            <!-- Actions Section -->
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button onclick="window.history.back()" 
                  class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 font-medium hover:scale-105 transform active:scale-95">
                  <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  return htmlContent;
}