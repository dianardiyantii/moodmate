import ApiService from "../../data/api.js";
import { db } from "../../utils/firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getRandomActivities } from "../../data/moodActivities";
import { getRandomSongs } from "../../data/moodSongs";

export default function RiwayatPresenter() {
  console.log("RiwayatPresenter initialized");

  let allJournals = [];
  let filteredJournals = [];
  let currentView = "calendar";
  let currentDate = new Date();
  let selectedMonth = currentDate.getMonth();
  let selectedYear = currentDate.getFullYear();
  let selectedMoodFilter = "all";

  const moodColors = {
    happy:
      "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200",
    sad: "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200",
    anger:
      "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200",
    fear: "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200",
    love: "bg-pink-100 border-pink-300 text-pink-800 dark:bg-pink-900/30 dark:border-pink-800 dark:text-pink-200",
    neutral:
      "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200",
  };

  const moodEmojis = {
    happy: "😊",
    sad: "😢",
    anger: "😠",
    fear: "😰",
    love: "💖",
    neutral: "😐",
  };

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

  setTimeout(() => {
    initializeRiwayatPage();
  }, 300);

  async function initializeRiwayatPage() {
    try {
      await setupEventListeners();
      await loadAllJournals();
      renderCurrentView();
    } catch (error) {
      console.error("Initialize error:", error);
      showNotification("Gagal memuat data riwayat", "error");
    }
  }

  function setupEventListeners() {
    // View toggle buttons
    const calendarViewBtn = document.getElementById("calendarViewBtn");
    const listViewBtn = document.getElementById("listViewBtn");

    if (calendarViewBtn) {
      calendarViewBtn.addEventListener("click", () => switchView("calendar"));
    }
    if (listViewBtn) {
      listViewBtn.addEventListener("click", () => switchView("list"));
    }

    const prevMonthBtn = document.getElementById("prevMonthBtn");
    const nextMonthBtn = document.getElementById("nextMonthBtn");

    if (prevMonthBtn) {
      prevMonthBtn.addEventListener("click", () => navigateMonth(-1));
    }
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener("click", () => navigateMonth(1));
    }

    const monthFilter = document.getElementById("monthFilter");
    const moodFilter = document.getElementById("moodFilter");

    if (monthFilter) {
      monthFilter.addEventListener("change", (e) => {
        const [year, month] = e.target.value.split("-");
        selectedYear = parseInt(year);
        selectedMonth = parseInt(month);
        filterAndRenderJournals();
      });
    }

    if (moodFilter) {
      moodFilter.addEventListener("change", (e) => {
        selectedMoodFilter = e.target.value;
        filterAndRenderJournals();
      });
    }

    const backBtn = document.getElementById("backToJournalBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        location.hash = "/journal";
      });
    }

    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalOverlay = document.getElementById("journalModal");

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal);
    }
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });
    }
  }

  async function loadAllJournals() {
    try {
      const userEmail = getCurrentUserEmail();
      if (!userEmail) {
        throw new Error("User email not found");
      }

      showLoading(true);

      const q = query(
        collection(db, "journal_entries"),
        where("userEmail", "==", userEmail),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      allJournals = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const processedEntry = processJournalData(doc.id, data);
        allJournals.push(processedEntry);
      });

      filterAndRenderJournals();
    } catch (error) {
      console.error("Error loading journals:", error);
      showNotification("Gagal memuat data riwayat", "error");
    } finally {
      showLoading(false);
    }
  }

  function processJournalData(id, data) {
    let processedDate;
    let processedTime;
    let dateObj;

    try {
      if (data.createdAt && data.createdAt.toDate) {
        dateObj = data.createdAt.toDate();
      } else if (data.createdAt) {
        dateObj = new Date(data.createdAt);
      } else {
        dateObj = new Date();
      }

      processedDate = dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      processedTime = dateObj.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error processing date:", error);
      dateObj = new Date();
      processedDate = dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      processedTime = dateObj.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return {
      id,
      ...data,
      tanggal: processedDate,
      waktu: processedTime, 
      dateObj: dateObj,
      mood: data.mood || "neutral",
      catatan: data.catatan || data.text || "",
      aktivitas:
        data.aktivitas || data.activities || data.selectedActivities || [],
    };
  }

  function filterAndRenderJournals() {
    filteredJournals = allJournals.filter((journal) => {
      const journalDate = journal.dateObj;
      const journalMonth = journalDate.getMonth();
      const journalYear = journalDate.getFullYear();

      const monthMatch =
        journalMonth === selectedMonth && journalYear === selectedYear;
      const moodMatch =
        selectedMoodFilter === "all" || journal.mood === selectedMoodFilter;

      return monthMatch && moodMatch;
    });

    renderCurrentView();
    updateFilterInfo();
  }

  function switchView(view) {
    currentView = view;

    const calendarBtn = document.getElementById("calendarViewBtn");
    const listBtn = document.getElementById("listViewBtn");

    if (calendarBtn && listBtn) {
      if (view === "calendar") {
        calendarBtn.classList.add("bg-blue-500", "text-white");
        calendarBtn.classList.remove("bg-gray-200", "text-gray-700");
        listBtn.classList.add("bg-gray-200", "text-gray-700");
        listBtn.classList.remove("bg-blue-500", "text-white");
      } else {
        listBtn.classList.add("bg-blue-500", "text-white");
        listBtn.classList.remove("bg-gray-200", "text-gray-700");
        calendarBtn.classList.add("bg-gray-200", "text-gray-700");
        calendarBtn.classList.remove("bg-blue-500", "text-white");
      }
    }

    renderCurrentView();
  }

  function renderCurrentView() {
    if (currentView === "calendar") {
      renderCalendarView();
    } else {
      renderListView();
    }
  }

  function renderCalendarView() {
    const container = document.getElementById("contentContainer");
    if (!container) return;

    const calendarHTML = generateCalendarHTML();
    container.innerHTML = calendarHTML;
    updateMonthYearDisplay();
  }

  function generateCalendarHTML() {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const daysInCalendar = 42;
    let calendarHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div class="grid grid-cols-7 gap-2 mb-4">
          <div class="text-center font-bold text-gray-600 dark:text-gray-300 py-2">Min</div>
          <div class="text-center font-bold text-gray-600 dark:text-gray-300 py-2">Sen</div>
          <div class="text-center font-bold text-gray-600 dark:text-gray-300 py-2">Sel</div>
          <div class="text-center font-bold text-gray-600 dark:text-gray-300 py-2">Rab</div>
          <div class="text-center font-bold text-gray-600 dark:text-gray-300 py-2">Kam</div>
          <div class="text-center font-bold text-gray-600 dark:text-gray-300 py-2">Jum</div>
          <div class="text-center font-bold text-gray-600 dark:text-gray-300 py-2">Sab</div>
        </div>
        <div class="grid grid-cols-7 gap-2">
    `;

    for (let i = 0; i < daysInCalendar; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const isCurrentMonth = currentDate.getMonth() === selectedMonth;
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const journalsForDay = getJournalsForDate(currentDate);

      const dayClasses = [
        "calendar-day min-h-[80px] p-2 rounded-lg border transition-all duration-200 cursor-pointer",
        isCurrentMonth
          ? "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          : "bg-gray-100 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400",
        isToday ? "ring-2 ring-blue-500" : "",
        journalsForDay.length > 0 ? "has-journals" : "",
      ].join(" ");

      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      calendarHTML += `
        <div class="${dayClasses}" data-date="${dateStr}" onclick="handleDateClick('${dateStr}')">
          <div class="text-sm font-semibold mb-1 ${
            isToday ? "text-blue-600" : ""
          }">${currentDate.getDate()}</div>
          ${
            journalsForDay.length > 0
              ? `
            <div class="space-y-1">
              ${journalsForDay
                .slice(0, 2)
                .map(
                  (journal) => `
                <div class="text-xs px-1 py-0.5 rounded ${
                  moodColors[journal.mood] || moodColors.neutral
                } truncate">
                  ${
                    moodEmojis[journal.mood] || "😐"
                  } ${journal.catatan.substring(0, 10)}${
                    journal.catatan.length > 10 ? "..." : ""
                  }
                </div>
              `
                )
                .join("")}
              ${
                journalsForDay.length > 2
                  ? `<div class="text-xs text-gray-500 font-medium">+${
                      journalsForDay.length - 2
                    } lainnya</div>`
                  : ""
              }
            </div>
          `
              : ""
          }
        </div>
      `;
    }

    calendarHTML += `
        </div>
      </div>
    `;

    return calendarHTML;
  }

  function renderListView() {
    const container = document.getElementById("contentContainer");
    if (!container) return;

    if (filteredJournals.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📖</div>
          <h3 class="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">Belum Ada Catatan</h3>
          <p class="text-gray-500 dark:text-gray-400">Tidak ada catatan journal untuk filter yang dipilih</p>
        </div>
      `;
      return;
    }

    const listHTML = `
      <div class="space-y-4">
        ${filteredJournals
          .map(
            (journal) => `
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 
                      hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
               onclick="openJournalDetail('${journal.id}')">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="text-3xl">${
                  moodEmojis[journal.mood] || "😐"
                }</span>
                <div>
                  <h3 class="font-bold text-lg text-gray-800 dark:text-white">${getMoodText(
                    journal.mood
                  )}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    ${journal.tanggal}
                    <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full ml-2">
                      ${journal.waktu}
                    </span>
                  </p>
                </div>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium ${
                moodColors[journal.mood] || moodColors.neutral
              }">
                ${getMoodText(journal.mood)}
              </span>
            </div>
            
            <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
              "${journal.catatan}"
            </p>
            
            ${
              journal.aktivitas && journal.aktivitas.length > 0
                ? `
              <div class="flex flex-wrap gap-2 mb-3">
                ${journal.aktivitas
                  .slice(0, 3)
                  .map(
                    (aktivitas) => `
                  <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 
                               rounded-lg text-xs font-medium">${aktivitas}</span>
                `
                  )
                  .join("")}
                ${
                  journal.aktivitas.length > 3
                    ? `
                  <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                               rounded-lg text-xs">+${
                                 journal.aktivitas.length - 3
                               } lainnya</span>
                `
                    : ""
                }
              </div>
            `
                : ""
            }
            
            <div class="text-right">
              <button class="text-blue-500 hover:text-blue-700 text-sm font-medium">
                Lihat Detail →
              </button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    container.innerHTML = listHTML;
  }

  function getJournalsForDate(date) {
    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const targetDateStr = targetDate.toDateString();

    return allJournals.filter((journal) => {
      const journalDate = new Date(
        journal.dateObj.getFullYear(),
        journal.dateObj.getMonth(),
        journal.dateObj.getDate()
      );

      const dateMatch = journalDate.toDateString() === targetDateStr;

      const moodMatch =
        selectedMoodFilter === "all" || journal.mood === selectedMoodFilter;

      return dateMatch && moodMatch;
    });
  }

  function navigateMonth(direction) {
    selectedMonth += direction;

    if (selectedMonth < 0) {
      selectedMonth = 11;
      selectedYear--;
    } else if (selectedMonth > 11) {
      selectedMonth = 0;
      selectedYear++;
    }

    updateMonthYearDisplay();
    filterAndRenderJournals();
  }

  function updateMonthYearDisplay() {
    const monthYearElement = document.getElementById("currentMonthYear");
    if (monthYearElement) {
      monthYearElement.textContent = `${monthNames[selectedMonth]} ${selectedYear}`;
    }
  }

  function updateFilterInfo() {
    const totalElement = document.getElementById("totalJournals");
    if (totalElement) {
      totalElement.textContent = `${filteredJournals.length} catatan`;
    }
  }

  window.handleDateClick = function (dateStr) {
    try {
      const [year, month, day] = dateStr.split("-").map((num) => parseInt(num));
      const targetDate = new Date(year, month - 1, day);
      const journalsForDay = getJournalsForDate(targetDate);

      if (journalsForDay.length > 0) {
        showDateJournals(targetDate, journalsForDay);
      } else {
        const message =
          selectedMoodFilter === "all"
            ? "Tidak ada catatan untuk tanggal ini"
            : `Tidak ada catatan dengan mood "${getMoodText(
                selectedMoodFilter
              )}" untuk tanggal ini`;
        showNotification(message, "info");
      }
    } catch (error) {
      console.error("Error handling date click:", error);
      showNotification("Terjadi kesalahan saat membuka catatan", "error");
    }
  };

  window.openJournalDetail = function (journalId) {
    const journal = allJournals.find((j) => j.id === journalId);
    if (journal) {
      showJournalModal(journal);
    }
  };

  let currentDateJournals = null;

  function showDateJournals(date, journals) {
    currentDateJournals = { date, journals };
    const formattedDate = date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const modalContent = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">${formattedDate}</h3>
          <p class="text-gray-600 dark:text-gray-300 font-medium">
            <span class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm">
              📊 ${journals.length} catatan ditemukan
            </span>
          </p>
        </div>
        
        <!-- Journals List -->
        <div class="space-y-3">
          ${journals
            .map(
              (journal) => `
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 
                        rounded-xl p-3 cursor-pointer hover:from-blue-50 hover:to-blue-100 
                        dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 
                        transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 
                        border border-gray-200 dark:border-gray-600"
                 onclick="openJournalDetail('${journal.id}')">
              <div class="flex items-center gap-3 mb-2">
                <div class="flex-shrink-0">
                  <span class="text-2xl">${
                    moodEmojis[journal.mood] || "😐"
                  }</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-base text-gray-800 dark:text-white">${getMoodText(
                    journal.mood
                  )}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    ${journal.waktu}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <span class="px-2 py-1 rounded-full text-xs font-medium ${
                    moodColors[journal.mood] || moodColors.neutral
                  }">
                    ${getMoodText(journal.mood)}
                  </span>
                </div>
              </div>
              <p class="text-gray-700 dark:text-gray-300 text-xs line-clamp-2 mb-2 italic">
                "${journal.catatan}"
              </p>
              <div class="flex justify-between items-center">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Klik untuk detail
                </div>
                <span class="text-blue-500 text-xs font-medium flex items-center gap-1">
                  Detail 
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    showModal(modalContent);
  }

  function showJournalModal(journal) {
    const recommendedSongs = getRandomSongs(journal.mood, 3);
    const recommendedActivities = getRandomActivities(journal.mood, 3);

    const modalContent = `
      <div class="space-y-6">
        <!-- Header Section -->
        <div class="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
        <button onclick="backToDateJournals()" class="flex items-center gap-2 text-blue-500 hover:text-blue-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Kembali
          </button>  
        <div class="flex items-center justify-center gap-4 mb-4">
            <div class="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 
                        rounded-full p-4 border-2 border-blue-200 dark:border-blue-700">
              <span class="text-5xl">${moodEmojis[journal.mood] || "😐"}</span>
            </div>
            <div class="text-left">
              <h3 class="text-3xl font-bold text-gray-800 dark:text-white mb-1">${getMoodText(
                journal.mood
              )}</h3>
              <p class="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <!-- SVG Tanggal (tetap sama) -->
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                ${journal.tanggal}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  ${journal.waktu}
              </p>
            </div>
          </div>
          
          <span class="px-6 py-2 rounded-full text-sm font-bold ${
            moodColors[journal.mood] || moodColors.neutral
          } shadow-lg">
            ${getMoodText(journal.mood)}
          </span>
        </div>
        
        <!-- Content Sections -->
        <div class="space-y-6">
          <!-- Catatan Section -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 
                      rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
            <h4 class="font-bold text-xl text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">📝</span> Catatan
            </h4>
            <div class="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 backdrop-blur-sm">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                "${journal.catatan}"
              </p>
            </div>
          </div>
          
          ${
            journal.aktivitas && journal.aktivitas.length > 0
              ? `
            <!-- Aktivitas Section -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 
                        rounded-2xl p-6 border border-green-200 dark:border-green-700">
              <h4 class="font-bold text-xl text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span class="text-2xl">🎯</span> Aktivitas yang Dilakukan
              </h4>
              <div class="flex flex-wrap gap-3">
                ${journal.aktivitas
                  .map(
                    (aktivitas) => `
                  <span class="px-4 py-2 bg-white/80 dark:bg-gray-800/80 text-green-800 dark:text-green-200 
                               rounded-xl text-sm font-medium shadow-sm border border-green-300 dark:border-green-600
                               hover:shadow-md transition-shadow">
                    ${aktivitas}
                  </span>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
          
          <!-- Rekomendasi Aktivitas -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/30 
                      rounded-2xl p-5 border border-amber-200 dark:border-amber-700">
            <h4 class="font-bold text-lg text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-xl">🌟</span> Rekomendasi Aktivitas
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              ${recommendedActivities
                .map(
                  (activity) => `
                <div class="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 border border-amber-300 dark:border-amber-600
                            hover:shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-300">
                  <div class="flex items-start gap-2">
                    <span class="text-lg flex-shrink-0">🎯</span>
                    <p class="text-gray-700 dark:text-gray-300 text-xs font-medium">${activity}</p>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
          
          <!-- Rekomendasi Lagu -->
          <div class="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30 
                      rounded-2xl p-5 border border-purple-200 dark:border-purple-700">
            <h4 class="font-bold text-lg text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-xl">🎵</span> Rekomendasi Lagu
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              ${recommendedSongs
                .map(
                  (song) => `
                <div class="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 border border-purple-300 dark:border-purple-600
                            hover:shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-300">
                  <div class="flex items-start gap-2">
                    <span class="text-lg flex-shrink-0">${
                      song.emoji || "🎵"
                    }</span>
                    <div class="flex-1">
                      <h5 class="font-bold text-gray-800 dark:text-white text-xs mb-1">${
                        song.title
                      }</h5>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">${
                        song.artist
                      }</p>
                      <a href="${song.link}" target="_blank" 
                         class="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 
                                text-xs font-medium inline-flex items-center gap-1 hover:underline">
                        <span>Dengarkan</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
        
        <div class="flex-shrink-0 flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button onclick="viewJournalResult('${journal.id}')" 
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Lihat Hasil
          </button>
        </div>
      </div>
    `;

    showModal(modalContent);
  }

  window.backToDateJournals = function () {
    if (currentDateJournals) {
      showDateJournals(currentDateJournals.date, currentDateJournals.journals);
    } else {
      closeModal();
    }
  };

  function showModal(content) {
    const modal = document.getElementById("journalModal");
    const modalBody = document.getElementById("journalModalBody");

    if (modal && modalBody) {
      modalBody.innerHTML = content;
      modal.classList.remove("hidden");
      modal.classList.add("show");
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        const modalContent = modal.querySelector(".modal-content");
        if (modalContent) {
          modalContent.style.transform = "scale(1)";
          modalContent.style.opacity = "1";
        }
      }, 10);
    }
  }

  function closeModal() {
    const modal = document.getElementById("journalModal");
    if (modal) {
      const modalContent = modal.querySelector(".modal-content");
      if (modalContent) {
        modalContent.style.transform = "scale(0.95)";
        modalContent.style.opacity = "0";
      }

      setTimeout(() => {
        modal.classList.add("hidden");
        modal.classList.remove("show");
        document.body.style.overflow = "auto";
      }, 200);
    }
  }

  window.viewJournalResult = function (journalId) {
    localStorage.setItem("selectedEntryId", journalId);
    location.hash = "/hasil";
  };

  function getMoodText(mood) {
    const moodTexts = {
      happy: "Senang",
      sad: "Sedih",
      anger: "Marah",
      fear: "Cemas",
      love: "Penuh Cinta",
      neutral: "Netral",
    };
    return moodTexts[mood] || "Netral";
  }

  function getCurrentUserEmail() {
    return (
      localStorage.getItem("moodmate-current-user") ||
      JSON.parse(localStorage.getItem("moodmate-user") || "{}")?.email
    );
  }

  function showLoading(show) {
    const loadingElement = document.getElementById("loadingIndicator");
    if (loadingElement) {
      if (show) {
        loadingElement.classList.remove("hidden");
      } else {
        loadingElement.classList.add("hidden");
      }
    }
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 p-6 rounded-2xl shadow-2xl z-50 transition-all duration-500 transform translate-x-full max-w-sm border ${
      type === "success"
        ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400"
        : type === "error"
          ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400"
          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400"
    }`;

    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-xl">${
          type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"
        }</span>
        <p class="font-medium">${message}</p>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 4000);
  }
}
