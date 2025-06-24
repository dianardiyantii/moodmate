export default async function RiwayatView() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const monthOptions = [];
  for (let year = currentYear - 2; year <= currentYear + 1; year++) {
    for (let month = 0; month < 12; month++) {
      const isSelected = year === currentYear && month === currentMonth;
      monthOptions.push(`
        <option value="${year}-${month}" ${isSelected ? "selected" : ""}>
          ${monthNames[month]} ${year}
        </option>
      `);
    }
  }

  return `
    <div class="max-w-7xl mx-auto p-6 space-y-8 relative">
      <!-- Header Section -->
      <div class="text-center mb-12 relative z-10">
        <h2 class="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          📚 Riwayat Catatan
        </h2>
        <p class="text-gray-600 dark:text-gray-400 font-medium">Lihat kembali perjalanan mood dan catatanmu</p>
      </div>

      <!-- Controls Section -->
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-xl p-4 md:p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div class="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-center lg:justify-between">
          <!-- View Toggle -->
          <div class="flex justify-center lg:justify-start lg:order-1">
            <div class="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-2xl p-1">
              <button id="calendarViewBtn" 
                      class="px-3 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 bg-blue-500 text-white shadow-lg whitespace-nowrap">
                📅 Kalender
              </button>
              <button id="listViewBtn" 
                      class="px-3 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 whitespace-nowrap">
                📋 List
              </button>
            </div>
          </div>

          <!-- Month Navigation (for calendar view) - CENTER -->
          <div class="flex items-center justify-center gap-2 md:gap-4 lg:order-2">
            <button id="prevMonthBtn" 
              class="p-2 md:p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
              transition-all duration-200 text-gray-600 dark:text-gray-300 hover:scale-105">
              ←
            </button>
            <h3 id="currentMonthYear" class="text-lg md:text-xl font-bold text-gray-800 dark:text-white min-w-[140px] md:min-w-[200px] text-center">
              ${monthNames[currentMonth]} ${currentYear}
            </h3>
            <button id="nextMonthBtn" 
              class="p-2 md:p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
              transition-all duration-200 text-gray-600 dark:text-gray-300 hover:scale-105">
              →
            </button>
          </div>

          <!-- Filters -->
          <div class="flex flex-col sm:flex-row gap-2 md:gap-3 lg:order-3">
            <select id="monthFilter" 
            class="px-3 md:px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm md:text-base
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            shadow-sm hover:shadow-md transition-shadow min-w-0">
                ${monthOptions.join("")}
            </select>
            
            <select id="moodFilter" 
              class="px-3 md:px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm md:text-base
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              shadow-sm hover:shadow-md transition-shadow min-w-0">
              <option value="all">Semua Mood</option>
              <option value="happy">😊 Senang</option>
              <option value="sad">😢 Sedih</option>
              <option value="anger">😠 Marah</option>
              <option value="fear">😰 Cemas</option>
              <option value="love">💖 Penuh Cinta</option>
              <option value="neutral">😐 Netral</option>
            </select>
          </div>
        </div>

        <!-- Info Bar -->
        <div class="flex items-center justify-between mt-4 md:mt-6 pt-4 border-t border-gray-200/70 dark:border-gray-600/70">
          <div class="flex items-center gap-4">
            <span id="totalJournals" class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 md:px-3 py-1 rounded-full">
              0 catatan
            </span>
          </div>
          
          <!-- Loading Indicator -->
          <div id="loadingIndicator" class="hidden">
            <div class="flex items-center gap-2 text-blue-500">
              <div class="animate-spin rounded-full h-3 md:h-4 w-3 md:w-4 border-2 border-blue-500 border-t-transparent"></div>
              <span class="text-xs md:text-sm font-medium">Memuat...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Container -->
      <div id="contentContainer" class="min-h-[500px]">
        <!-- Content will be dynamically rendered here by the presenter -->
        <div class="text-center py-12">
          <div class="animate-pulse">
            <div class="text-6xl mb-4">📖</div>
            <h3 class="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">Memuat Riwayat...</h3>
            <p class="text-gray-500 dark:text-gray-400">Sedang mengambil data catatan journal Anda</p>
          </div>
        </div>
      </div>

      
      </div>
    </div>

    <!-- Enhanced Journal Detail Modal - DIPERCANTIK -->
    <div id="journalModal" class="modal-overlay opacity-0 invisible fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/30 to-blue-900/40 backdrop-blur-xl transition-all duration-500">
        <!-- Floating particles effect -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
          <div class="particle particle-4"></div>
          <div class="particle particle-5"></div>
        </div>
      </div>
      
      <!-- Modal Container -->
      <div class="modal-container relative w-full max-w-5xl max-h-[90vh] transform scale-75 opacity-0 transition-all duration-500 ease-out">
        <!-- Main Modal Card -->
        <div class="bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-purple-900/20 
                    rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/30 backdrop-blur-xl">
          
          <!-- Decorative Header -->
          <div class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-1">
            <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-t-3xl">
              <!-- Header with animated elements -->
              <div class="relative p-6 pb-4">
                <!-- Floating decorative elements -->
                <div class="absolute top-0 left-0 w-full h-full overflow-hidden rounded-t-3xl">
                  <div class="absolute top-4 left-8 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
                  <div class="absolute top-8 right-12 w-8 h-8 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-lg animate-pulse delay-700"></div>
                  <div class="absolute top-12 right-24 w-6 h-6 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-md animate-pulse delay-1000"></div>
                </div>

                <div class="relative flex justify-between items-center">
                  <div class="flex items-center gap-4">
                    <!-- Animated icon -->
                    <div class="relative">
                      <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                        <span class="text-2xl">📔</span>
                      </div>
                      <div class="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <span class="text-xs">✨</span>
                      </div>
                    </div>
                    
                    <div>
                      <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                        Detail Catatan
                      </h2>
                      <p class="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Perjalanan emosi dan refleksi diri</p>
                    </div>
                  </div>
                  
                  <!-- Enhanced close button -->
                  <button id="closeModalBtn" 
                          class="group relative p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-90">
                    <div class="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <svg class="relative w-6 h-6 text-gray-500 group-hover:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Modal Body with enhanced styling -->
          <div id="journalModalBody" class="p-8 overflow-y-auto max-h-[calc(90vh-160px)] custom-scrollbar">
            <!-- Content will be dynamically inserted here with enhanced styling -->
            <div class="animate-pulse text-center py-12">
              <div class="text-4xl mb-4">⏳</div>
              <p class="text-gray-500 dark:text-gray-400">Memuat detail catatan...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Custom Styles -->
    <style>
      /* Modal animations and effects */
      .modal-overlay {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .modal-overlay.show {
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      .modal-overlay.show .modal-container {
        transform: scale(1);
        opacity: 1;
      }

      /* Custom scrollbar for modal */
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: linear-gradient(to bottom, rgba(243, 244, 246, 0.3), rgba(229, 231, 235, 0.3));
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #3B82F6, #8B5CF6);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #2563EB, #7C3AED);
        background-clip: content-box;
      }

      /* Dark mode scrollbar */
      .dark .custom-scrollbar::-webkit-scrollbar-track {
        background: linear-gradient(to bottom, rgba(55, 65, 81, 0.3), rgba(75, 85, 99, 0.3));
      }

      /* Floating particles animation */
      .particle {
        position: absolute;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;
      }
      
      .particle-1 {
        width: 20px;
        height: 20px;
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }
      
      .particle-2 {
        width: 15px;
        height: 15px;
        top: 60%;
        right: 20%;
        animation-delay: 2s;
      }
      
      .particle-3 {
        width: 25px;
        height: 25px;
        bottom: 30%;
        left: 70%;
        animation-delay: 4s;
      }
      
      .particle-4 {
        width: 12px;
        height: 12px;
        top: 40%;
        right: 60%;
        animation-delay: 1s;
      }
      
      .particle-5 {
        width: 18px;
        height: 18px;
        bottom: 20%;
        left: 30%;
        animation-delay: 3s;
      }

      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
          opacity: 0.7;
        }
        50% {
          transform: translateY(-20px) rotate(180deg);
          opacity: 1;
        }
      }

      /* Bounce animation */
      @keyframes bounce-slow {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }
      
      .animate-bounce-slow {
        animation: bounce-slow 2s ease-in-out infinite;
      }

      /* Enhanced scrollbar for main content */
      .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
      }
      
      .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .scrollbar-thin::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, rgba(156, 163, 175, 0.5), rgba(107, 114, 128, 0.5));
        border-radius: 3px;
      }
      
      .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, rgba(156, 163, 175, 0.7), rgba(107, 114, 128, 0.7));
      }
      
      .dark .scrollbar-thin::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, rgba(75, 85, 99, 0.5), rgba(55, 65, 81, 0.5));
      }
      
      .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, rgba(75, 85, 99, 0.7), rgba(55, 65, 81, 0.7));
      }

      /* Calendar styling */
      .calendar-day {
        position: relative;
        transition: all 0.2s ease;
      }
      
      .calendar-day.has-journals::before {
        content: '';
        position: absolute;
        top: 2px;
        right: 2px;
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #3B82F6, #1D4ED8);
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
      }
      
      .calendar-day:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }
      
      .calendar-day.has-journals:hover {
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
      }

      /* Line clamp utility */
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* Enhanced transitions */
      #contentContainer {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Responsive improvements */
      @media (max-width: 640px) {
        /* Mobile specific styles */
        .calendar-day {
          min-height: 60px;
          font-size: 0.8rem;
        }
        
        .calendar-day .text-xs {
          font-size: 0.7rem;
        }

        #currentMonthYear {
          font-size: 1rem;
          min-width: 120px;
        }
      }

      @media (max-width: 768px) {
        .calendar-day {
          min-height: 70px;
          font-size: 0.875rem;
        }
        
        .calendar-day .text-xs {
          font-size: 0.75rem;
        }

        .modal-container {
          max-width: 95vw;
          max-height: 95vh;
          margin: 1rem;
        }
        
        #journalModalBody {
          padding: 1rem;
          max-height: calc(95vh - 140px);
        }
      }

      /* Loading animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .fade-in-up {
        animation: fadeInUp 0.5s ease-out;
      }

      /* Glassmorphism effect */
      .glass-effect {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .dark .glass-effect {
        background: rgba(31, 41, 55, 0.8);
        border: 1px solid rgba(75, 85, 99, 0.2);
      }
    </style>
  `;
}
