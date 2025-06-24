export default async function ContactView() {
  return `
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 mt-4 pt-12 pb-20 transition-colors duration-500">
      <div class="max-w-6xl mx-auto px-6 md:px-16 text-center">
        <div class="animate-fade-in-up">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Tim MoodMate
          </div>
          
          <h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Bertemu dengan <span class="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text">Tim Kami</span>
          </h2>
          
          <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
            Kenali orang-orang luar biasa di balik MoodMate yang berdedikasi untuk menciptakan pengalaman terbaik dalam perjalanan kesehatan mental Anda.
          </p>
          
          <p class="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-2xl mx-auto">
            Tim multidisiplin kami terdiri dari developer, designer, dan spesialis yang berkomitmen untuk inovasi berkelanjutan.
          </p>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-white dark:bg-gray-900 transition-colors duration-500">
      <div class="max-w-6xl mx-auto px-6 md:px-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          ${[
            {
              name: "Muhammad Rozagi",
              role: "ML Engineer",
              email: "muhammadrozagi09@gmail.com",
              instagram: "zgiii_mr",
              linkedin: "muhammadrozagi",
              img: "/contact/jagi.jpg",
              gradient: "from-blue-500 to-indigo-500",
            },
            {
              name: "Ulfa Stevi Juliana",
              role: "ML Engineer",
              email: "steviulpa@gmail.com",
              instagram: "stevijuliana",
              linkedin: "ulfa-stevi-juliana-094365180",
              img: "/contact/Ulfa.jpg",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              name: "Jevon Ordrick",
              role: "ML Engineer",
              email: "jevonordrick53@gmail.com",
              instagram: "jeevonn_",
              linkedin: "jevon-ordrick-6583812b1",
              img: "/contact/Jevon.jpeg",
              gradient: "from-green-500 to-emerald-500",
            },
            {
              name: "Merly Yuni Purnama",
              role: "Backend Developer",
              email: "merlyyunipurnama@gmail.com",
              instagram: "merlyyunii",
              linkedin: "merly-yuni-purnama",
              img: "/contact/Merly.jpg",
              gradient: "from-orange-500 to-red-500",
            },
            {
              name: "Dian Ardiyanti Saputri",
              role: "Frontend Developer",
              email: "dianardiyantii09@gmail.com",
              instagram: "dianardiyantii",
              linkedin: "dianardiyantisaputri",
              img: "/contact/dian.jpg",
              gradient: "from-pink-500 to-rose-500",
            },
            {
              name: "Reisya Septriana",
              role: "UI & UX Designer",
              email: "reisya.septriana03@gmail.com",
              instagram: "reveriechaa",
              linkedin: "reisya-septriana-rizky-humaira-990b5b1b3",
              img: "/contact/Reisya.jpg",
              gradient: "from-teal-500 to-cyan-500",
            },
          ]
            .map(
              (member, index) => `
            <div class="card-responsive bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-8 text-center
                        transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
                        animate-fade-in-up border border-gray-100 dark:border-gray-700" 
                 style="animation-delay: ${index * 0.1}s;">
              <div class="relative mb-6">
                <div class="absolute inset-0 bg-gradient-to-r ${
                  member.gradient
                } rounded-full blur-lg opacity-30 scale-110"></div>
                <img src="${member.img}" 
                     alt="${member.name}" 
                     class="relative w-24 h-24 mx-auto rounded-full border-4 border-white dark:border-gray-700 object-cover shadow-lg" 
                     loading="lazy" />
              </div>
              
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${
                member.name
              }</h3>
              <p class="text-sm font-semibold text-transparent bg-gradient-to-r ${
                member.gradient
              } bg-clip-text mb-3">${member.role}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                ${member.email}
              </p>
              
              <div class="flex justify-center space-x-4">
                <a href="https://instagram.com/${member.instagram}" 
                   target="_blank" 
                   class="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.735-3.016-1.804-.225-.424-.225-.735 0-1.159.568-1.069 1.719-1.804 3.016-1.804s2.448.735 3.016 1.804c.225.424.225.735 0 1.159-.568 1.069-1.719 1.804-3.016 1.804zm7.718 0c-1.297 0-2.448-.735-3.016-1.804-.225-.424-.225-.735 0-1.159.568-1.069 1.719-1.804 3.016-1.804s2.448.735 3.016 1.804c.225.424.225.735 0 1.159-.568 1.069-1.719 1.804-3.016 1.804z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/${member.linkedin}" 
                   target="_blank" 
                   class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </section>

    <!-- Contact Information -->
    <section class="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-500">
      <div class="max-w-6xl mx-auto px-6 md:px-16">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hubungi <span class="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Kami</span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400">
            Kami siap membantu Anda dalam perjalanan kesehatan mental
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Contact Info 1 -->
          <div class="text-center animate-fade-in-up" style="animation-delay: 0.1s;">
            <div class="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Email Kami</h3>
            <p class="text-gray-600 dark:text-gray-400">info@moodmate.com</p>
            <p class="text-gray-600 dark:text-gray-400">support@moodmate.com</p>
          </div>

          <!-- Contact Info 2 -->
          <div class="text-center animate-fade-in-up" style="animation-delay: 0.2s;">
            <div class="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Lokasi</h3>
            <p class="text-gray-600 dark:text-gray-400">Jakarta, Indonesia</p>
            <p class="text-gray-600 dark:text-gray-400">Remote Team</p>
          </div>

          <!-- Contact Info 3 -->
          <div class="text-center animate-fade-in-up" style="animation-delay: 0.3s;">
            <div class="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Jam Kerja</h3>
            <p class="text-gray-600 dark:text-gray-400">Senin - Jumat</p>
            <p class="text-gray-600 dark:text-gray-400">09:00 - 17:00 WIB</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="max-w-4xl mx-auto text-center px-6 md:px-16">
        <div class="animate-fade-in-up">
          <h2 class="text-4xl font-bold mb-6">
            Ada Pertanyaan Untuk Tim Kami?
          </h2>
          <p class="text-xl text-blue-100 mb-10">
            Jangan ragu untuk menghubungi kami. Kami siap membantu Anda dengan senang hati
          </p>
          
          <a href="mailto:info@moodmate.com" class="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg btn-transition transform hover:scale-105">
            <span>Kirim Email</span>
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `;
}
