import './assets/styles/tailwind.css';
import { renderNavbar } from './components/Navbar';
import { renderFooter } from './components/Footer';
import router from './routes/router';

const setupMainContent = () => {
  const app = document.getElementById('app');
  let main = document.getElementById('main-content');
  if (!main) {
    main = document.createElement('main');
    main.id = 'main-content';
    main.className = 'pt-16 px-4 min-h-screen';
    app.appendChild(main);
  }
};

const setupTheme = () => {
  const darkMode = localStorage.getItem('moodmate-dark-mode');
  if (darkMode === 'true') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const setupDarkModeToggle = () => {
  const toggleElements = [
    document.getElementById('toggleDarkMode'),
    document.getElementById('mobileToggleDarkMode'),
  ];

  toggleElements.forEach(el => {
    if (el) {
      el.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('moodmate-dark-mode', isDark.toString());
      });
    }
  });
};

const initApp = async () => {
  renderNavbar();          
  setupMainContent();     
  renderFooter();          
  setupTheme();           
  await router();       
  setupDarkModeToggle();  
};

window.addEventListener('hashchange', () => {
  router().then(() => {
    renderNavbar();        
    setupDarkModeToggle(); 
  });
});

window.addEventListener('DOMContentLoaded', initApp);
