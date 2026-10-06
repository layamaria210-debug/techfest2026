const express = require("express");
const Event = require("../Models/Event");
const auth = require("../Middleware/auth");

const router = express.Router();

// GET all events
router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    next(err);
  }
});

// GET one event
router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    res.json(event);
  } catch (err) {
    next(err);
  }
});

// POST - add event (JWT protected)
router.post("/", auth, async (req, res, next) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
});

// PUT - update event
router.put("/:id", auth, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!event) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    res.json(event);
  } catch (err) {
    next(err);
  }
});

// DELETE - delete event
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    res.json({
      message: "Event deleted"
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;