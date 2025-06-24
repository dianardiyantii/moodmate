export default async function DashboardView() {
  return `
    <section id="main-content" class="p-6 max-w-7xl mx-auto space-y-8">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Dashboard MoodMate
        </h1>
        <p class="text-gray-600 dark:text-gray-400">Pantau perjalanan emosi Anda setiap hari</p>
      </div>

      <!-- Quick Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Catatan -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium opacity-90">Total Catatan</h3>
              <p class="text-3xl font-bold mt-1" id="totalLogs">0</p>
            </div>
            <div class="bg-white/20 p-3 rounded-full">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Hari Beruntun -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-sm font-medium opacity-90">Hari Beruntun</h3>
      <p class="text-3xl font-bold mt-1" id="streak">0</p>
    </div>
    <div class="bg-white/20 p-3 rounded-full">
      <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.6 2.65.6 4.04 0 2.65-2.15 4.8-4.81 4.8z"/>
      </svg>
    </div>
  </div>
</div>

        <!-- Mood Dominan -->
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium opacity-90">Mood Dominan</h3>
              <p class="text-lg font-bold mt-1" id="dominantMood">-</p>
            </div>
            <div class="bg-white/20 p-3 rounded-full" id="dominantMoodIcon">
              <span class="text-2xl">❓</span>
            </div>
          </div>
        </div>

        <!-- Mood Hari Ini -->
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium opacity-90">Mood Hari Ini</h3>
              <p class="text-lg font-bold mt-1" id="todayMood">Belum Ada</p>
            </div>
            <div class="bg-white/20 p-3 rounded-full" id="todayMoodIcon">
              <span class="text-2xl">❓</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white" id="chartTitle">Grafik Mood 7 Hari Terakhir</h2>
          <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <!-- Chart Type Selector -->
            <div class="flex items-center space-x-4">
  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Tipe:</span>
  <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1.5 gap-1">
    <button id="chartTypeBar" class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium transition-colors flex items-center space-x-2">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h2v8H3v-8zm4-6h2v14H7V7zm4-6h2v20h-2V1zm4 8h2v12h-2V9zm4-4h2v16h-2V5z"/>
      </svg>
      <span>Bar</span>
    </button>
    <button id="chartTypeLine" class="px-4 py-2 bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors flex items-center space-x-2">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
      </svg>
      <span>Line</span>
    </button>
  </div>
</div>
            
            <!-- Period Selector -->
            <div class="flex space-x-2">
              <button id="chartPeriod7" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">7 Hari</button>
              <button id="chartPeriod30" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">30 Hari</button>
            </div>
          </div>
        </div>
        <div class="relative h-64 mb-4">
          <canvas id="moodChart" class="w-full h-full"></canvas>
        </div>
        <!-- Updated Mood Legend dengan 6 mood -->
        <div class="flex justify-center flex-wrap gap-4 text-sm">
          <div class="flex items-center space-x-2">
            <span class="text-xl">😢</span>
            <span class="text-gray-600 dark:text-gray-400">Sedih</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">😰</span>
            <span class="text-gray-600 dark:text-gray-400">Cemas</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">😐</span>
            <span class="text-gray-600 dark:text-gray-400">Netral</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">😠</span>
            <span class="text-gray-600 dark:text-gray-400">Marah</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">😊</span>
            <span class="text-gray-600 dark:text-gray-400">Senang</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">💖</span>
            <span class="text-gray-600 dark:text-gray-400">Cinta</span>
          </div>
        </div>
      </div>

      <!-- Additional Stats Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Weekly Mood Statistics Card -->
        <div class="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800/50 dark:to-purple-800/50 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200 to-indigo-200 dark:from-purple-800/50 dark:to-indigo-800/50 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
          
          <div class="relative z-10">
            <div class="flex items-center space-x-3 mb-4">
              <div class="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full">
                <span class="text-2xl">📊</span>
              </div>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white">Statistik Mood Minggu Ini</h3>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
              <!-- Sedih -->
              <div class="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-lg">😢</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Sedih</span>
                </div>
                <p class="text-lg font-bold text-gray-800 dark:text-white" id="sadCount">0</p>
              </div>
              
              <!-- Cemas -->
              <div class="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-lg">😰</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Cemas</span>
                </div>
                <p class="text-lg font-bold text-gray-800 dark:text-white" id="anxiousCount">0 hari</p>
              </div>
              
              <!-- Netral -->
              <div class="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-lg">😐</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Netral</span>
                </div>
                <p class="text-lg font-bold text-gray-800 dark:text-white" id="neutralCount">0 hari</p>
              </div>
              
              <!-- Marah -->
              <div class="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-lg">😠</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Marah</span>
                </div>
                <p class="text-lg font-bold text-gray-800 dark:text-white" id="angryCount">0 hari</p>
              </div>
              
              <!-- Senang -->
              <div class="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-lg">😊</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Senang</span>
                </div>
                <p class="text-lg font-bold text-gray-800 dark:text-white" id="happyCount">0 hari</p>
              </div>
              
              <!-- Cinta -->
              <div class="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-lg">💖</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Cinta</span>
                </div>
                <p class="text-lg font-bold text-gray-800 dark:text-white" id="loveCount">0 hari</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions & Achievement -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Aksi Cepat</h3>
            <div class="space-y-3">
              <a href="#/journal" class="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <div class="bg-blue-600 p-2 rounded-lg">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-white">Tulis Catatan Baru</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Catat mood dan aktivitas hari ini</p>
                </div>
              </a>
              
              <a href="#/riwayat" class="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <div class="bg-green-600 p-2 rounded-lg">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-white">Lihat Riwayat</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Tinjau catatan mood sebelumnya</p>
                </div>
              </a>
            </div>
          </div>

          <!-- Achievement -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">🏆 Pencapaian</h3>
            <div class="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div class="bg-purple-600 p-2 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-800 dark:text-white">Status Pencapaian</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400" id="achievementText">Terus semangat mencatat!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">💡 Tips Hari Ini</h3>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed" id="dailyTip">Mulai hari dengan gratitude - tuliskan 3 hal yang Anda syukuri hari ini!</p>
      </div>
    </section>
  `;
}
