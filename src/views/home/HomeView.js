export default async function HomeView() {
  return `
    <!-- Hero Section dengan Background Gradient -->
    <header class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 mt-4 min-h-screen flex items-center transition-colors duration-500 relative overflow-hidden">
      
      <!-- Floating Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-fade-in-up" style="animation-delay: 0.2s;"></div>
        <div class="absolute top-40 right-20 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-fade-in-up" style="animation-delay: 0.4s;"></div>
        <div class="absolute bottom-32 left-1/4 w-20 h-20 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 animate-fade-in-up" style="animation-delay: 0.6s;"></div>
        <div class="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-fade-in-up" style="animation-delay: 0.8s;"></div>
        
        <!-- Animated Lines -->
        <div class="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-30"></div>
        <div class="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-30"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">

        <!-- Teks & Call to Action -->
        <div class="text-center md:text-left animate-fade-in-up">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6 card-responsive">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-2 loading-spinner"></span>
            Mood Analysis
          </div>
          
          <h1 class="text-5xl md:text-6xl font-extrabold leading-tight text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text mb-4">
            Temukan Moodmu,<br />
            <span class="text-gradient">Temukan Dirimu</span>
          </h1>
          
          <p class="mt-6 text-lg md:text-xl max-w-xl mx-auto md:mx-0 text-gray-700 dark:text-gray-300 leading-relaxed animate-fade-in-up" style="animation-delay: 0.2s;">
            Tulis ceritamu dan biarkan kami memahami suasana hatimu. 
            Dapatkan rekomendasi lagu dan aktivitas yang cocok untukmu.
          </p>
          
          <div class="mt-4 flex items-center justify-center md:justify-start space-x-2 animate-fade-in-up" style="animation-delay: 0.4s;">
            <div class="flex -space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full border-2 border-white dark:border-gray-800"></div>
              <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full border-2 border-white dark:border-gray-800"></div>
              <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 italic">
              Kenali emosimu, atur harimu dengan lebih baik bersama <strong class="text-blue-600 dark:text-blue-400">MoodMate</strong>.
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-in-up" style="animation-delay: 0.6s;">
            <a href="#/login"
              class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl btn-transition transform hover:scale-105 group"
            >
              <span>Mulai Sekarang</span>
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </a>
            
            <a href="#/about"
              class="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-md hover:shadow-lg btn-transition border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>

        <!-- Ilustrasi gambar dengan enhancements -->
        <div class="flex justify-center md:justify-end animate-fade-in-up" style="animation-delay: 0.8s;">
          <div class="relative">
            <!-- Glow effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur-xl opacity-30 scale-110"></div>
            
            <!-- Main image -->
            <div class="relative card-responsive">
              <img 
                src="/images/landing-page.png" 
                alt="Ilustrasi MoodMate" 
                class="w-full max-w-lg rounded-xl shadow-2xl"
                loading="lazy"
              />
              
              <!-- Floating stats cards -->
              <div class="absolute -top-4 -left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg animate-fade-in-up" style="animation-delay: 1s;">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Analisis Real-time</span>
                </div>
              </div>
              
              <div class="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg animate-fade-in-up" style="animation-delay: 1.2s;">
                <div class="flex items-center space-x-2">
                  <span class="text-2xl">🎵</span>
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Smart Playlist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="py-20 bg-white dark:bg-gray-900 transition-colors duration-500">
      <div class="max-w-7xl mx-auto px-6 md:px-16">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Fitur <span class="text-gradient">Unggulan</span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Analisis mood cerdas dengan teknologi Machine Learning
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card-responsive bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900 p-8 rounded-2xl shadow-lg animate-fade-in-up" style="animation-delay: 0.2s;">
            <div class="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Analisis Mood</h3>
            <p class="text-gray-600 dark:text-gray-400">Algoritma machine learning untuk menganalisis emosi dari teks yang Anda tulis</p>
          </div>

          <!-- Feature 2 -->
          <div class="card-responsive bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900 p-8 rounded-2xl shadow-lg animate-fade-in-up" style="animation-delay: 0.4s;">
            <div class="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Rekomendasi Musik</h3>
            <p class="text-gray-600 dark:text-gray-400">Dapatkan playlist musik yang sesuai dengan suasana hati Anda saat ini</p>
          </div>

          <!-- Feature 3 -->
          <div class="card-responsive bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-green-900 p-8 rounded-2xl shadow-lg animate-fade-in-up" style="animation-delay: 0.6s;">
            <div class="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Aktivitas Saran</h3>
            <p class="text-gray-600 dark:text-gray-400">Rekomendasi aktivitas yang dapat membantu memperbaiki atau mempertahankan mood Anda</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="max-w-7xl mx-auto px-6 md:px-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Bagaimana Cara Kerjanya?</h2>
          <p class="text-blue-200 text-lg">Proses sederhana untuk memahami mood Anda</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center animate-fade-in-up" style="animation-delay: 0.1s;">
            <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold">1</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Tulis Cerita</h3>
            <p class="text-blue-200">Ceritakan pengalaman atau perasaan Anda hari ini</p>
          </div>
          
          <div class="text-center animate-fade-in-up" style="animation-delay: 0.2s;">
            <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold">2</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Analisis Mood</h3>
            <p class="text-blue-200">Menganalisis pola emosi secara otomatis dari tulisan Anda</p>
          </div>
          
          <div class="text-center animate-fade-in-up" style="animation-delay: 0.3s;">
            <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold">3</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Dapatkan Rekomendasi</h3>
            <p class="text-blue-200">Terima musik dan aktivitas yang sesuai mood Anda</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-500">
      <div class="max-w-4xl mx-auto text-center px-6 md:px-16">
        <div class="animate-fade-in-up">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Mengapa Memilih <span class="text-gradient">MoodMate</span>?
          </h2>
          
          <div class="max-w-3xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <!-- Keunggulan 1 -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cepat & Akurat</h3>
                  <p class="text-gray-600 dark:text-gray-400">Analisis mood dalam hitungan detik dengan teknologi terdepan</p>
                </div>
              </div>
              
              <!-- Keunggulan 2 -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Privasi Terjamin</h3>
                  <p class="text-gray-600 dark:text-gray-400">Data pribadi Anda aman dan tidak akan dibagikan kepada pihak ketiga</p>
                </div>
              </div>
              
              <!-- Keunggulan 3 -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Rekomendasi Personal</h3>
                  <p class="text-gray-600 dark:text-gray-400">Saran musik dan aktivitas yang disesuaikan dengan kepribadian Anda</p>
                </div>
              </div>
              
              <!-- Keunggulan 4 -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tersedia 24/7</h3>
                  <p class="text-gray-600 dark:text-gray-400">Kapan saja Anda membutuhkan, MoodMate siap membantu Anda</p>
                </div>
              </div>
            </div>
            
            <!-- Quote inspiratif -->
            <div class="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900 rounded-2xl">
              <blockquote class="text-center">
                <p class="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
                  "Memahami emosi adalah langkah pertama menuju kebahagiaan yang sejati"
                </p>
                <cite class="text-blue-600 dark:text-blue-400 font-semibold">— Tim MoodMate</cite>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
