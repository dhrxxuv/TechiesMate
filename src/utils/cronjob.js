const cron = require('node-cron');
const ConnectionRequestModel = require('../models/connectionRequest');
const sendEmail = require('./sendEmailNodeMailer'); 
const { subDays, startOfDay, endOfDay } = require('date-fns');


cron.schedule('2 15 * * *', async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd
      }
    }).populate("fromUserId toUserId");

    const listEmails = [
      ...new Set(
        pendingRequests.map(req => req.toUserId?.emailId).filter(Boolean)
      )
    ];

    for (const email of listEmails) {
      try {
        const res = await sendEmail(
          email,
          "New Connection Request",
          `<h3>You have received a new <b>interested</b> connection request.</h3>`
        );
        console.log("Email sent to", email, res);
      } catch (err) {
        console.error("Error sending email to", email, err);
      }
    }
  } catch (err) {
    console.error("Cron job failed", err);
  }
});



// THis is what all these stars i.e. * presents
        // 1 star - optional / seconds
        // 2 star - minute
        // 3 star - hours
        // 4 star - days of month
        // 5 star - month
        // 6 star - days of week