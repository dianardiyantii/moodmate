export default async function JournalResultView() {
  return `
    <div class="max-w-7xl mx-auto p-6 space-y-8">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div class="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          <h2 class="text-4xl md:text-5xl font-extrabold mb-4">✨ Analisis Catatan Harianmu</h2>
        </div>
        <p class="text-xl text-gray-600 dark:text-gray-300 font-medium" id="tanggal-hasil">Memuat...</p>
      </div>

      <!-- AI Info Banner -->
      <div id="aiInfo" class="hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
        <div class="flex items-center justify-center gap-3">
          <span class="text-2xl">🤖</span>
          <div class="text-center">
            <p class="font-bold text-lg">Analisis AI</p>
            <p class="text-blue-100">Mood dianalisis menggunakan kecerdasan buatan</p>
          </div>
        </div>
      </div>

      <!-- Mood Analysis Result -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 mb-8 border border-gray-100 dark:border-gray-700">
        <div class="text-center mb-8">
          <h3 class="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Hari Ini Kamu Terlihat...</h3>
          <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        <div class="mood-result-box rounded-2xl p-10 mb-8 transform transition-all duration-500 hover:scale-105" id="moodBox">
          <div class="flex flex-col md:flex-row items-center justify-center gap-8">
            <div class="text-center">
              <span id="emoji" class="text-8xl md:text-9xl animate-bounce block mb-4">😐</span>
              <div class="w-20 h-1 bg-white/30 mx-auto rounded-full"></div>
            </div>
            <div class="text-center md:text-left">
              <p class="font-bold text-4xl md:text-5xl mb-4 text-gray-800 dark:text-white" id="moodText">Memuat...</p>
              <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-md" id="moodDescription">Sedang menganalisis mood Anda...</p>
            </div>
          </div>
        </div>

        <!-- Confidence Bar -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Tingkat Keyakinan Analisis</span>
            <span class="text-sm text-gray-500 dark:text-gray-400" id="confidenceText">75% tingkat keyakinan analisis</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div class="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out" 
                id="confidenceBar" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <!-- Journal Entry Preview -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">📝 Catatan Harianmu</h3>
          <div class="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border-l-4 border-blue-500">
          <p class="text-lg text-gray-700 dark:text-gray-200 italic font-medium leading-relaxed" id="catatanPreview">
            "Memuat catatan..."
          </p>
        </div>
      </div>

      <!-- Activities Section -->
      <div id="aktivitasSection" class="hidden bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">🎯 Aktivitas yang Kamu Lakukan</h3>
          <div class="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="aktivitasTerpilih">
          <!-- Activities will be populated by JavaScript -->
        </div>
      </div>

      <!-- Song Recommendations Section -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">🎵 Rekomendasi Lagu</h3>
          <div class="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto rounded-full"></div>
          <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm">Lagu yang cocok dengan mood-mu hari ini</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6" id="songRecommendations">
          <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl p-6 h-32"></div>
          <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl p-6 h-32"></div>
          <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl p-6 h-32"></div>
        </div>
      </div>

      <!-- Activity Recommendations Section -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">🌟 Rekomendasi Aktivitas</h3>
          <div class="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto rounded-full"></div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6" id="activityRecommendations">
          <!-- Recommendations will be populated by JavaScript -->
        </div>
      </div>

      <!-- Motivational Quote Section -->
      <div class="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-900/30 dark:via-purple-800/20 dark:to-pink-900/30 
                  rounded-3xl p-8 border border-indigo-200 dark:border-indigo-700 text-center">
        <div class="mb-4">
          <span class="text-4xl">💝</span>
        </div>
        <blockquote class="text-lg font-medium text-gray-700 dark:text-gray-200 italic mb-4">
          "Setiap hari adalah kesempatan baru untuk menciptakan kebahagiaan dalam hidupmu."
        </blockquote>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-semibold">- MoodMate untuk kamu 💙</p>
      </div>

      <!-- Enhanced Action Buttons -->
      <div class="flex flex-wrap gap-6 justify-center items-center pt-12">
        <!-- Edit Journal Button -->
        <button id="editJournalBtn" 
            class="group relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 
            hover:from-amber-500 hover:via-orange-600 hover:to-red-600 
            text-white font-bold py-5 px-8 rounded-2xl shadow-xl 
            transform transition-all duration-500 hover:scale-110 hover:shadow-2xl
            border-2 border-white/20 backdrop-blur-sm
            flex items-center gap-4 min-w-[220px] justify-center
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
            before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
          <span class="relative z-10 text-2xl group-hover:animate-pulse transition-all duration-300 group-hover:scale-125">✏️</span>
          <div class="relative z-10 flex flex-col items-start">
            <span class="text-lg font-bold">Edit Journal</span>
            <span class="text-xs text-white/80 font-normal">Ubah catatan harianmu</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>
        
        <!-- Delete Journal Button -->
        <button id="deleteJournalBtn" 
            class="group relative overflow-hidden bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 
            hover:from-red-600 hover:via-pink-600 hover:to-rose-700 
            text-white font-bold py-5 px-8 rounded-2xl shadow-xl 
            transform transition-all duration-500 hover:scale-110 hover:shadow-2xl
            border-2 border-white/20 backdrop-blur-sm
            flex items-center gap-4 min-w-[220px] justify-center
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
            before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
          <span class="relative z-10 text-2xl group-hover:animate-pulse transition-all duration-300 group-hover:scale-125">🗑️</span>
          <div class="relative z-10 flex flex-col items-start">
            <span class="text-lg font-bold">Hapus Journal</span>
            <span class="text-xs text-white/80 font-normal">Hapus catatan ini</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>
        
        <!-- Back to Journal Button -->
        <button id="backToJournalBtn" 
          class="group relative overflow-hidden bg-gradient-to-br from-gray-600 via-slate-600 to-gray-700 
          hover:from-gray-700 hover:via-slate-700 hover:to-gray-800 
          text-white font-bold py-5 px-8 rounded-2xl shadow-xl 
          transform transition-all duration-500 hover:scale-110 hover:shadow-2xl
          border-2 border-white/20 backdrop-blur-sm
          flex items-center gap-4 min-w-[220px] justify-center
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
          <span class="relative z-10 text-2xl group-hover:animate-pulse transition-all duration-300 group-hover:scale-125">↩️</span>
          <div class="relative z-10 flex flex-col items-start">
            <span class="text-lg font-bold">Kembali ke Journal</span>
            <span class="text-xs text-white/80 font-normal">Tulis journal baru</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>
        
        <!-- View All Journals Button -->
        <button id="viewAllJournalsBtn" 
          class="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 
          hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 
          text-white font-bold py-5 px-8 rounded-2xl shadow-xl 
          transform transition-all duration-500 hover:scale-110 hover:shadow-2xl
          border-2 border-white/20 backdrop-blur-sm
          flex items-center gap-4 min-w-[220px] justify-center
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
          <span class="relative z-10 text-2xl group-hover:animate-pulse transition-all duration-300 group-hover:scale-125">📚</span>
          <div class="relative z-10 flex flex-col items-start">
            <span class="text-lg font-bold">Lihat Semua Journal</span>
            <span class="text-xs text-white/80 font-normal">Riwayat catatan</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>
      </div>
    </div>
  `;
}
