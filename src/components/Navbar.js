import { UserModel } from "../models/UserModel.js"; 
import ApiService from "../services/apiService.js"; 

console.log("UserModel di dalam Navbar:", UserModel);
export const renderNavbar = () => {
  const app = document.getElementById("app");
  let nav = app.querySelector("nav");

  const isLoggedIn = localStorage.getItem("moodmate-logged-in") === "true";

  const currentHash = window.location.hash || "#/";

  const getActiveClass = (path) => {
    return currentHash === path
      ? "bg-blue-600 text-white px-3 py-2 rounded-full shadow-lg transform scale-105"
      : "hover:text-blue-600 hover:bg-blue-50 hover:shadow-md hover:scale-105 px-3 py-2 rounded-full transition-all duration-300 ease-in-out";
  };

  const getMobileActiveClass = (path) => {
    return currentHash === path
      ? "mobile-menu-item active"
      : "mobile-menu-item";
  };

  const DEFAULT_PHOTO =
    "/images/profile.png";

  const getCurrentUserProfilePhoto = async () => {
    try {
      const photoFromStorage = UserModel.getProfilePhoto();
      if (photoFromStorage) {
        return photoFromStorage;
      }

      const userData = await UserModel.getProfile();
      if (userData && userData.profilePhoto) {
        return userData.profilePhoto;
      }

      return DEFAULT_PHOTO;
    } catch (error) {
      console.error("Error loading profile photo:", error);
      return DEFAULT_PHOTO;
    }
  };

  const navHTML = `
    <div class="flex items-center space-x-3">
      <img src="/images/favicon.png" class="h-12" alt="Logo" />
      <span class="font-extrabold text-xl md:text-2xl">MOODMATE</span>
    </div>
    
    <!-- Desktop Menu -->
    <ul class="hidden md:flex text-base md:text-lg items-center desktop-menu" style="gap:1rem;">

      ${
        !isLoggedIn
          ? `<li><a href="#/" class="${getActiveClass("#/")}">Home</a></li>
           <li><a href="#/about" class="${getActiveClass(
             "#/about"
           )}">About</a></li>
           <li><a href="#/contact" class="${getActiveClass(
             "#/contact"
           )}">Contact</a></li>
           <li><a href="#/login" class="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out font-semibold ml-4 transform btn-transition">Login</a></li>
           <li><a href="#/register" class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-in-out font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 btn-transition">Register</a></li>`
          : `<li><a href="#/dashboard" class="${getActiveClass(
              "#/dashboard"
            )}">Dashboard</a></li>
           <li><a href="#/journal" class="${getActiveClass(
             "#/journal"
           )}">Catatan</a></li>
           <li><a href="#/riwayat" class="${getActiveClass(
             "#/riwayat"
           )}">Riwayat</a></li>
           <li class="relative group ml-4">
              <img src="${DEFAULT_PHOTO}" class="h-10 w-10 rounded-full cursor-pointer border-2 ${
                currentHash === "#/profil"
                  ? "border-blue-600 shadow-lg scale-105"
                  : "border-transparent hover:border-gray-300 hover:shadow-md hover:scale-105"
              } transition-all duration-300 ease-in-out transform object-cover" id="profileToggle" />
              <div class="profile-dropdown absolute top-full right-0 bg-white dark:bg-gray-700 shadow-xl rounded-lg w-44 mt-2 text-base border dark:border-gray-600" id="profileDropdown">
                <a href="#/profil" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white hover:pl-6 transition-all duration-200 ease-in-out ${
                  currentHash === "#/profil"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : ""
                }"><i class="fas fa-user mr-2"></i> Profil</a>
                <a href="#" id="toggleDarkMode" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white hover:pl-6 transition-all duration-200 ease-in-out"><i class="fas fa-moon mr-2"></i> Dark Mode</a>
                <a href="#" id="logoutBtn" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white hover:pl-6 transition-all duration-200 ease-in-out"><i class="fas fa-sign-out-alt mr-2"></i> Logout</a>
              </div>
           </li>`
      }
    </ul>

    <!-- Mobile Menu Button -->
    <button class="mobile-menu-toggle" id="mobileMenuBtn" aria-label="Toggle mobile menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  `;

  if (!nav) {
    nav = document.createElement("nav");
    nav.className =
      "fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-10 py-4 bg-white/90 dark:bg-gray-800/90 shadow backdrop-blur-md";
    nav.style.height = "80px";
    app.prepend(nav);
  }

  nav.innerHTML = navHTML;

  const updateNavbarProfilePhoto = async () => {
    if (isLoggedIn) {
      const profileImg = document.getElementById("profileToggle");
      if (profileImg) {
        try {
          const photoData = await getCurrentUserProfilePhoto();
          profileImg.src = photoData;
        } catch (error) {
          console.error("Error updating navbar profile photo:", error);
          profileImg.src = DEFAULT_PHOTO;
        }
      }
    }
  };

  const createMobileMenu = () => {
    const existingMenu = document.getElementById("mobileMenu");
    const existingOverlay = document.getElementById("mobileOverlay");
    if (existingMenu) existingMenu.remove();
    if (existingOverlay) existingOverlay.remove();

    const overlay = document.createElement("div");
    overlay.id = "mobileOverlay";
    overlay.className = "mobile-menu-overlay";
    document.body.appendChild(overlay);

    const mobileMenu = document.createElement("div");
    mobileMenu.id = "mobileMenu";
    mobileMenu.className = "mobile-menu";

    const mobileMenuContent = `
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-3">
          <img src="/images/favicon.png" class="h-8" alt="Logo" />
          <span class="font-bold text-lg">MOODMATE</span>
        </div>
        <button id="closeMobileMenu" class="text-2xl">×</button>
      </div>
      
      <div class="space-y-0">
        ${
          !isLoggedIn
            ? `<a href="#/" class="${getMobileActiveClass(
                "#/"
              )}" data-close-menu><i class="fas fa-home mr-2"></i> Home</a>
             <a href="#/about" class="${getMobileActiveClass(
               "#/about"
             )}" data-close-menu><i class="fas fa-info-circle mr-2"></i> About</a>
             <a href="#/contact" class="${getMobileActiveClass(
               "#/contact"
             )}" data-close-menu><i class="fas fa-phone mr-2"></i> Contact</a>
             <div class="pt-4 space-y-3">
               <a href="#/login" class="block w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg text-center font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300" data-close-menu><i class="fas fa-sign-in-alt mr-2"></i> Login</a>
               <a href="#/register" class="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300" data-close-menu><i class="fas fa-user-plus mr-2"></i> Register</a>
             </div>`
            : `<a href="#/dashboard" class="${getMobileActiveClass(
                "#/dashboard"
              )}" data-close-menu><i class="fas fa-tachometer-alt mr-2"></i> Dashboard</a>
             <a href="#/journal" class="${getMobileActiveClass(
               "#/journal"
             )}" data-close-menu><i class="fas fa-book mr-2"></i> Catatan</a>
             <a href="#/riwayat" class="${getMobileActiveClass(
               "#/riwayat"
             )}" data-close-menu><i class="fas fa-history mr-2"></i> Riwayat</a>
             <a href="#/profil" class="${getMobileActiveClass(
               "#/profil"
             )}" data-close-menu><i class="fas fa-user mr-2"></i> Profil</a>
             <div class="pt-4 space-y-3 border-t border-gray-200 dark:border-gray-600">
               <button id="mobileToggleDarkMode" class="block w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"><i class="fas fa-moon mr-2"></i> Dark Mode</button>
               <button id="mobileLogoutBtn" class="block w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"><i class="fas fa-sign-out-alt mr-2"></i> Logout</button>
             </div>`
        }
      </div>
    `;

    mobileMenu.innerHTML = mobileMenuContent;
    document.body.appendChild(mobileMenu);

    return { mobileMenu, overlay };
  };

  const { mobileMenu, overlay } = createMobileMenu();

  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const closeMobileMenu = document.getElementById("closeMobileMenu");

  const toggleMobileMenu = (show = null) => {
    const isOpen = mobileMenu.classList.contains("open");
    const shouldOpen = show !== null ? show : !isOpen;

    mobileMenuBtn.classList.toggle("active", shouldOpen);
    mobileMenu.classList.toggle("open", shouldOpen);
    overlay.classList.toggle("active", shouldOpen);

    document.body.style.overflow = shouldOpen ? "hidden" : "";
  };

  mobileMenuBtn?.addEventListener("click", () => toggleMobileMenu());
  closeMobileMenu?.addEventListener("click", () => toggleMobileMenu(false));
  overlay?.addEventListener("click", () => toggleMobileMenu(false));

  mobileMenu.querySelectorAll("[data-close-menu]").forEach((item) => {
    item.addEventListener("click", () => {
      setTimeout(() => toggleMobileMenu(false), 100);
    });
  });

  const profileToggle = document.getElementById("profileToggle");
  const profileDropdown = document.getElementById("profileDropdown");

  let profileDropdownTimeout;

  if (profileToggle && profileDropdown) {
    const showProfileDropdown = () => {
      clearTimeout(profileDropdownTimeout);
      profileDropdown.classList.add("show");
    };

    const hideProfileDropdown = () => {
      profileDropdownTimeout = setTimeout(() => {
        profileDropdown.classList.remove("show");
      }, 150);
    };

    profileToggle.addEventListener("mouseenter", showProfileDropdown);
    profileToggle.addEventListener("mouseleave", hideProfileDropdown);
    profileDropdown.addEventListener("mouseenter", showProfileDropdown);
    profileDropdown.addEventListener("mouseleave", hideProfileDropdown);

    profileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      profileDropdown &&
      !profileDropdown.contains(e.target) &&
      !profileToggle?.contains(e.target)
    ) {
      profileDropdown.classList.remove("show");
    }
  });

  const setupLogout = (buttonId) => {
    const logoutBtn = document.getElementById(buttonId);
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await ApiService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        }
        localStorage.removeItem("moodmate-session-id");
        localStorage.removeItem("moodmate-logged-in");
        localStorage.removeItem("moodmate-current-user");
        localStorage.removeItem("moodmate-user");
        localStorage.removeItem("profile_photo");

        toggleMobileMenu(false);
        window.location.hash = "/login";
      });
    }
  };

  setupLogout("logoutBtn");
  setupLogout("mobileLogoutBtn");

  const setupDarkMode = (buttonId) => {
    const darkToggle = document.getElementById(buttonId);
    if (darkToggle) {
      const isDark = document.body.classList.contains("dark");
      darkToggle.innerHTML = isDark
        ? '<i class="fas fa-sun mr-2"></i> Light Mode'
        : '<i class="fas fa-moon mr-2"></i> Dark Mode';

      darkToggle.addEventListener("click", (e) => {
        e.preventDefault();
        const isDark = document.body.classList.toggle("dark");
        localStorage.setItem("moodmate-theme", isDark ? "dark" : "light");

        darkToggle.innerHTML = isDark
          ? '<i class="fas fa-sun mr-2"></i> Light Mode'
          : '<i class="fas fa-moon mr-2"></i> Dark Mode';

        if (buttonId === "toggleDarkMode") {
          const mobileToggle = document.getElementById("mobileToggleDarkMode");
          if (mobileToggle) {
            mobileToggle.innerHTML = isDark
              ? '<i class="fas fa-sun mr-2"></i> Light Mode'
              : '<i class="fas fa-moon mr-2"></i> Dark Mode';
          }
        } else if (buttonId === "mobileToggleDarkMode") {
          const desktopToggle = document.getElementById("toggleDarkMode");
          if (desktopToggle) {
            desktopToggle.innerHTML = isDark
              ? '<i class="fas fa-sun mr-2"></i> Light Mode'
              : '<i class="fas fa-moon mr-2"></i> Dark Mode';
          }
        }
      });
    }
  };

  setupDarkMode("toggleDarkMode");
  setupDarkMode("mobileToggleDarkMode");

  const savedTheme = localStorage.getItem("moodmate-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  } else if (savedTheme === "light") {
    document.body.classList.remove("dark");
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      toggleMobileMenu(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      toggleMobileMenu(false);
    }
  });

  updateNavbarProfilePhoto();

  window.addEventListener("profilePhotoUpdated", (event) => {
    const profileImg = document.getElementById("profileToggle");
    if (profileImg && event.detail && event.detail.photoData) {
      profileImg.src = event.detail.photoData;
    }
  });
};

window.addEventListener("hashchange", () => {
  renderNavbar();
});