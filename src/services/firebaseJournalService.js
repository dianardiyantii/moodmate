import { 
  db, 
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "../utils/firebase.js";
import { getRandomActivities } from "../data/moodActivities";
import { getRandomSongs } from "../data/moodSongs";

const FirebaseJournalService = {
  getCurrentUserEmail() {
    const currentUser = localStorage.getItem("moodmate-current-user");
    if (!currentUser) {
      throw new Error("User tidak ditemukan. Silakan login kembali.");
    }
    return currentUser;
  },

  async saveJournalEntry(entryData) {
    try {
      const userEmail = this.getCurrentUserEmail();

      const recommendedActivities = getRandomActivities(
        entryData.mood || "neutral",
        4
      );
      const recommendedSongs = getRandomSongs(entryData.mood || "neutral", 3);

      const journalEntry = {
        userEmail: userEmail,
        tanggal: entryData.tanggal,
        catatan: entryData.catatan,
        aktivitas: entryData.aktivitas || [],
        mood: entryData.mood,
        confidence: entryData.confidence,
        text: entryData.text,
        activities: entryData.activities || [],
        predictedByAI: entryData.predictedByAI || false,
        rawMoodData: entryData.rawMoodData || {},
        recommendedActivities: recommendedActivities,
        recommendedSongs: recommendedSongs.map((song) => ({
          title: song.title,
          artist: song.artist,
          link: song.link,
          emoji: song.emoji || "🎵",
        })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "journal_entries"),
        journalEntry
      );

      console.log("Journal entry saved to Firestore with ID:", docRef.id);
      console.log("Recommendations saved:", {
        activities: recommendedActivities.length,
        songs: recommendedSongs.length,
      });

      return {
        success: true,
        id: docRef.id,
        data: journalEntry,
      };
    } catch (error) {
      console.error("Error saving journal entry to Firestore:", error);
      throw error;
    }
  },

  async getUserJournalEntries() {
    try {
      const userEmail = this.getCurrentUserEmail();

      const q = query(
        collection(db, "journal_entries"),
        where("userEmail", "==", userEmail),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const entries = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          ...data,
          timestamp: data.createdAt?.toDate()?.toISOString(),
          date: data.createdAt?.toDate()?.toISOString(),
        });
      });

      console.log("Retrieved journal entries from Firestore:", entries);
      return entries;
    } catch (error) {
      console.error("Error getting journal entries from Firestore:", error);
      throw error;
    }
  },

  async saveCustomActivity(activityData) {
    try {
      const userEmail = this.getCurrentUserEmail();

      const customActivityData = {
        nama: activityData.nama,
        icon: activityData.icon || "⭐",
        userEmail,
        isCustom: true,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "custom_activities"),
        customActivityData
      );

      console.log("Custom activity saved to Firestore:", docRef.id);
      return {
        success: true,
        id: docRef.id,
        data: customActivityData,
      };
    } catch (error) {
      console.error("Error saving custom activity to Firestore:", error);
      throw error;
    }
  },

  async getUserCustomActivities() {
    try {
      const userEmail = this.getCurrentUserEmail();
      const customActivities = [];

      const q = query(
        collection(db, "custom_activities"),
        where("userEmail", "==", userEmail),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        customActivities.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(
        "Retrieved custom activities from Firestore:",
        customActivities
      );
      return customActivities;
    } catch (error) {
      console.error("Error fetching custom activities from Firestore:", error);
      return [];
    }
  },

  async deleteCustomActivity(activityId) {
    try {
      await deleteDoc(doc(db, "custom_activities", activityId));
      console.log("Custom activity deleted from Firestore:", activityId);
      return { success: true };
    } catch (error) {
      console.error("Error deleting custom activity from Firestore:", error);
      throw error;
    }
  },

  async updateJournalEntry(entryId, updateData) {
    try {
      const userEmail = this.getCurrentUserEmail();

      let updateDataWithRecommendations = { ...updateData };

      if (updateData.mood) {
        updateDataWithRecommendations.recommendedActivities =
          getRandomActivities(updateData.mood, 4);
        updateDataWithRecommendations.recommendedSongs = getRandomSongs(
          updateData.mood,
          3
        ).map((song) => ({
          title: song.title,
          artist: song.artist,
          link: song.link,
          emoji: song.emoji || "🎵",
        }));
      }

      updateDataWithRecommendations.updatedAt = serverTimestamp();

      const journalRef = doc(db, "journal_entries", entryId);
      await updateDoc(journalRef, updateDataWithRecommendations);

      console.log("Journal entry updated with new recommendations");
      return { success: true };
    } catch (error) {
      console.error("Error updating journal entry:", error);
      throw error;
    }
  },

  async deleteJournalEntry(entryId) {
    try {
      await deleteDoc(doc(db, "journal_entries", entryId));
      console.log("Journal entry deleted from Firestore:", entryId);
      return { success: true };
    } catch (error) {
      console.error("Error deleting journal entry from Firestore:", error);
      throw error;
    }
  },
};

export default FirebaseJournalService;