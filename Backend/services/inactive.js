const User = require("../models/user");
const UserProfile = require("../models/userprofile");
const { sendEmail } = require("./Mails");

async function checkInactiveUsers() {

    // 48 hours ago
    const hours48Ago = new Date(
        Date.now() - 48 * 60 * 60 * 1000
    );

    const users = await User.find({
        lastClick: { $lt: hours48Ago },
        alertSent: false
    });

    const profiles = await UserProfile.find({
        userId: { $in: users.map(u => u._id) }
    });

    for (const profile of profiles) {

        for (const contact of profile.emergencyContacts) {

            const subject =
                "🚨 Emergency Alert - User Inactive";

            const message = `
Alert!

${profile.name} has been inactive for over 48 hours.

Please check on them immediately.
`;

            try {

              await sendEmail(
              contact.email,
              subject,
              message
              );
            } catch (err) { console.log(err.message) }
        }

        await User.findByIdAndUpdate(
            profile.userId,
            { alertSent: true }
            );
        }
}

module.exports = { checkInactiveUsers };