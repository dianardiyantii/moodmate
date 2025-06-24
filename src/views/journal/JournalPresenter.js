import ApiService from "../../services/apiService";
import FirebaseJournalService from "../../services/firebaseJournalService";
import CONFIG from '../../config';

export default function JournalPresenter() {
  const editingId = localStorage.getItem("editEntryId");
  const editingDataRaw = localStorage.getItem("editEntryData");
  let isEditing = false;
  let editingData = null;

  if (editingId && editingDataRaw) {
    isEditing = true;
    editingData = JSON.parse(editingDataRaw);
  }

  const today = new Date();
  const tanggalElement = document.getElementById("tanggal-hari");
  if (tanggalElement) {
    tanggalElement.textContent = today.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

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

  let customActivities = JSON.parse(
    localStorage.getItem("customActivities") || "[]"
  );

  const container = document.getElementById("aktivitas-container");
  const customContainer = document.getElementById("custom-aktivitas-container");

  if (container) {
    setupActivityContainer(container, aktivitasList);
  }

  if (customContainer) {
    renderCustomActivities();
  }

  setupCustomActivityInput();

  if (isEditing && editingData) {
    document.getElementById("catatan").value = editingData.catatan;
  }

  function updateSaveButtonState() {
    const saveBtn = document.getElementById("simpan-btn");
    const catatanInput = document.getElementById("catatan");

    if (!saveBtn || !catatanInput) return;

    const catatanValue = catatanInput.value.trim();
    const isEmpty = !catatanValue;

    if (isEmpty) {
      saveBtn.disabled = true;
      saveBtn.classList.add("opacity-50", "cursor-not-allowed");
      saveBtn.classList.remove("hover:bg-blue-600", "active:bg-blue-700");
      saveBtn.textContent = "Tulis catatan terlebih dahulu";
    } else {
      saveBtn.disabled = false;
      saveBtn.classList.remove("opacity-50", "cursor-not-allowed");
      saveBtn.classList.add("hover:bg-blue-600", "active:bg-blue-700");
      saveBtn.textContent = isEditing ? "Perbarui Catatan" : "Simpan Catatan";
    }
  }

  function setButtonLoadingState(isLoading, loadingText = "Memproses...") {
    const saveBtn = document.getElementById("simpan-btn");
    if (!saveBtn) return;

    if (isLoading) {
      saveBtn.disabled = true;
      saveBtn.classList.add("opacity-70", "cursor-not-allowed");
      saveBtn.classList.remove("hover:bg-blue-600", "active:bg-blue-700");
      saveBtn.textContent = loadingText;

      if (!saveBtn.querySelector(".loading-spinner")) {
        const spinner = document.createElement("span");
        spinner.className =
          "loading-spinner inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2";
        saveBtn.prepend(spinner);
      }
    } else {
      saveBtn.disabled = false;
      saveBtn.classList.remove("opacity-70", "cursor-not-allowed");
      saveBtn.classList.add("hover:bg-blue-600", "active:bg-blue-700");

      const spinner = saveBtn.querySelector(".loading-spinner");
      if (spinner) {
        spinner.remove();
      }

      updateSaveButtonState();
    }
  }

  const catatanInput = document.getElementById("catatan");
  if (catatanInput) {
    updateSaveButtonState();

    catatanInput.addEventListener("input", updateSaveButtonState);
    catatanInput.addEventListener("keyup", updateSaveButtonState);
    catatanInput.addEventListener("paste", () => {
      setTimeout(updateSaveButtonState, 10);
    });
  }

  function setupActivityContainer(container, activities) {
    container.innerHTML = "";

    activities.forEach((item, index) => {
      const div = createActivityElement(item);
      container.appendChild(div);
    });
  }

  function createActivityElement(item) {
    const div = document.createElement("div");
    div.innerHTML = `<span class="text-2xl mb-2 block">${item.icon}</span><span class="text-sm">${item.nama}</span>`;
    div.className =
      "cursor-pointer bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-blue-300";

    div.setAttribute("data-activity", item.nama);
    div.setAttribute("data-selected", "false");

    div.addEventListener("click", function () {
      toggleActivitySelection(this, item.nama);
    });

    return div;
  }

  function createCustomActivityElement(activity) {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="relative">
        <span class="text-2xl mb-2 block">${activity.icon}</span>
        <span class="text-sm">${activity.nama}</span>
        <button class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 transition-all" onclick="removeCustomActivity('${activity.nama}')">×</button>
      </div>
    `;
    div.className =
      "cursor-pointer bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-blue-300";

    div.setAttribute("data-activity", activity.nama);
    div.setAttribute("data-selected", "false");

    div.addEventListener("click", function (e) {
      if (!e.target.closest("button")) {
        toggleActivitySelection(this, activity.nama);
      }
    });

    return div;
  }

  function toggleActivitySelection(element, activityName) {
    const isSelected = element.getAttribute("data-selected") === "true";

    if (isSelected) {
      element.classList.remove(
        "bg-blue-300",
        "dark:bg-blue-600",
        "border-blue-500",
        "scale-105"
      );
      element.classList.add("bg-gray-100", "dark:bg-gray-700");
      element.setAttribute("data-selected", "false");
    } else {
      element.classList.remove("bg-gray-100", "dark:bg-gray-700");
      element.classList.add(
        "bg-blue-300",
        "dark:bg-blue-600",
        "border-blue-500",
        "scale-105"
      );
      element.setAttribute("data-selected", "true");
    }

    console.log(
      `Activity ${activityName} ${isSelected ? "deselected" : "selected"}`
    );
  }

  function setupCustomActivityInput() {
    const input = document.getElementById("custom-activity-input");
    const addBtn = document.getElementById("add-custom-activity");

    if (addBtn) {
      addBtn.addEventListener("click", addCustomActivity);
    }

    if (input) {
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          addCustomActivity();
        }
      });
    }
  }

  function addCustomActivity() {
    const input = document.getElementById("custom-activity-input");
    const activityName = input.value.trim();

    if (!activityName) {
      showNotification("Masukkan nama aktivitas terlebih dahulu!", "error");
      return;
    }

    const existingActivity = customActivities.find(
      (activity) => activity.nama.toLowerCase() === activityName.toLowerCase()
    );

    if (existingActivity) {
      showNotification("Aktivitas sudah ada!", "error");
      return;
    }

    const basicActivity = aktivitasList.find(
      (activity) => activity.nama.toLowerCase() === activityName.toLowerCase()
    );

    if (basicActivity) {
      showNotification(
        "Aktivitas sudah tersedia di daftar aktivitas umum!",
        "error"
      );
      return;
    }

    const randomEmojis = [
      "✨",
      "🌟",
      "⭐",
      "🎯",
      "🎪",
      "🎭",
      "🎨",
      "🎪",
      "🌈",
      "💫",
    ];
    const randomIcon =
      randomEmojis[Math.floor(Math.random() * randomEmojis.length)];

    const newActivity = {
      nama: activityName,
      icon: randomIcon,
      id: Date.now().toString(),
    };

    customActivities.push(newActivity);
    localStorage.setItem("customActivities", JSON.stringify(customActivities));

    renderCustomActivities();
    input.value = "";
    showNotification(
      `Aktivitas "${activityName}" berhasil ditambahkan!`,
      "success"
    );
  }

  function renderCustomActivities() {
    if (!customContainer) return;

    customContainer.innerHTML = "";

    customActivities.forEach((activity) => {
      const div = createCustomActivityElement(activity);
      customContainer.appendChild(div);
    });
  }

  window.removeCustomActivity = function (activityName) {
    customActivities = customActivities.filter(
      (activity) => activity.nama !== activityName
    );
    localStorage.setItem("customActivities", JSON.stringify(customActivities));
    renderCustomActivities();
    showNotification(
      `Aktivitas "${activityName}" berhasil dihapus!`,
      "success"
    );
  };

  function getSelectedActivities() {
    const allContainers = [container, customContainer].filter(Boolean);
    let selectedActivities = [];

    allContainers.forEach((cont) => {
      const selectedDivs = cont.querySelectorAll('[data-selected="true"]');
      const activities = Array.from(selectedDivs).map((div) =>
        div.getAttribute("data-activity")
      );
      selectedActivities = selectedActivities.concat(activities);
    });

    console.log("Selected activities:", selectedActivities);
    return selectedActivities;
  }

  function saveJournalEntryToLocalStorage(newEntry) {
    const data = JSON.parse(localStorage.getItem("catatan") || "[]");
    data.push(newEntry);
    localStorage.setItem("catatan", JSON.stringify(data));
    console.log("Saved journal entry to localStorage:", newEntry);
  }

  const moodItems = document.querySelectorAll(".mood-item");
  let selectedMood = "";

  // Pre-select mood jika sedang editing
  if (isEditing && editingData) {
    selectedMood = editingData.mood;
    setTimeout(() => {
      const moodElement = document.querySelector(
        `.mood-item[data-mood="${selectedMood}"]`
      );
      if (moodElement) {
        moodElement.click();
      }
    }, 100);
  }

  moodItems.forEach((item) => {
    item.addEventListener("click", () => {
      moodItems.forEach((m) => {
        m.classList.remove("bg-white", "shadow-lg", "scale-110");
      });
      item.classList.add("bg-white", "shadow-lg", "scale-110");
      selectedMood = item.dataset.mood;
    });
  });

  if (isEditing && editingData) {
    setTimeout(() => {
      const allContainers = [container, customContainer].filter(Boolean);
      allContainers.forEach((cont) => {
        const divs = cont.querySelectorAll("[data-activity]");
        divs.forEach((div) => {
          const name = div.getAttribute("data-activity");
          if (
            editingData.aktivitas?.includes(name) ||
            editingData.activities?.includes(name)
          ) {
            div.click();
          }
        });
      });
    }, 300);
  }

  document.getElementById("simpan-btn")?.addEventListener("click", async () => {
    const catatan = document.getElementById("catatan").value.trim();

    if (!catatan) {
      showNotification("Tulis catatan terlebih dahulu! 📝", "error");
      return;
    }

    setButtonLoadingState(true, "Memeriksa server ML...");

    try {
      const currentUser = localStorage.getItem("moodmate-current-user");
      if (!currentUser) {
        showNotification("❌ Anda harus login terlebih dahulu!", "error");
        setButtonLoadingState(false);
        setTimeout(() => {
          location.hash = "/login";
        }, 1500);
        return;
      }

      const isServerRunning = await ApiService.checkServerHealth();

      if (!isServerRunning) {
        showNotification(
          "❌ Server ML tidak dapat diakses! Pastikan server ML sedang berjalan di " +
            CONFIG.BASE_URL, // misal simpan BASE_URL di ApiService
          "error"
        );
        setButtonLoadingState(false);
        return;
      }

      setButtonLoadingState(true, "Menganalisis mood...");

      const { mood, confidence, error } = await ApiService.predictMood(catatan);

      if (error) {
        console.error("API Error:", error);
        showNotification(
          `❌ Gagal memprediksi mood: ${error.message}. Pastikan server ML sedang berjalan!`,
          "error"
        );
        setButtonLoadingState(false);
        return;
      }

      if (!mood) {
        throw new Error("Mood prediction returned empty result");
      }

      console.log("Predicted mood:", mood, "Confidence:", confidence);

      await saveFinalEntry(catatan, mood, confidence);
    } catch (error) {
      console.error("Error predicting mood:", error);
      showNotification(
        "❌ Terjadi kesalahan saat menghubungi server ML. Pastikan server sedang berjalan!",
        "error"
      );
      setButtonLoadingState(false);
    }
  });

  async function saveFinalEntry(catatan, mood, confidence = null) {
    try {
      setButtonLoadingState(
        true,
        isEditing ? "Memperbarui..." : "Menyimpan ke database..."
      );

      const selected = getSelectedActivities();

      const tanggal = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const processedMood = mood ? mood.toLowerCase() : "neutral";

      const newEntry = {
        tanggal,
        catatan,
        aktivitas: selected,
        mood: processedMood,
        confidence,
        text: catatan,
        activities: selected,
        predictedByAI: confidence !== null,
        rawMoodData: { mood, confidence },
      };

      console.log("Final entry to save:", newEntry);

      let result;
      if (isEditing && editingId) {
        result = await FirebaseJournalService.updateJournalEntry(
          editingId,
          newEntry
        );

        if (result.success) {
          const updatedEntry = {
            ...newEntry,
            id: editingId,
            timestamp: new Date().toISOString(),
            date: new Date().toISOString(),
            createdAt: editingData.createdAt || new Date().toISOString(),
          };

          localStorage.setItem("latest-journal", JSON.stringify(updatedEntry));
        }
      } else {
        result = await FirebaseJournalService.saveJournalEntry(newEntry);

        if (result.success) {
          const newEntryWithId = {
            ...newEntry,
            id: result.id,
            timestamp: new Date().toISOString(),
            date: new Date().toISOString(),
          };

          saveJournalEntryToLocalStorage(newEntryWithId);
          localStorage.setItem(
            "latest-journal",
            JSON.stringify(newEntryWithId)
          );
        }
      }

      if (result.success) {
        if (isEditing) {
          showNotification("✏️ Catatan berhasil diperbarui!", "success");
        } else {
          showNotification(
            "✅ Catatan berhasil disimpan ke database! ✨",
            "success"
          );
        }

        localStorage.removeItem("editEntryId");
        localStorage.removeItem("editEntryData");

        setTimeout(() => {
          document.getElementById("catatan").value = "";

          const allContainers = [container, customContainer].filter(Boolean);
          allContainers.forEach((cont) => {
            const selectedDivs = cont.querySelectorAll(
              '[data-selected="true"]'
            );
            selectedDivs.forEach((div) => {
              div.classList.remove(
                "bg-blue-300",
                "dark:bg-blue-600",
                "border-blue-500",
                "scale-105"
              );
              div.classList.add("bg-gray-100", "dark:bg-gray-700");
              div.setAttribute("data-selected", "false");
            });
          });

          setButtonLoadingState(false);

          location.hash = "/hasil";
        }, 1500);
      } else {
        throw new Error("Failed to save to Firebase");
      }
    } catch (error) {
      console.error("Error saving to Firebase:", error);

      showNotification(
        "⚠️ Gagal menyimpan ke database. Data disimpan secara lokal.",
        "warning"
      );

      const newEntryWithTimestamp = {
        ...newEntry,
        id: isEditing ? editingId : Date.now().toString(),
        timestamp: new Date().toISOString(),
        date: new Date().toISOString(),
        createdAt: isEditing
          ? editingData.createdAt || new Date().toISOString()
          : new Date().toISOString(),
      };

      saveJournalEntryToLocalStorage(newEntryWithTimestamp);

      localStorage.setItem(
        "latest-journal",
        JSON.stringify(newEntryWithTimestamp)
      );

      setTimeout(() => {
        document.getElementById("catatan").value = "";

        const allContainers = [container, customContainer].filter(Boolean);
        allContainers.forEach((cont) => {
          const selectedDivs = cont.querySelectorAll('[data-selected="true"]');
          selectedDivs.forEach((div) => {
            div.classList.remove(
              "bg-blue-300",
              "dark:bg-blue-600",
              "border-blue-500",
              "scale-105"
            );
            div.classList.add("bg-gray-100", "dark:bg-gray-700");
            div.setAttribute("data-selected", "false");
          });
        });

        setButtonLoadingState(false);
        location.hash = "/hasil";
      }, 1500);
    }
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full max-w-md ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
          ? "bg-red-500 text-white"
          : type === "warning"
            ? "bg-yellow-500 text-white"
            : "bg-blue-500 text-white"
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}
