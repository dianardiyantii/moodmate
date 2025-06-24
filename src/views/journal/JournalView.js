export default async function JournalView() {
  return `     
    <section id="main-content" class="p-6 max-w-7xl mx-auto space-y-8">
      <!-- Header with Date -->
      <div class="text-center mb-8">
        <h2 class="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Catatan Harian
        </h2>
        <p class="text-gray-600 dark:text-gray-400" id="tanggal-hari"></p>
      </div>

      <!-- Textarea for Notes -->
      <div class="mb-8">
        <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg border border-blue-100 dark:border-gray-600">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">💭 Ceritakan Harimu</h3>
            <div class="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          
          <textarea 
            id="catatan" 
            rows="6" 
            class="w-full p-4 border-2 border-blue-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:bg-gray-700 dark:text-white resize-none transition-all duration-300 bg-white dark:bg-gray-700"
            placeholder="Tulis tentang hari ini... Apa yang membuatmu senang? Apa tantangan yang kamu hadapi?"
          ></textarea>
        </div>
      </div>

      <!-- Activities Section -->
      <div class="mb-8">
        <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg border border-blue-100 dark:border-gray-600">
          <div class="text-center mb-8">
            <h3 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🎯 Aktivitas Hari Ini
            </h3>
            <p class="text-gray-600 dark:text-gray-400">Pilih aktivitas yang sudah kamu lakukan hari ini</p>
          </div>
        
          <!-- Basic Activities -->
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h4 class="text-xl font-bold text-gray-800 dark:text-white">Aktivitas Umum</h4>
              <div class="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" id="aktivitas-container"></div>
          </div>

          <!-- Custom Activities Section -->
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h4 class="text-xl font-bold text-gray-800 dark:text-white">Aktivitas Lainnya</h4>
              <div class="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
            </div>
          
            <!-- Input untuk menambah aktivitas custom -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600 mb-6">
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div class="flex-1 relative">
                  <input 
                    type="text" 
                    id="custom-activity-input" 
                    placeholder="Tambah aktivitas baru..." 
                    class="w-full p-3 sm:p-4 pr-10 sm:pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:bg-gray-700 dark:text-white transition-all duration-300 text-base sm:text-lg"
                    maxlength="20"
                  >
                  <div class="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ✨
                  </div>
                </div>
                <button 
                  id="add-custom-activity" 
                  class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold text-sm sm:text-lg shadow-md whitespace-nowrap"
                >
                  <span class="hidden sm:inline">➕ Tambah</span>
                  <span class="sm:hidden">➕</span>
                </button>
              </div>
            </div>
          
            <!-- Container untuk aktivitas custom -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" id="custom-aktivitas-container"></div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="text-center">
        <button 
          id="simpan-btn" 
          class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg"
        >
          💾 Simpan Catatan
        </button>
      </div>

      <style>
        /* Custom styles untuk activity cards */
        .activity-card {
          @apply bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer;
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%);
        }
        
        .activity-card.dark {
          background: linear-gradient(135deg, rgba(31,41,55,0.9) 0%, rgba(17,24,39,0.9) 100%);
        }
        
        .activity-card.selected {
          @apply border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30;
          box-shadow: 0 8px 25px rgba(147, 51, 234, 0.2);
        }
        
        .activity-emoji {
          @apply text-3xl mb-2 block transition-transform duration-300;
        }
        
        .activity-card:hover .activity-emoji {
          transform: scale(1.2) rotate(5deg);
        }
        
        .activity-text {
          @apply text-sm font-semibold text-gray-700 dark:text-gray-300 text-center;
        }
        
        .activity-card.selected .activity-text {
          @apply text-purple-700 dark:text-purple-300;
        }
        
        /* Animasi untuk container */
        #aktivitas-container, #custom-aktivitas-container {
          animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Glow effect untuk input focus */
        #custom-activity-input:focus {
          box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.1), 0 0 20px rgba(147, 51, 234, 0.1);
        }
        
        /* Responsive grid improvements */
        @media (max-width: 640px) {
          .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem;
          }
        }
        
        @media (max-width: 480px) {
          .activity-card {
            @apply p-3;
          }
          
          .activity-emoji {
            @apply text-2xl mb-1;
          }
          
          .activity-text {
            @apply text-xs;
          }
        }
      </style>
    </section>
  `;
}
