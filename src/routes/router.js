import HomeView from "../views/home/HomeView";
import LoginView from "../views/login/LoginView";
import RegisterView from "../views/register/RegisterView";
import DashboardView from "../views/dashboard/DashboardView";
import JournalView from "../views/journal/JournalView";
import RiwayatView from "../views/riwayat/RiwayatView";
import ProfilView from "../views/profil/ProfilView";
import AboutView from "../views/about/AboutView";
import ContactView from "../views/contact/ContactView";
import JournalResultView from "../views/hasil/HasilView";

import { renderNavbar } from "../components/Navbar";

import DashboardPresenter from "../views/dashboard/DashboardPresenter";
import JournalPresenter from "../views/journal/JournalPresenter";
import ContactPresenter from "../views/contact/ContactPresenter";
import HasilPresenter from "../views/hasil/HasilPresenter";
import RiwayatPresenter from "../views/riwayat/RiwayatPresenter";
import LoginPresenter from "../views/login/LoginPresenter";
import RegisterPresenter from "../views/register/RegisterPresenter";
import ProfilPresenter from "../views/profil/ProfilPresenter";

const routes = {
  "/": HomeView,
  "/login": LoginView,
  "/register": RegisterView,
  "/dashboard": DashboardView,
  "/journal": JournalView,
  "/riwayat": RiwayatView,
  "/profil": ProfilView,
  "/about": AboutView,
  "/contact": ContactView,
  "/hasil": JournalResultView,
};

const presenters = {
  "/dashboard": DashboardPresenter,
  "/journal": JournalPresenter,
  "/contact": ContactPresenter,
  "/hasil": HasilPresenter,
  "/riwayat": RiwayatPresenter,
  "/login": LoginPresenter,
  "/register": RegisterPresenter,
  "/profil": ProfilPresenter,
};

let isNavigating = false;
let currentPage = null;

const ensureMainContainer = () => {
  const app = document.getElementById("app");
  let main = document.getElementById("main-content");

  if (!main) {
    main = document.createElement("main");
    main.id = "main-content";
    main.className = "pt-16 px-4";
    app.appendChild(main);
  }

  return main;
};

const transitionToPage = async (render, presenter, path) => {
  if (isNavigating) return;
  isNavigating = true;

  const main = ensureMainContainer();

  try {
    if (currentPage !== path && main.innerHTML.trim() !== "") {
      main.classList.add("page-transition-exit");
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          main.classList.add("page-transition-exit-active");
          setTimeout(resolve, 300);
        });
      });
    }

    main.classList.add("page-loading");

    const newContent = await render();
    main.innerHTML = newContent;

    main.classList.remove(
      "page-transition-exit",
      "page-transition-exit-active",
      "page-loading"
    );
    main.classList.add("page-transition-enter");

    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        main.classList.add("page-transition-enter-active");
        setTimeout(resolve, 50);
      });
    });

    setTimeout(() => {
      main.classList.remove(
        "page-transition-enter",
        "page-transition-enter-active"
      );

      if (presenter) {
        try {
          presenter();
        } catch (error) {
          console.error("Error running presenter:", error);
        }
      }

      currentPage = path;
      isNavigating = false;
    }, 500);
  } catch (error) {
    console.error("Error during page transition:", error);

    main.innerHTML = await render();
    main.classList.remove(
      "page-loading",
      "page-transition-exit",
      "page-transition-exit-active"
    );

    if (presenter) {
      try {
        presenter();
      } catch (presenterError) {
        console.error("Error running presenter:", presenterError);
      }
    }

    currentPage = path;
    isNavigating = false;
  }
};

const router = async () => {
  renderNavbar();

  const hash = window.location.hash || "#/";
  const path = hash.replace("#", "");
  const render = routes[path] || HomeView;
  const presenter = presenters[path];

  await transitionToPage(render, presenter, path);
};

let navigationTimeout = null;

const handleNavigation = () => {
  if (navigationTimeout) {
    clearTimeout(navigationTimeout);
  }

  navigationTimeout = setTimeout(async () => {
    await router();
  }, 50);
};

const navigateTo = (path) => {
  if (window.location.hash === `#${path}`) return;
  window.location.hash = path;
};

window.addEventListener("userLoggedIn", () => {
  renderNavbar();
});

window.addEventListener("userLoggedOut", () => {
  renderNavbar();
});

window.addEventListener("hashchange", handleNavigation);
window.addEventListener("DOMContentLoaded", () => {
  currentPage = null;
  router();
});

const preloadPage = async (path) => {
  const render = routes[path];
  if (render && typeof render === "function") {
    try {
      await render();
    } catch (error) {
      console.warn("Failed to preload page:", path, error);
    }
  }
};

const handleSkipToContent = () => {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
    window.scrollTo({
      top: mainContent.offsetTop - 20,
      behavior: 'smooth',
    });
  }
};

export { navigateTo, preloadPage, handleSkipToContent };
export default router;
