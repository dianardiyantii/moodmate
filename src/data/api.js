import CONFIG from "../config";

const API = {
  REGISTER: `${CONFIG.BASE_URL}/auth/register`,
  LOGIN: `${CONFIG.BASE_URL}/auth/login`,
  GET_PROFILE: `${CONFIG.BASE_URL}/auth/profile`,
  UPDATE_PROFILE: `${CONFIG.BASE_URL}/auth/profile`,
  CHANGE_PASSWORD: `${CONFIG.BASE_URL}/auth/change-password`,
  LOGOUT: `${CONFIG.BASE_URL}/auth/logout`,

  CREATE_JOURNAL: `${CONFIG.BASE_URL}/journal`,
  GET_JOURNALS: `${CONFIG.BASE_URL}/journal`,
  GET_JOURNAL_BY_ID: (id) => `${CONFIG.BASE_URL}/journal/${id}`,
  UPDATE_JOURNAL: (id) => `${CONFIG.BASE_URL}/journal/${id}`,
  DELETE_JOURNAL: (id) => `${CONFIG.BASE_URL}/journal/${id}`,

  HEALTH_CHECK: `${CONFIG.BASE_URL}/health`,
  PREDICT_MOOD: `${CONFIG.BASE_URL}/predict-mood`,
};

