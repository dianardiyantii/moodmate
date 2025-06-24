import ApiService from "../services/apiService";
export const UserModel = {
  getCurrent() {
    try {
      const userData = localStorage.getItem("moodmate-user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
      this.clearSession();
      return null;
    }
  },

  setSession(sessionId, user) {
    localStorage.setItem("moodmate-session-id", sessionId);
    localStorage.setItem("moodmate-user", JSON.stringify(user));
    localStorage.setItem("moodmate-logged-in", "true");
    localStorage.setItem("moodmate-current-user", user.email);
  },

  clearSession() {
    localStorage.removeItem("moodmate-session-id");
    localStorage.removeItem("moodmate-user");
    localStorage.removeItem("moodmate-logged-in");
    localStorage.removeItem("moodmate-current-user");
  },

  async getProfile() {
    try {
      const sessionId = localStorage.getItem("moodmate-session-id");
      if (!sessionId) {
        console.warn("User not authenticated, cannot get profile");
        return null;
      }
  
      const response = await ApiService.getProfile();
  
      if (!response || !response.success) {
        console.error("Error getting user profile:", response?.message);
        
        if (response?.status === 401) {
          this.logout();
        }
        
        return null;
      }
  
      let userData = response.data?.user || response.data;
    
      if (!userData || typeof userData !== "object" || !userData.email) {
        console.error("Invalid user data received from API:", userData);
        return null;
      }
  
      if (!userData.joined && !userData.createdAt && !userData.created_at) {
        const existingUser = this.getCurrent();
        if (existingUser && existingUser.joined) {
          userData.joined = existingUser.joined;
        } else {
          userData.joined = new Date().toISOString();
        }
      }
  
      try {
        localStorage.setItem("moodmate-user", JSON.stringify(userData));
      } catch (storageError) {
        console.error("Failed to save user data to localStorage:", storageError);
      }
  
      return userData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      
      if (error.message && error.message.includes("401")) {
        this.logout();
      }
      
      return null;
    }
  },

  async logout() {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error(
        "Error calling backend logout, but proceeding with client-side cleanup:",
        error
      );
    } finally {
      this.clearSession();
      window.location.hash = "/login";
    }
  },

  cleanupInvalidSession() {
    try {
      localStorage.removeItem("moodmate-session-id");
      localStorage.removeItem("moodmate-logged-in");
      localStorage.removeItem("moodmate-current-user");
      localStorage.removeItem("moodmate-user");
      console.log("Invalid session cleaned up");
    } catch (error) {
      console.error("Error during session cleanup:", error);
    }
  },

  isLoggedIn() {
    return localStorage.getItem("moodmate-logged-in") === "true";
  },

  setCurrentUser(userData) {
    try {
      if (!userData || typeof userData !== "object" || !userData.email) {
        console.error("Invalid user data, cannot set current user:", userData);
        return false;
      }

      if (typeof userData.email !== "string" || !userData.email.includes("@")) {
        console.error("Invalid email format:", userData.email);
        return false;
      }

      if (!userData.joined && !userData.createdAt && !userData.created_at) {
        userData.joined = new Date().toISOString();
      }

      localStorage.setItem("moodmate-user", JSON.stringify(userData));
      localStorage.setItem("moodmate-logged-in", "true");
      localStorage.setItem("moodmate-current-user", userData.email);

      console.log("Current user set successfully:", userData.email);
      return true;
    } catch (error) {
      console.error("Failed to set current user:", error);
      return false;
    }
  },

  updateUser(updateData) {
    try {
      if (!updateData || typeof updateData !== "object") {
        console.error("Invalid update data:", updateData);
        return false;
      }

      const currentUser = this.getCurrent();
      if (!currentUser) {
        console.error("No current user found to update");
        return false;
      }

      const updatedUser = {
        ...currentUser,
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("moodmate-user", JSON.stringify(updatedUser));

      console.log(
        "User data updated successfully in localStorage:",
        updatedUser
      );
      return true;
    } catch (error) {
      console.error("Error updating user data:", error);
      return false;
    }
  },

  getCurrentUserEmail() {
    try {
      const email = localStorage.getItem("moodmate-current-user");

      if (email && typeof email === "string" && email.includes("@")) {
        return email;
      }

      const userData = this.getCurrent();
      if (userData && userData.email) {
        localStorage.setItem("moodmate-current-user", userData.email);
        return userData.email;
      }

      return null;
    } catch (error) {
      console.error("Error getting current user email:", error);
      return null;
    }
  },

  getFormattedJoinDate() {
    try {
      const user = this.getCurrent();
      if (!user) return "Tanggal tidak tersedia";

      const dateString = user.joined || user.createdAt || user.created_at;
      if (!dateString || dateString === "undefined" || dateString === "null") {
        return "Tanggal tidak tersedia";
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Tanggal tidak valid";
      }

      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting join date:", error);
      return "Tanggal tidak tersedia";
    }
  },

  async validateSession() {
    try {
      const sessionId = localStorage.getItem("moodmate-session-id");
      if (!sessionId) {
        this.logout();
        return false;
      }
      const profile = await this.getProfile();
      if (!profile || !profile.email) {
        this.logout();
        return false;
      }
      console.log("Session validation successful");
      return true;
    } catch (error) {
      console.error("Session validation failed:", error);
      this.logout();
      return false;
    }
  },

  async refreshProfile() {
    if (!this.isLoggedIn()) return null;
  
    const result = await ApiService.getProfile();
    if (result && result.success) {
      const user = result.data?.user || result.data;
      
      if (user && typeof user === "object" && user.email) {
        localStorage.setItem("moodmate-user", JSON.stringify(user));
        return user;
      } else {
        console.error("Invalid user data from refreshProfile:", user);
        this.logout();
        return null;
      }
    } else {
      console.error("Failed to refresh profile:", result?.message);
      this.logout();
      return null;
    }
  },

  updateProfilePhoto(photoData) {
    try {
      if (photoData && typeof photoData === "string") {
        if (
          photoData.startsWith("data:image/") ||
          photoData.startsWith("http")
        ) {
          localStorage.setItem("profile_photo", photoData);

          const currentUser = this.getCurrent();
          if (currentUser) {
            currentUser.profilePhoto = photoData;
            localStorage.setItem("moodmate-user", JSON.stringify(currentUser));
          }

          console.log("Profile photo updated successfully");
        } else {
          console.error("Invalid photo data format");
        }
      } else {
        localStorage.removeItem("profile_photo");

        const currentUser = this.getCurrent();
        if (currentUser) {
          currentUser.profilePhoto = null;
          localStorage.setItem("moodmate-user", JSON.stringify(currentUser));
        }

        console.log("Profile photo removed");
      }
    } catch (error) {
      console.error("Error updating profile photo:", error);
    }
  },

  getProfilePhoto() {
    try {
      const photo = localStorage.getItem("profile_photo");

      if (
        photo &&
        (photo.startsWith("data:image/") || photo.startsWith("http"))
      ) {
        return photo;
      }

      return null;
    } catch (error) {
      console.error("Error getting profile photo:", error);
      return null;
    }
  },

  forceLogout() {
    try {
      localStorage.clear();

      location.hash = "/login";

      console.log("Force logout completed");
    } catch (error) {
      console.error("Error during force logout:", error);
      location.hash = "/login";
    }
  },

  async checkSessionHealth() {
    try {
      const sessionId = localStorage.getItem("moodmate-session-id");
      if (!sessionId) return { healthy: false, reason: "No sessionId" };

      const userData = this.getCurrent();
      if (!userData) return { healthy: false, reason: "No user data" };
      if (!userData.email)
        return { healthy: false, reason: "Invalid user data" };

      const profile = await this.getProfile();
      if (!profile) return { healthy: false, reason: "Cannot fetch profile" };

      return { healthy: true, reason: "Session is healthy" };
    } catch (error) {
      return { healthy: false, reason: error.message };
    }
  },

  getAll() {
    console.warn("UserModel.getAll() is deprecated. Use API instead.");
    return [];
  },

  find(email, password) {
    console.warn("UserModel.find() is deprecated. Use API login instead.");
    return null;
  },

  save(user) {
    console.warn("UserModel.save() is deprecated. Use API register instead.");
    return false;
  },
};
