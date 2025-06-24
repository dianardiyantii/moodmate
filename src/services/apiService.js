import CONFIG from "../config";
const ApiService = {
  async makeRequest(endpoint, options = {}) {
    const sessionId = localStorage.getItem("moodmate-session-id");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    try {
      console.log(`Making request to: ${CONFIG.BASE_URL}${endpoint}`);

      const response = await fetch(`${CONFIG.BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include", 
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("moodmate-session-id");
          localStorage.removeItem("moodmate-current-user");
          localStorage.removeItem("moodmate-logged-in");
          window.location.hash = "#/login";
          return {
            success: false,
            message: "Sesi telah berakhir, silakan login kembali.",
          };
        }

        try {
          const errorData = await response.json();
          return {
            success: false,
            message: errorData.message || `Server error: ${response.status}`,
          };
        } catch {
          return {
            success: false,
            message: `Server error: ${response.status}`,
          };
        }
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);

      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        return {
          success: false,
          message:
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
        };
      }

      if (error.name === "AbortError") {
        return {
          success: false,
          message: "Request timeout. Silakan coba lagi.",
        };
      }

      return { success: false, message: `Terjadi kesalahan: ${error.message}` };
    }
  },

  setSessionData(sessionId, user) {
    localStorage.setItem("moodmate-session-id", sessionId);
    localStorage.setItem("moodmate-current-user", JSON.stringify(user));
    localStorage.setItem("moodmate-logged-in", "true");
  },

  async login({ email, password }) {
    return this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register({ name, email, password }) {
    return this.makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  async logout() {
    return this.makeRequest("/auth/logout", { method: "POST" });
  },

  async predictMood(text) {
    try {
      const sessionId = localStorage.getItem("moodmate-session-id"); 
      console.log("Session ID yang dikirim ke backend:", sessionId);

      const response = await fetch(`${CONFIG.BASE_URL}/predict-mood`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": sessionId, 
        },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      console.log("Backend API Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend API Response:", data);

      let moodName = null;

      if (data.label_name) {
        moodName = data.label_name.toLowerCase();
      } else if (data.mood) {
        moodName = data.mood.toLowerCase();
      } else if (data.label_index !== undefined) {
        const indexToMood = {
          0: "happy",
          1: "sad",
          2: "anger",
          3: "fear",
          4: "neutral",
          5: "love",
        };
        moodName = indexToMood[data.label_index] || "neutral";
      }

      if (!moodName) moodName = "neutral";

      return {
        mood: moodName,
        confidence: data.confidence ? Math.round(data.confidence) : 85,
        error: null,
      };
    } catch (error) {
      console.error("Backend API Error:", error);
      return {
        mood: null,
        error: {
          message: `Gagal menghubungi service: ${error.message}`,
          type: "connection_error",
        },
      };
    }
  },
  async getProfile() {
    return this.makeRequest("/auth/profile", {
      method: "GET",
    });
  },
  async updateProfile(updateData) {
    console.log("Updating profile with data:", updateData);
    return this.makeRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  },
  async changePassword(passwordData) {
    console.log("Changing password...");
    return this.makeRequest("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    });
  },
  async updateProfilePhoto(imageData) {
    return this.makeRequest("/auth/profile-photo", {
      method: "PUT",
      body: JSON.stringify({
        profilePhoto: imageData,
      }),
    });
  },
  async resetProfilePhoto() {
    return this.makeRequest("/auth/profile-photo", {
      method: "DELETE",
    });
  },
  async checkServerHealth() {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/health`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        return data.status === "OK";
      }
      return false;
    } catch (error) {
      console.log("ML Server is not running:", error.message);
      return false;
    }
  },
  async getJournals() {
    return this.makeRequest("/journal", { method: "GET" });
  },

  async getJournalById(id) {
    return this.makeRequest(`/journal/${id}`, { method: "GET" });
  },

  async createJournal(journalData) {
    return this.makeRequest("/journal", {
      method: "POST",
      body: JSON.stringify(journalData),
    });
  },

  async updateJournal(id, journalData) {
    return this.makeRequest(`/journal/${id}`, {
      method: "PUT",
      body: JSON.stringify(journalData),
    });
  },

  async deleteJournal(id) {
    return this.makeRequest(`/journal/${id}`, { method: "DELETE" });
  },
};

export default ApiService;
