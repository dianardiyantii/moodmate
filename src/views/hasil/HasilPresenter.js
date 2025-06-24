import ApiService from "../../data/api.js";
import { db } from "../../utils/firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import FirebaseJournalService from "../../services/firebaseJournalService";
import { getRandomActivities } from "../../data/moodActivities";
import { getRandomSongs } from "../../data/moodSongs";

export default function JournalResultPresenter() {
  console.log("JournalResultPresenter initialized");

  function fixScrollBehavior() {
    window.scrollTo(0, 0);

    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    document.body.removeEventListener("touchmove", preventDefault, {
      passive: false,
    });
    document.body.removeEventListener("wheel", preventDefault, {
      passive: false,
    });
  }

  function preventDefault(e) {
    e.preventDefault();
  }

  fixScrollBehavior();

  const aktivitasList = [
    { nama: "Membaca", icon: "📖" },
    { nama: "Olahraga", icon: "🏋️" },
    { nama: "Belanja", icon: "🛒" },
    { nama: "Film", icon: "🎬" },
    { nama: "Santai", icon: "🛋️" },
    { nama: "Kencan", icon: "💖" },
    { nama: "Keluarga", icon: "👨‍👩‍👧‍👦" },
    { nama: "Menggambar", icon: "🎨" },
    { nama: "Musik", icon: "🎵" },
    { nama: "Jalan-jalan", icon: "🚶" },
    { nama: "Game", icon: "🎮" },
    { nama: "Makan sehat", icon: "🥗" },
    { nama: "Memasak", icon: "👨‍🍳" },
    { nama: "Berkebun", icon: "🌱" },
    { nama: "Yoga", icon: "🧘" },
    { nama: "Berbelanja", icon: "🛍️" },
  ];

  setTimeout(() => {
    initializeResultPage();
  }, 300);

  async function initializeResultPage() {
    try {
      fixScrollBehavior();
      const savedJournalData = localStorage.getItem("latest-journal");
      const selectedEntryId = localStorage.getItem("selectedEntryId");

      if (savedJournalData) {
        const latestEntry = JSON.parse(savedJournalData);
        localStorage.removeItem("latest-journal");
        await displayResultsWithRetry(latestEntry);
      } else if (selectedEntryId) {
        await loadJournalFromFirebase(selectedEntryId);
        localStorage.removeItem("selectedEntryId");
      } else {
        await loadLatestJournalFromFirebase();
      }
    } catch (error) {
      console.error("Initialize error:", error);
      showNotification("Gagal memuat data journal", "error");
      setTimeout(() => {
        location.hash = "/journal";
      }, 1500);
    }
  }

  async function loadJournalFromFirebase(journalId) {
    try {
      const journalRef = doc(db, "journal_entries", journalId);
      const journalSnap = await getDoc(journalRef);

      if (journalSnap.exists()) {
        const journalData = journalSnap.data();
        const entry = processJournalData(journalSnap.id, journalData);
        await displayResultsWithRetry(entry);
      } else {
        console.error("Journal not found");
        showNotification("Journal tidak ditemukan", "error");
        location.hash = "/journal";
      }
    } catch (error) {
      console.error("Error loading journal:", error);
      showNotification("Gagal memuat data journal", "error");
      location.hash = "/journal";
    }
  }

  async function loadLatestJournalFromFirebase() {
    try {
      const userEmail = getCurrentUserEmail();
      if (!userEmail) {
        throw new Error("User email not found");
      }

      const q = query(
        collection(db, "journal_entries"),
        where("userEmail", "==", userEmail),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const entry = processJournalData(doc.id, doc.data());
        await displayResultsWithRetry(entry);
      } else {
        console.log("No journals found for user");
        showNotification("Belum ada journal yang dibuat", "info");
        location.hash = "/journal";
      }
    } catch (error) {
      console.error("Error loading latest journal:", error);
      showNotification("Gagal memuat data journal terbaru", "error");
      location.hash = "/journal";
    }
  }

  function processJournalData(id, data) {
    let processedDate;
    try {
      if (data.tanggal) {
        if (typeof data.tanggal === "string") {
          processedDate = data.tanggal;
        } else {
          processedDate = formatDate(data.tanggal);
        }
      } else if (data.createdAt) {
        if (
          data.createdAt.toDate &&
          typeof data.createdAt.toDate === "function"
        ) {
          processedDate = formatDate(data.createdAt.toDate());
        } else {
          processedDate = formatDate(data.createdAt);
        }
      } else {
        processedDate = formatDate(new Date());
      }
    } catch (error) {
      console.error("Error processing date:", error);
      processedDate = formatDate(new Date());
    }

    let processedCreatedAt;
    try {
      if (
        data.createdAt &&
        data.createdAt.toDate &&
        typeof data.createdAt.toDate === "function"
      ) {
        processedCreatedAt = data.createdAt.toDate().toISOString();
      } else if (data.createdAt) {
        processedCreatedAt = new Date(data.createdAt).toISOString();
      } else {
        processedCreatedAt = new Date().toISOString();
      }
    } catch (error) {
      console.error("Error processing createdAt:", error);
      processedCreatedAt = new Date().toISOString();
    }

    return {
      id,
      ...data,
      tanggal: processedDate,
      createdAt: processedCreatedAt,
    };
  }

  async function displayResultsWithRetry(entry, attempt = 0) {
    try {
      await waitForDOMElements();
      displayResults(entry);
      setupEventListeners(entry);
      fixScrollBehavior();
    } catch (error) {
      if (attempt < 3) {
        console.log(`Retry attempt ${attempt + 1}`);
        setTimeout(
          () => displayResultsWithRetry(entry, attempt + 1),
          500 * (attempt + 1)
        );
      } else {
        console.error("Failed to display results after retries:", error);
        showNotification("Gagal menampilkan hasil", "error");
      }
    }
  }

  function displayResults(entry) {
    console.log("Displaying results for entry:", entry);

    try {
      setElementText("tanggal-hasil", entry.tanggal || formatDate(new Date()));

      const moodData = getMoodData(entry.mood);
      console.log("Mood data:", moodData);

      setElementText("emoji", moodData.emoji);
      setElementText("moodText", moodData.text);
      setElementText("moodDescription", moodData.description);

      const moodBox = document.getElementById("moodBox");
      if (moodBox) {
        moodBox.className = `mood-result-box ${moodData.bgClass} rounded-2xl p-10 mb-8 transform transition-all duration-500 hover:scale-105`;
      }

      if (entry.predictedByAI && entry.confidence) {
        const aiInfoElement = document.getElementById("aiInfo");
        if (aiInfoElement) {
          const normalizedConfidence = validateAndNormalizeConfidence(
            entry.confidence
          );
          aiInfoElement.classList.remove("hidden");
        }
      }

      const catatanText = entry.catatan || entry.text || "Tidak ada catatan";
      setElementText("catatanPreview", `"${catatanText}"`);

      const selectedActivities = getSelectedActivities(entry);
      if (selectedActivities.length > 0) {
        displayActivitiesWithIcons(selectedActivities);
      } else {
        hideActivitiesSection();
      }

      const confidence = validateAndNormalizeConfidence(
        entry.confidence ||
          calculateConfidence(entry.mood, entry.catatan || entry.text)
      );
      setTimeout(() => {
        animateConfidenceBar(confidence);
      }, 800);

      displayActivityRecommendations(entry.mood);
      displaySongRecommendations(entry.mood);

      console.log("All results displayed successfully!");
    } catch (error) {
      console.error("Error displaying results:", error);
      setElementText("tanggal-hasil", formatDate(new Date()));
      setElementText("emoji", "😐");
      setElementText("moodText", "Netral");
      setElementText("moodDescription", "Analisis mood tidak dapat dimuat");
      setElementText(
        "catatanPreview",
        `"${entry.catatan || entry.text || "Catatan tidak dapat dimuat"}"`
      );

      setTimeout(() => {
        animateConfidenceBar(75);
      }, 800);
    }
  }

  function displaySongRecommendations(mood) {
    try {
      const songsContainer = document.getElementById("songRecommendations");
      if (!songsContainer) return;

      const songs = getRandomSongs(mood);

      const songsHTML = songs
        .map(
          (song) => `
        <div class="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/30 
                    rounded-2xl p-6 border border-indigo-200 dark:border-indigo-700
                    transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <div class="flex items-start gap-4 h-full">
            <span class="text-3xl">${song.emoji || "🎵"}</span>
            <div class="flex flex-col h-full">
              <h4 class="font-bold text-gray-800 dark:text-white mb-1 line-clamp-1">${
                song.title
              }</h4>
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-1">${
                song.artist
              }</p>
              <div class="mt-auto">
                <a href="${song.link}" target="_blank" 
                   class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 
                          text-sm font-medium transition-colors">
                  <span>Dengarkan</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      `
        )
        .join("");

      songsContainer.innerHTML = songsHTML;
    } catch (error) {
      console.error("Error displaying song recommendations:", error);
      showNotification("Gagal memuat rekomendasi lagu", "error");
    }
  }

  function displayActivityRecommendations(mood) {
    try {
      const recommendationsContainer = document.getElementById(
        "activityRecommendations"
      );
      if (!recommendationsContainer) return;

      const activities = getRandomActivities(mood);

      const recommendationsHTML = activities
        .map(
          (activity) => `
        <div class="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/30 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-700">
          <div class="flex items-start gap-4">
            <span class="text-2xl">💡</span>
            <div>
              <p class="text-gray-600 dark:text-gray-300 text-sm">${activity}</p>
            </div>
          </div>
        </div>
      `
        )
        .join("");

      recommendationsContainer.innerHTML = recommendationsHTML;
    } catch (error) {
      console.error("Error displaying activity recommendations:", error);
    }
  }

  function getActivityIcon(activityName) {
    const basicActivity = aktivitasList.find(
      (activity) => activity.nama.toLowerCase() === activityName.toLowerCase()
    );

    if (basicActivity) {
      return basicActivity.icon;
    }

    try {
      const customActivities = JSON.parse(
        localStorage.getItem("customActivities") || "[]"
      );
      const customActivity = customActivities.find(
        (activity) =>
          activity.nama &&
          activity.nama.toLowerCase() === activityName.toLowerCase()
      );

      if (customActivity && customActivity.icon) {
        return customActivity.icon;
      }
    } catch (error) {
      console.error("Error loading custom activities:", error);
    }

    return "⭐";
  }

  function displayActivitiesWithIcons(activities) {
    const aktivitasSection = document.getElementById("aktivitasSection");
    const aktivitasTerpilih = document.getElementById("aktivitasTerpilih");

    if (aktivitasSection && aktivitasTerpilih && activities.length > 0) {
      aktivitasSection.classList.remove("hidden");

      const activitiesHTML = activities
        .map((activity) => {
          const icon = getActivityIcon(activity);
          const safeActivityName = activity
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          return `
            <div class="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 
                        border border-blue-200 dark:border-blue-700 rounded-2xl p-4 
                        transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                        text-center group cursor-default">
              <div class="text-3xl mb-2 group-hover:animate-bounce">${icon}</div>
              <div class="text-sm font-semibold text-blue-800 dark:text-blue-200">${safeActivityName}</div>
            </div>
          `;
        })
        .join("");

      aktivitasTerpilih.innerHTML = activitiesHTML;
    }
  }

  function getSelectedActivities(entry) {
    console.log("Getting selected activities from entry:", entry);

    let activities = [];

    if (entry.aktivitas && Array.isArray(entry.aktivitas)) {
      activities = entry.aktivitas;
    } else if (entry.activities && Array.isArray(entry.activities)) {
      activities = entry.activities;
    } else if (
      entry.selectedActivities &&
      Array.isArray(entry.selectedActivities)
    ) {
      activities = entry.selectedActivities;
    }

    return activities.filter(
      (activity) =>
        activity && typeof activity === "string" && activity.trim().length > 0
    );
  }

  function validateAndNormalizeConfidence(confidence) {
    let numConfidence;

    if (typeof confidence === "string") {
      numConfidence = parseFloat(confidence);
    } else if (typeof confidence === "number") {
      numConfidence = confidence;
    } else {
      return 75;
    }

    if (isNaN(numConfidence) || numConfidence < 0) {
      return 75;
    }

    if (numConfidence > 100) {
      if (numConfidence > 1000) {
        return 85;
      }
      return Math.min(numConfidence / 10, 95);
    }

    return Math.min(Math.max(numConfidence, 0), 100);
  }

  function setElementText(elementId, text) {
    try {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = text || "";
      }
    } catch (error) {
      console.error(`Error setting ${elementId}:`, error);
    }
  }

  function hideActivitiesSection() {
    const aktivitasSection = document.getElementById("aktivitasSection");
    if (aktivitasSection) {
      aktivitasSection.classList.add("hidden");
    }
  }

  function animateConfidenceBar(confidence) {
    const confidenceBar = document.getElementById("confidenceBar");
    const confidenceText = document.getElementById("confidenceText");

    if (confidenceBar && confidenceText) {
      const safeConfidence = Math.min(Math.max(confidence || 75, 0), 100);

      setTimeout(() => {
        confidenceBar.style.width = safeConfidence + "%";
        confidenceText.textContent = `${safeConfidence}% tingkat keyakinan analisis`;
      }, 300);
    }
  }

  function setupEventListeners(entry) {
    console.log("Setting up event listeners");

    const shareBtn = document.getElementById("shareBtn");
    if (shareBtn) {
      shareBtn.addEventListener("click", handleShare);
    }

    const backBtn = document.getElementById("backToJournalBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        location.hash = "/journal";
      });
    }

    const viewAllBtn = document.getElementById("viewAllJournalsBtn");
    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => {
        location.hash = "/riwayat";
      });
    }

    const editBtn = document.getElementById("editJournalBtn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        localStorage.setItem("editEntryId", entry.id);
        localStorage.setItem("editEntryData", JSON.stringify(entry));
        location.hash = "/journal";
      });
    }

    const deleteBtn = document.getElementById("deleteJournalBtn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        // Create delete confirmation modal
        const modalHTML = `
      <div id="deleteConfirmationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 scale-95 animate-[scaleUp_0.3s_ease-out_forwards]">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-red-500 to-rose-600 text-white p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 class="text-xl font-bold">Konfirmasi Penghapusan</h3>
              </div>
              <button id="cancelDeleteBtn" class="text-white hover:text-gray-200 text-2xl font-bold p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200">
                &times;
              </button>
            </div>
          </div>
          
          <!-- Modal Body -->
          <div class="p-6">
            <div class="flex items-start space-x-4">
              <div class="mt-1 flex-shrink-0 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <p class="text-gray-700 dark:text-gray-300 mb-4">Apakah kamu yakin ingin menghapus jurnal ini? Tindakan ini tidak dapat dibatalkan.</p>
                <div class="flex justify-end space-x-3 mt-6">
                  <button id="confirmDeleteBtn" class="px-5 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ya, Hapus</span>
                  </button>
                  <button id="cancelDeleteBtn2" class="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-all duration-200">
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      </style>
    `;

        document.body.insertAdjacentHTML("beforeend", modalHTML);
        const modal = document.getElementById("deleteConfirmationModal");
        const cancelButtons = document.querySelectorAll(
          "#cancelDeleteBtn, #cancelDeleteBtn2"
        );
        cancelButtons.forEach((btn) => {
          btn.addEventListener("click", () => {
            modal.classList.add("opacity-0");
            setTimeout(() => modal.remove(), 300);
          });
        });

        document
          .getElementById("confirmDeleteBtn")
          .addEventListener("click", async () => {
            try {
              await FirebaseJournalService.deleteJournalEntry(entry.id);
              showNotification("🗑️ Catatan berhasil dihapus", "success");
              modal.classList.add("opacity-0");
              setTimeout(() => {
                modal.remove();
                location.hash = "/journal";
              }, 300);
            } catch (error) {
              showNotification("❌ Gagal menghapus catatan", "error");
              modal.classList.add("opacity-0");
              setTimeout(() => modal.remove(), 300);
            }
          });

        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            modal.classList.add("opacity-0");
            setTimeout(() => modal.remove(), 300);
          }
        });
      });
    }
  }

  function handleShare() {
    const moodTextElement = document.getElementById("moodText");
    const emojiElement = document.getElementById("emoji");

    const moodText = moodTextElement
      ? moodTextElement.textContent
      : "mood tidak diketahui";
    const emoji = emojiElement ? emojiElement.textContent : "😊";

    const shareText = `Hari ini aku merasa ${moodText}! ${emoji} \n\n#MoodMate #JournalHarian #MoodAnalysis`;

    if (navigator.share) {
      navigator
        .share({
          title: "Mood Hari Ini - MoodMate",
          text: shareText,
          url: window.location.href,
        })
        .catch((err) => {
          console.log("Error sharing:", err);
          fallbackShare(shareText);
        });
    } else {
      fallbackShare(shareText);
    }
  }

  function fallbackShare(shareText) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          showNotification(
            "✅ Teks mood berhasil disalin ke clipboard!",
            "success"
          );
        })
        .catch(() => {
          showNotification("❌ Gagal menyalin teks", "error");
        });
    } else {
      showNotification("📤 Fitur share tidak tersedia", "info");
    }
  }

  function getMoodData(mood) {
    const moodMap = {
      anger: {
        emoji: "😠",
        text: "Marah",
        description:
          "Kamu sedang kesal hari ini. Coba tarik napas dalam-dalam dan tenangkan diri. Ingat, emosi ini akan berlalu.",
        bgClass:
          "bg-gradient-to-br from-red-100 via-red-50 to-pink-100 dark:from-red-900/30 dark:via-red-800/20 dark:to-pink-900/30",
      },
      happy: {
        emoji: "😊",
        text: "Senang",
        description:
          "Hari yang menyenangkan! Kamu terlihat bahagia dan puas. Terus pertahankan energy positif ini!",
        bgClass:
          "bg-gradient-to-br from-green-100 via-blue-50 to-teal-100 dark:from-green-900/30 dark:via-blue-800/20 dark:to-teal-900/30",
      },
      sad: {
        emoji: "😢",
        text: "Sedih",
        description:
          "Hari yang menyedihkan. Tidak apa-apa untuk merasa sedih, itu manusiawi. Besok akan lebih baik, percayalah.",
        bgClass:
          "bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-900/30 dark:via-indigo-800/20 dark:to-purple-900/30",
      },
      fear: {
        emoji: "😰",
        text: "Cemas",
        description:
          "Kamu merasa cemas atau takut hari ini. Ingat bahwa perasaan ini akan berlalu. Kamu lebih kuat dari yang kamu kira.",
        bgClass:
          "bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100 dark:from-yellow-900/30 dark:via-orange-800/20 dark:to-red-900/30",
      },
      neutral: {
        emoji: "😐",
        text: "Netral",
        description:
          "Hari yang biasa-biasa saja. Tidak apa-apa, kadang kita butuh hari yang tenang. Besok bisa lebih menarik!",
        bgClass:
          "bg-gradient-to-br from-gray-100 via-slate-50 to-zinc-100 dark:from-gray-900/30 dark:via-slate-800/20 dark:to-zinc-900/30",
      },
      love: {
        emoji: "💖",
        text: "Penuh Cinta",
        description:
          "Harimu dipenuhi dengan cinta dan kasih sayang. Betapa indahnya! Terus sebarkan energy positif ini.",
        bgClass:
          "bg-gradient-to-br from-pink-100 via-rose-50 to-red-100 dark:from-pink-900/30 dark:via-rose-800/20 dark:to-red-900/30",
      },
    };

    let normalizedMood = "neutral";
    if (mood && typeof mood === "string") {
      normalizedMood = mood.trim().toLowerCase();
    }

    return moodMap[normalizedMood] || moodMap["neutral"];
  }

  function calculateConfidence(mood, catatan) {
    if (!catatan) return 75;

    const words = catatan.toLowerCase().split(" ").length;

    const moodKeywords = {
      happy: [
        "senang",
        "bahagia",
        "ceria",
        "gembira",
        "puas",
        "bangga",
        "lega",
        "bersyukur",
        "suka",
        "excited",
      ],
      sad: [
        "sedih",
        "kecewa",
        "terpuruk",
        "murung",
        "hancur",
        "putus asa",
        "menyedihkan",
        "down",
        "galau",
      ],
      anger: [
        "marah",
        "kesal",
        "jengkel",
        "benci",
        "geram",
        "dongkol",
        "sewot",
        "emosi",
        "annoying",
        "frustasi",
      ],
      fear: [
        "takut",
        "cemas",
        "khawatir",
        "was-was",
        "panik",
        "gelisah",
        "tegang",
        "gugup",
        "nervous",
        "anxiety",
      ],
      love: [
        "cinta",
        "sayang",
        "rindu",
        "romantis",
        "mesra",
        "kasih",
        "afeksi",
        "kencan",
        "pacaran",
        "valentine",
      ],
      neutral: [
        "biasa",
        "normal",
        "standar",
        "lumayan",
        "oke",
        "netral",
        "so-so",
        "fine",
      ],
    };

    let matchingWords = 0;
    let relevantWords = [];

    const normalizedMood = mood ? mood.toLowerCase() : "neutral";
    if (moodKeywords[normalizedMood]) {
      relevantWords = moodKeywords[normalizedMood];
    }

    relevantWords.forEach((word) => {
      if (catatan.toLowerCase().includes(word)) matchingWords++;
    });

    const baseConfidence = 70;
    const lengthFactor = Math.min(words * 2, 20);
    const matchFactor = Math.min(matchingWords * 6, 20);

    return Math.min(baseConfidence + lengthFactor + matchFactor, 98);
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

  function getCurrentUserEmail() {
    return (
      localStorage.getItem("moodmate-current-user") ||
      JSON.parse(localStorage.getItem("moodmate-user") || "{}")?.email
    );
  }

  function formatDate(date) {
    try {
      if (!date) {
        return new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }

      let dateObj;
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === "string" || typeof date === "number") {
        dateObj = new Date(date);
      } else {
        dateObj = new Date();
      }

      if (isNaN(dateObj.getTime())) {
        dateObj = new Date();
      }

      return dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  function waitForDOMElements() {
    return new Promise((resolve, reject) => {
      const requiredElements = [
        "tanggal-hasil",
        "emoji",
        "moodText",
        "moodDescription",
        "moodBox",
        "catatanPreview",
        "activityRecommendations",
        "songRecommendations",
      ];

      let attempts = 0;
      const maxAttempts = 50;

      const checkElements = () => {
        attempts++;
        const allReady = requiredElements.every((id) =>
          document.getElementById(id)
        );

        if (allReady) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error("DOM elements not ready after maximum attempts"));
        } else {
          setTimeout(checkElements, 100);
        }
      };

      checkElements();
    });
  }
}