class ApiService {
  static getBasicHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    const sessionId = this.getSessionId();
    console.log("Session ID yang dikirim ke backend:", sessionId); 

    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    return headers;
  }
  static async makeRequest(url, options = {}) {
    const headers = {
      ...this.getBasicHeaders(),
      ...options.headers,
    };
    console.log("Headers yang dikirim ke backend:", headers); 

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  }

  static getSessionId() {
    return localStorage.getItem("moodmate-session-id");
  }

  static setSessionId(sessionId) {
    localStorage.setItem("moodmate-session-id", sessionId);
  }

  static removeSessionId() {
    localStorage.removeItem("moodmate-session-id");
  }

  static setUserData(user) {
    localStorage.setItem("moodmate-user", JSON.stringify(user));
    localStorage.setItem("moodmate-logged-in", "true");
    localStorage.setItem("moodmate-current-user", JSON.stringify(user));
  }

  static removeUserData() {
    localStorage.removeItem("moodmate-user");
    localStorage.removeItem("moodmate-logged-in");
    localStorage.removeItem("moodmate-current-user");
    this.removeSessionId();
  }

  static async register({ name, email, password }) {
    try {
      const response = await this.makeRequest(API.REGISTER, {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      console.log("Register Response Status:", response.status);
      console.log("Register Response OK:", response.ok);

      const result = await response.json();
      console.log("Register Response Data:", result);

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message:
            result.message ||
            result.error ||
            `HTTP Error ${response.status}` ||
            "Pendaftaran gagal",
          data: result,
        };
      }

      if (
        result.error ||
        result.success === false ||
        result.status === "error"
      ) {
        return {
          error: true,
          message: result.message || result.error || "Pendaftaran gagal",
          data: result,
        };
      }

      return {
        error: false,
        success: true,
        message: result.message || "Pendaftaran berhasil",
        data: result,
      };
    } catch (error) {
      console.error("Register Network Error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        return {
          error: true,
          message: "Tidak dapat terhubung ke server. Periksa koneksi internet.",
        };
      }

      return {
        error: true,
        message: "Terjadi kesalahan jaringan saat mendaftar",
      };
    }
  }

  static async login({ email, password }) {
    try {
      const response = await this.makeRequest(API.LOGIN, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("Login Response Status:", response.status);
      console.log("Login Response OK:", response.ok);

      const result = await response.json();
      console.log("Login Response Data:", result);

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message:
            result.message ||
            result.error ||
            `Login gagal. ${
              response.status === 401
                ? "Email atau kata sandi salah."
                : "Terjadi kesalahan server."
            }`,
          data: result,
        };
      }

      if (
        result.error ||
        result.success === false ||
        result.status === "error"
      ) {
        return {
          error: true,
          status: result.status || response.status,
          message:
            result.message ||
            result.error ||
            "Login gagal. Email atau kata sandi salah.",
          data: result,
        };
      }

      console.log("Login successful");

      if (result.data?.sessionId) {
        this.setSessionId(result.data.sessionId);
      }

      if (result.data?.user) {
        this.setUserData(result.data.user);
      }

      return {
        error: false,
        success: true,
        message: result.message || "Login berhasil",
        data: result,
        user: result.data?.user || result.user,
      };
    } catch (error) {
      console.error("Login Network Error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        return {
          error: true,
          message: "Tidak dapat terhubung ke server. Periksa koneksi internet.",
        };
      }

      return {
        error: true,
        message: "Terjadi kesalahan jaringan saat login",
      };
    }
  }

  static async getUserProfile() {
    try {
      const response = await this.makeRequest(API.GET_PROFILE, {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message: result.message || "Gagal mengambil profil user",
        };
      }

      return result;
    } catch (error) {
      console.error("Get User Profile Error:", error);
      return {
        error: true,
        message: "Terjadi kesalahan saat mengambil profil user",
      };
    }
  }

  static async updateProfile({ name }) {
    try {
      const response = await this.makeRequest(API.UPDATE_PROFILE, {
        method: "PUT",
        body: JSON.stringify({
          name,
        }),
      });

      console.log("Update Profile Response Status:", response.status);
      const result = await response.json();
      console.log("Update Profile Response Data:", result);

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message: result.message || "Gagal memperbarui profil",
          data: result,
        };
      }

      if (result.data?.user) {
        this.setUserData(result.data.user);
      }

      return {
        error: false,
        success: true,
        message: result.message || "Profil berhasil diperbarui",
        data: result,
      };
    } catch (error) {
      console.error("Update Profile Network Error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        return {
          error: true,
          message: "Tidak dapat terhubung ke server. Periksa koneksi internet.",
        };
      }

      return {
        error: true,
        message: "Terjadi kesalahan jaringan saat memperbarui profil",
      };
    }
  }

  static async changePassword({ currentPassword, newPassword }) {
    try {
      const response = await this.makeRequest(API.CHANGE_PASSWORD, {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      console.log("Change Password Response Status:", response.status);
      const result = await response.json();
      console.log("Change Password Response Data:", result);

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message: result.message || "Gagal mengubah password",
          data: result,
        };
      }

      return {
        error: false,
        success: true,
        message: result.message || "Password berhasil diubah",
        data: result,
      };
    } catch (error) {
      console.error("Change Password Network Error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        return {
          error: true,
          message: "Tidak dapat terhubung ke server. Periksa koneksi internet.",
        };
      }

      return {
        error: true,
        message: "Terjadi kesalahan jaringan saat mengubah password",
      };
    }
  }

  static async updateUserInfo({ name, currentPassword, newPassword }) {
    try {
      const updates = [];

      if (name) {
        const profileUpdate = await this.updateProfile({ name });
        updates.push({
          type: "profile",
          result: profileUpdate,
        });
      }

      if (currentPassword && newPassword) {
        const passwordUpdate = await this.changePassword({
          currentPassword,
          newPassword,
        });
        updates.push({
          type: "password",
          result: passwordUpdate,
        });
      }

      const hasError = updates.some((update) => update.result.error);

      if (hasError) {
        const errors = updates
          .filter((update) => update.result.error)
          .map((update) => `${update.type}: ${update.result.message}`)
          .join(", ");

        return {
          error: true,
          message: `Gagal memperbarui: ${errors}`,
          updates,
        };
      }

      return {
        error: false,
        success: true,
        message: "Informasi berhasil diperbarui",
        updates,
      };
    } catch (error) {
      console.error("Update User Info Error:", error);
      return {
        error: true,
        message: "Terjadi kesalahan saat memperbarui informasi",
      };
    }
  }

  static async createJournalEntry({
    catatan,
    mood,
    aktivitas = [],
    detailAktivitas = {},
  }) {
    try {
      const response = await this.makeRequest(API.CREATE_JOURNAL, {
        method: "POST",
        body: JSON.stringify({
          catatan,
          mood,
          aktivitas,
          detailAktivitas,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message: result.message || "Gagal membuat journal entry",
        };
      }

      return result;
    } catch (error) {
      console.error("Create Journal Entry Error:", error);
      return {
        error: true,
        message: "Terjadi kesalahan saat membuat journal entry",
      };
    }
  }

  static async getJournalEntries() {
    try {
      const response = await this.makeRequest(API.GET_JOURNALS, {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message: result.message || "Gagal mengambil journal entries",
        };
      }

      return result;
    } catch (error) {
      console.error("Get Journal Entries Error:", error);
      return {
        error: true,
        message: "Terjadi kesalahan saat mengambil journal entries",
      };
    }
  }

  static async getJournalById(id) {
    try {
      const response = await this.makeRequest(API.GET_JOURNAL_BY_ID(id), {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message: result.message || "Gagal mengambil journal entry",
        };
      }

      return result;
    } catch (error) {
      console.error("Get Journal By ID Error:", error);
      return {
        error: true,
        message: "Terjadi kesalahan saat mengambil journal entry",
      };
    }
  }

  static async updateJournalEntry(
    id,
    { catatan, mood, aktivitas, detailAktivitas }
  ) {
    try {
      const response = await this.makeRequest(API.UPDATE_JOURNAL(id), {
        method: "PUT",
        body: JSON.stringify({
          catatan,
          mood,
          aktivitas,
          detailAktivitas,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message: result.message || "Gagal mengupdate journal entry",
        };
      }

      return result;
    } catch (error) {
      console.error("Update Journal Entry Error:", error);
      return {
        error: true,
        message: "Terjadi kesalahan saat mengupdate journal entry",
      };
    }
  }

  static async deleteJournalEntry(id) {
    try {
      const response = await this.makeRequest(API.DELETE_JOURNAL(id), {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message: result.message || "Gagal menghapus journal entry",
        };
      }

      return result;
    } catch (error) {
      console.error("Delete Journal Entry Error:", error);
      return {
        error: true,
        message: "Terjadi kesalahan saat menghapus journal entry",
      };
    }
  }

  static async predictMood(text) {
    try {
      const response = await this.makeRequest(API.PREDICT_MOOD, {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message: result.message || "Failed to analyze mood",
        };
      }

      return result;
    } catch (error) {
      console.error("Predict Mood Error:", error);
      return {
        error: true,
        message: error.message || "Failed to analyze mood",
      };
    }
  }

  static async healthCheck() {
    try {
      const response = await this.makeRequest(API.HEALTH_CHECK, {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          error: true,
          status: response.status,
          message: result.message || "Health check failed",
        };
      }

      return result;
    } catch (error) {
      console.error("Health Check Error:", error);
      return {
        error: true,
        message: "Terjadi kesalahan saat health check",
      };
    }
  }

  static async logout() {
    try {
      await this.makeRequest(API.LOGOUT, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.removeUserData();
    }
  }

  static isLoggedIn() {
    return (
      localStorage.getItem("moodmate-logged-in") === "true" &&
      this.getSessionId() !== null
    );
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem("moodmate-user");
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default ApiService;
