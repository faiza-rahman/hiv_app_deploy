const Mood = require("./model");

// log or update mood for a day
exports.logMood = async (req, res) => {
    const { userId, date, mood, diaryEntry } = req.body;

    try {
        let moodEntry = await Mood.findOne({ userId, date });

        if (moodEntry) {
            moodEntry.mood = mood; // update mood
            moodEntry.diaryEntry = diaryEntry || moodEntry.diaryEntry; // update diary entry
        } else {
            moodEntry = new Mood({
                userId,
                date,
                mood, // set mood
                diaryEntry: diaryEntry || "", // set diary entry if provided
                hasDiaryEntry: !!diaryEntry // set hasDiaryEntry based on diary entry
            });
        }

        await moodEntry.save(); // save the mood entry
        res.status(200).json(moodEntry); // return the saved mood entry
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get mood history for the last 7 days
exports.getWeeklyMood = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Get the date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      console.log("querying moods for userId:", userId);  
      console.log("data range: From", sevenDaysAgo);  
      // Query the database for mood logs in the past 7 days
      const moodLogs = await Mood.find({
        userId,
        date: { $gte: sevenDaysAgo }, // Filter by date >= 7 days ago
      }).sort({ date: -1 }); // Sort by date descending
      console.log("moodLogs found:", moodLogs);
      res.json(moodLogs);
    } catch (error) {
      console.error("Error fetching weekly mood data:", error.message);
      res.status(500).json({ message: error.message });
    }
  };