export const renderFooter = () => {
  const footer = document.createElement('footer');
  footer.className = "text-center p-4 bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 mt-10";
  footer.innerHTML = `&copy; ${new Date().getFullYear()} MoodMate. All rights reserved.`;
  document.body.appendChild(footer);
};
