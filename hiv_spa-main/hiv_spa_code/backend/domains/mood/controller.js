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
    const { userId } = req.params;
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7); // calculate the date 7 days ago

    try {
        const moods = await Mood.find({
            userId,
            date: {
                $gte: sevenDaysAgo, // filter for dates greater than or equal to 7 days ago
                $lte: today // filter for dates less than or equal to today
            }
        }).sort({ date: -1 }); // sort by date in descending order
        res.status(200).json(moods); // return the list of mood entries
    } catch (error) {
        res.status(500).json({ error: error.message }); // handle any errors
    }
};