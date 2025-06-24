import Chart from "chart.js/auto";
import ApiService from "../../data/api.js";
import { db } from "../../utils/firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";

export default function DashboardPresenter() {
  const moodConfig = {
    sad: {
      number: 1,
      icon: "😢",
      text: "Sedih",
      color: "rgba(239, 68, 68, 0.8)",
    },
    anxious: {
      number: 2,
      icon: "😰",
      text: "Cemas",
      color: "rgba(245, 158, 11, 0.8)",
    },
    neutral: {
      number: 3,
      icon: "😐",
      text: "Netral",
      color: "rgba(156, 163, 175, 0.8)",
    },
    angry: {
      number: 4,
      icon: "😠",
      text: "Marah",
      color: "rgba(251, 146, 60, 0.8)",
    },
    happy: {
      number: 5,
      icon: "😊",
      text: "Senang",
      color: "rgba(34, 197, 94, 0.8)",
    },
    love: {
      number: 6,
      icon: "💖",
      text: "Penuh Cinta",
      color: "rgba(236, 72, 153, 0.8)",
    },
  };

  const moodMapping = {
    sad: "sad",
    anxious: "fear",
    neutral: "neutral",
    angry: "anger",
    happy: "happy",
    love: "love",
  };

  let currentPeriod = 7;
  let currentChartType = "bar";
  let chart = null;
  let journalData = [];

  function getLocalDateString(date) {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getTodayDateString() {
    return getLocalDateString(new Date());
  }

  function createLocalDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  async function initDashboard() {
    try {
      if (!getCurrentUser()) {
        location.hash = "/login";
        return;
      }

      await updateStats();
      setupEventListeners();
    } catch (error) {
      console.error("Dashboard init error:", error);
      showNotification("Gagal memuat dashboard", "error");
    }
  }

  async function fetchJournalData() {
    try {
      const userEmail = getCurrentUser();
      const q = query(
        collection(db, "journal_entries"),
        where("userEmail", "==", userEmail),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      journalData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const firebaseDate = data.createdAt?.toDate() || new Date();

        return {
          id: doc.id,
          ...data,
          date: firebaseDate,
          dateString: getLocalDateString(firebaseDate),
        };
      });

      console.log("Fetched journal data:", journalData.length);
      return journalData;
    } catch (error) {
      console.error("Fetch error:", error);
      showNotification("Gagal memuat data journal", "error");
      return [];
    }
  }

  async function updateStats() {
    await fetchJournalData();

    setElementText("totalLogs", journalData.length);

    const streak = calculateStreak(journalData);
    setElementText("streak", streak);

    // Perbaikan untuk dominant mood
    if (journalData.length === 0) {
      setElementText("dominantMood", "Belum Ada Data");
      setElementHtml("dominantMoodIcon", "❓");
    } else {
      const dominantMood = getDominantMood(journalData);
      if (dominantMood) {
        setElementText("dominantMood", moodConfig[dominantMood].text);
        setElementHtml("dominantMoodIcon", moodConfig[dominantMood].icon);
      }
    }

    updateTodayMood(journalData);

    updateWeeklyStats(journalData);

    updateMonthlyStats(journalData);

    updateOverallMoodStats(journalData);

    updateChart(currentPeriod, currentChartType);

    setElementText("lastSync", new Date().toLocaleTimeString("id-ID"));
  }

  function getCurrentUser() {
    return (
      localStorage.getItem("moodmate-current-user") ||
      JSON.parse(localStorage.getItem("moodmate-user") || "{}")?.email
    );
  }

  function calculateStreak(entries) {
    let streak = 0;
    const today = getTodayDateString();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = getLocalDateString(checkDate);

      const hasEntry = entries.some(
        (entry) => entry.dateString === checkDateStr
      );

      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  function getDominantMood(entries) {
    // Tambahkan pengecekan jika tidak ada entries
    if (!entries || entries.length === 0) {
      return null;
    }

    const moodGroups = {};

    Object.keys(moodConfig).forEach((mood) => {
      moodGroups[mood] = [];
    });

    entries.forEach((entry) => {
      const entryMood = entry.mood?.toLowerCase();
      const moodKey = Object.keys(moodConfig).find((key) => {
        const mappedMood = moodMapping[key] || key;
        return entryMood === key.toLowerCase() || entryMood === mappedMood;
      });

      if (moodKey && moodGroups[moodKey]) {
        moodGroups[moodKey].push(entry);
      }
    });

    const moodStats = Object.keys(moodConfig).map((mood) => {
      const moodEntries = moodGroups[mood];
      const count = moodEntries.length;
      const latestEntry = moodEntries.reduce((latest, current) => {
        if (!latest) return current;

        const latestTime =
          latest.createdAt?.toDate?.() || latest.date || new Date(0);
        const currentTime =
          current.createdAt?.toDate?.() || current.date || new Date(0);

        return currentTime > latestTime ? current : latest;
      }, null);

      return {
        mood,
        count,
        latestEntry,
        latestTimestamp: latestEntry
          ? latestEntry.createdAt?.toDate?.() || latestEntry.date || new Date(0)
          : new Date(0),
      };
    });

    const validMoodStats = moodStats.filter((stat) => stat.count > 0);

    if (validMoodStats.length === 0) {
      return null; // Kembalikan null jika tidak ada mood yang valid
    }

    validMoodStats.sort((a, b) => {
      if (a.count !== b.count) {
        return b.count - a.count;
      }

      return b.latestTimestamp - a.latestTimestamp;
    });

    return validMoodStats[0].mood;
  }

  function updateTodayMood(entries) {
    const todayStr = getTodayDateString();
    const todayEntries = entries.filter(
      (entry) => entry.dateString === todayStr
    );

    if (todayEntries.length === 0) {
      setElementText("todayMood", "Belum Ada");
      setElementHtml("todayMoodIcon", "❓");
      return;
    }

    if (todayEntries.length === 1) {
      const mood = todayEntries[0].mood?.toLowerCase() || "neutral";
      const moodKey =
        Object.keys(moodConfig).find((key) => key === mood) || "neutral";
      setElementText("todayMood", moodConfig[moodKey].text);
      setElementHtml("todayMoodIcon", moodConfig[moodKey].icon);
      return;
    }

    const moodStats = Object.keys(moodConfig).map((mood) => {
      const mappedMood = moodMapping[mood] || mood;
      const moodEntries = todayEntries.filter((entry) => {
        const entryMood = entry.mood?.toLowerCase();
        return entryMood === mood.toLowerCase() || entryMood === mappedMood;
      });

      const latestEntry = moodEntries.reduce((latest, current) => {
        if (!latest) return current;

        const latestTime =
          latest.createdAt?.toDate?.() || latest.date || new Date(0);
        const currentTime =
          current.createdAt?.toDate?.() || current.date || new Date(0);

        return currentTime > latestTime ? current : latest;
      }, null);

      return {
        mood,
        count: moodEntries.length,
        latestEntry,
        latestTimestamp: latestEntry
          ? latestEntry.createdAt?.toDate?.() || latestEntry.date || new Date(0)
          : new Date(0),
      };
    });

    const validMoodStats = moodStats.filter((stat) => stat.count > 0);
    validMoodStats.sort((a, b) => {
      if (a.count !== b.count) {
        return b.count - a.count;
      }

      return b.latestTimestamp - a.latestTimestamp;
    });

    const dominantMood = validMoodStats[0].mood;
    setElementText("todayMood", moodConfig[dominantMood].text);
    setElementHtml("todayMoodIcon", moodConfig[dominantMood].icon);
  }

  function updateWeeklyStats(entries) {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const weeklyEntries = entries.filter((entry) => {
      const entryDate = createLocalDate(entry.dateString);
      return entryDate >= oneWeekAgo && entryDate <= today;
    });

    Object.keys(moodConfig).forEach((mood) => {
      const mappedMood = moodMapping[mood] || mood;
      const count = weeklyEntries.filter((e) => {
        const entryMood = e.mood?.toLowerCase();
        return entryMood === mood.toLowerCase() || entryMood === mappedMood;
      }).length;

      setElementText(`${mood}Count`, `${count} catatan`);
      setElementText(`weekly${capitalize(mood)}Count`, count);
    });
  }

  function updateMonthlyStats(entries) {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const monthlyEntries = entries.filter((entry) => {
      const entryDate = createLocalDate(entry.dateString);
      return entryDate >= oneMonthAgo && entryDate <= today;
    });

    Object.keys(moodConfig).forEach((mood) => {
      const mappedMood = moodMapping[mood] || mood;
      const count = monthlyEntries.filter((e) => {
        const entryMood = e.mood?.toLowerCase();
        return entryMood === mood.toLowerCase() || entryMood === mappedMood;
      }).length;

      setElementText(`monthly${capitalize(mood)}Count`, count);
    });
  }

  function updateOverallMoodStats(entries) {
    const moodCounts = {};
    let totalEntries = entries.length;

    Object.keys(moodConfig).forEach((mood) => {
      const mappedMood = moodMapping[mood] || mood;
      const count = entries.filter((e) => {
        const entryMood = e.mood?.toLowerCase();
        return entryMood === mood.toLowerCase() || entryMood === mappedMood;
      }).length;

      moodCounts[mood] = count;

      setElementText(`total${capitalize(mood)}Count`, count);

      const percentage =
        totalEntries > 0 ? ((count / totalEntries) * 100).toFixed(1) : 0;
      setElementText(`${mood}Percentage`, `${percentage}%`);
    });

    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

    // Perbaikan untuk most frequent dan least frequent mood
    if (sortedMoods.length > 0 && totalEntries > 0) {
      const mostFrequent = sortedMoods[0];
      const leastFrequent = sortedMoods[sortedMoods.length - 1];

      // Hanya tampilkan jika ada data yang valid (count > 0)
      if (mostFrequent[1] > 0) {
        setElementText("mostFrequentMood", moodConfig[mostFrequent[0]].text);
        setElementHtml("mostFrequentMoodIcon", moodConfig[mostFrequent[0]].icon);
        setElementText("mostFrequentMoodCount", mostFrequent[1]);
      } else {
        setElementText("mostFrequentMood", "Belum Ada Data");
        setElementHtml("mostFrequentMoodIcon", "❓");
        setElementText("mostFrequentMoodCount", 0);
      }

      if (leastFrequent[1] >= 0) {
        setElementText("leastFrequentMood", moodConfig[leastFrequent[0]].text);
        setElementHtml("leastFrequentMoodIcon", moodConfig[leastFrequent[0]].icon);
        setElementText("leastFrequentMoodCount", leastFrequent[1]);
      } else {
        setElementText("leastFrequentMood", "Belum Ada Data");
        setElementHtml("leastFrequentMoodIcon", "❓");
        setElementText("leastFrequentMoodCount", 0);
      }
    } else {
      // Jika tidak ada data sama sekali
      setElementText("mostFrequentMood", "Belum Ada Data");
      setElementHtml("mostFrequentMoodIcon", "❓");
      setElementText("mostFrequentMoodCount", 0);
      
      setElementText("leastFrequentMood", "Belum Ada Data");
      setElementHtml("leastFrequentMoodIcon", "❓");
      setElementText("leastFrequentMoodCount", 0);
    }
  }

  function getMoodCountsByPeriod(entries, days) {
    const today = new Date();
    const periodAgo = new Date(today);
    periodAgo.setDate(today.getDate() - days);

    const periodEntries = entries.filter((entry) => {
      const entryDate = createLocalDate(entry.dateString);
      return entryDate >= periodAgo && entryDate <= today;
    });

    const moodCounts = {};

    Object.keys(moodConfig).forEach((mood) => {
      const mappedMood = moodMapping[mood] || mood;
      moodCounts[mood] = periodEntries.filter((e) => {
        const entryMood = e.mood?.toLowerCase();
        return entryMood === mood.toLowerCase() || entryMood === mappedMood;
      }).length;
    });

    return moodCounts;
  }

  function updateChart(days = 7, chartType = "bar") {
    const ctx = document.getElementById("moodChart")?.getContext("2d");
    if (!ctx) return;

    if (chart) chart.destroy();

    if (chartType === "bar") {
      createBarChart(ctx, days);
    } else {
      createLineChart(ctx, days);
    }

    const chartTypeText = chartType === "bar" ? "Bar" : "Line";
    const periodText =
      chartType === "bar" ? `${days} Hari Terakhir` : `${days} Hari Terakhir`;
    setElementText(
      "chartTitle",
      `Grafik Mood ${periodText} (${chartTypeText})`
    );
  }

  function createBarChart(ctx, days) {
    const moodCounts = getMoodCountsByPeriod(journalData, days);

    const labels = [];
    const data = [];
    const colors = [];

    Object.keys(moodConfig).forEach((mood) => {
      const count = moodCounts[mood] || 0;
      labels.push(moodConfig[mood].icon);
      data.push(count);
      colors.push(moodConfig[mood].color);
    });

    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "",
            data,
            backgroundColor: colors,
            borderColor: colors.map((c) => c.replace("0.8", "1")),
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const moodIndex = ctx.dataIndex;
                const moodKey = Object.keys(moodConfig)[moodIndex];
                const moodName = moodConfig[moodKey].text;
                const count = ctx.parsed.y;
                return `${moodName}: ${count} catatan`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
            grid: { color: "rgba(156, 163, 175, 0.2)" },
          },
          x: {
            grid: { display: false },
          },
        },
        animation: { duration: 1000, easing: "easeInOutQuart" },
      },
    });
  }

  function createLineChart(ctx, days) {
    const labels = [];
    const data = [];
    const colors = [];
    const dateEntries = [];
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }

    dates.forEach((date) => {
      const dateStr = getLocalDateString(date);

      labels.push(
        date.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
        })
      );

      const entry = journalData.find((e) => e.dateString === dateStr);
      dateEntries.push(entry);

      if (entry) {
        const mood = entry.mood?.toLowerCase() || "neutral";
        const moodKey =
          Object.keys(moodConfig).find((key) => key === mood) || "neutral";
        data.push(moodConfig[moodKey].number);
        colors.push(moodConfig[moodKey].color);
      } else {
        data.push(0);
        colors.push("rgba(156, 163, 175, 0.3)");
      }
    });

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "",
            data,
            borderColor: "rgba(59, 130, 246, 0.8)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            fill: false,
            pointBackgroundColor: colors,
            pointBorderColor: colors.map((c) => c.replace("0.8", "1")),
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const dateIndex = ctx.dataIndex;
                const entry = dateEntries[dateIndex];
                const value = ctx.raw;

                if (value === 0 || !entry) {
                  return "Tidak ada catatan pada hari ini";
                }

                const mood = entry.mood?.toLowerCase() || "neutral";
                const moodKey =
                  Object.keys(moodConfig).find((key) => key === mood) ||
                  "neutral";
                const moodName = moodConfig[moodKey].text;
                const moodIcon = moodConfig[moodKey].icon;

                const date = new Date();
                date.setDate(date.getDate() - (days - 1 - dateIndex));
                const dateStr = date.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return [`${dateStr}`, `Mood: ${moodIcon} ${moodName}`];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 7,
            ticks: {
              stepSize: 1,
              callback: (value) => {
                if (value === 0) return "❓";
                const mood = Object.keys(moodConfig).find(
                  (key) => moodConfig[key].number === value
                );
                return mood ? moodConfig[mood].icon : "";
              },
            },
            grid: { color: "rgba(156, 163, 175, 0.2)" },
          },
          x: {
            grid: {
              display: true,
              color: "rgba(156, 163, 175, 0.1)",
            },
          },
        },
        animation: { duration: 1000, easing: "easeInOutQuart" },
        elements: {
          point: {
            hoverRadius: 8,
            radius: 6,
          },
          line: {
            tension: 0.4,
          },
        },
      },
    });
  }

  function setupEventListeners() {
    document.getElementById("chartTypeBar")?.addEventListener("click", () => {
      currentChartType = "bar";
      updateChart(currentPeriod, "bar");
      toggleActiveButton("chartTypeBar", "chartTypeLine");
    });

    document.getElementById("chartTypeLine")?.addEventListener("click", () => {
      currentChartType = "line";
      updateChart(currentPeriod, "line");
      toggleActiveButton("chartTypeLine", "chartTypeBar");
    });

    document.getElementById("chartPeriod7")?.addEventListener("click", () => {
      currentPeriod = 7;
      updateChart(7, currentChartType);
      toggleActiveButton("chartPeriod7", "chartPeriod30");
    });

    document.getElementById("chartPeriod30")?.addEventListener("click", () => {
      currentPeriod = 30;
      updateChart(30, currentChartType);
      toggleActiveButton("chartPeriod30", "chartPeriod7");
    });

    document
      .getElementById("refreshData")
      ?.addEventListener("click", async () => {
        const btn = document.getElementById("refreshData");
        btn?.classList.add("animate-spin");
        await updateStats();
        btn?.classList.remove("animate-spin");
      });
  }

  function toggleActiveButton(activeId, inactiveId) {
    const activeButton = document.getElementById(activeId);
    const inactiveButton = document.getElementById(inactiveId);

    if (activeButton && inactiveButton) {
      inactiveButton.classList.remove("bg-blue-600", "text-white");
      inactiveButton.classList.add(
        "bg-transparent",
        "text-gray-600",
        "dark:text-gray-400",
        "hover:bg-gray-200",
        "dark:hover:bg-gray-600"
      );

      activeButton.classList.remove(
        "bg-transparent",
        "text-gray-600",
        "dark:text-gray-400",
        "hover:bg-gray-200",
        "dark:hover:bg-gray-600",
        "bg-gray-200",
        "text-gray-700",
        "hover:bg-gray-300"
      );
      activeButton.classList.add("bg-blue-600", "text-white");
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setElementHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full ${
      type === "success"
        ? "bg-green-500"
        : type === "error"
          ? "bg-red-500"
          : type === "warning"
            ? "bg-yellow-500"
            : "bg-blue-500"
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove("translate-x-full"), 100);
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  // Public API untuk akses eksternal
  window.dashboardAPI = {
    getMoodCounts: () => getMoodCountsByPeriod(journalData, 30),
    getWeeklyMoodCounts: () => getMoodCountsByPeriod(journalData, 7),
    getAllJournalData: () => journalData,
    refreshData: updateStats,
  };

  initDashboard();
}