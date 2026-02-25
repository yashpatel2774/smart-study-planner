const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Subscription = require("../models/Subscription");

// save subscription
router.post("/subscribe", auth, async (req, res) => {
  const sub = await Subscription.findOneAndUpdate(
    { user: req.user },
    { subscription: req.body },
    { upsert: true, new: true }
  );

  res.json({ message: "Subscribed" });
});

module.exports = router;