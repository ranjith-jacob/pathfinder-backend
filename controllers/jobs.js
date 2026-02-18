const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Job = require("../models/job.js");
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
    try {
        req.body.employee = req.user._id;
        const job = await Job.create(req.body);
        job._doc.employee = req.user;
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});


router.get("/", verifyToken, async (req, res) => {
    try {
        const jobs = await Job.find({ "employee": req.user._id }).populate("employee").sort({ createdAt: "desc" });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});


router.get("/:jobId", verifyToken, async (req, res) => {
    try {
        const job = await Job.findOne({ "_id": req.params.jobId, "employee": req.user._id }).populate("employee");
        if (!job) {
           return res.status(400).json({ message: "Job not found" });
        }
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});


router.put("/:jobId", verifyToken, async (req, res) => {
    try {
        const updatedJob = await Job.findOneAndUpdate({
            "_id": req.params.jobId,
            "employee": req.user._id
            },
            req.body, {
                new: true,
                runValidators: true
            }).populate("employee");

        if(!updatedJob){
          return res.status(404).json({ message: "You are not authorised for this action!" });
        }
        res.status(200).json(updatedJob);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});


router.delete("/:jobId", verifyToken, async (req, res) => {
    try {
        const deletedJob = await Job.findOneAndDelete({
            "_id": req.params.jobId,
            "employee": req.user._id
        });
        if (!deletedJob) {
           return res.status(403).json({ message: "You are not authorised to delete this!" });
        }
        res.status(200).json(deletedJob);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});


router.post("/:jobId/notes", verifyToken, async (req, res) => {
    try {
        const job = await Job.findOne({
            "_id": req.params.jobId,
            "employee": req.user._id
        });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (!req.body.text) {
            return res.status(400).json({ message: "Note text is required" });
        }
        job.notes.push({
            "text": req.body.text
        });
        await job.save();
        const newNote = job.notes[job.notes.length -1];
        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});


router.put("/:jobId/notes/:noteId", verifyToken, async (req, res) => {
    try {
          const job = await Job.findOne({
            "_id": req.params.jobId,
            "employee" : req.user._id
        });
        if (!job) {
            return res.status(403).json({ message: "You are not authorised to edit this note" });
        }
        const note = job.notes.id(req.params.noteId);
        note.text = req.body.text;
        await job.save();
        res.status(200).json({ message: "Note changed successfully!" })
    } catch (err) {
        res.status(500).json({ err : err.message })
    }
});


router.delete("/:jobId/notes/:noteId", verifyToken, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(403).json({ message: "You are not authorised to edit this note" });
        }
        const note = job.notes.id(req.params.noteId);
        note.deleteOne();
        await job.save();
        res.status(200).json({ message: "Note deleted successfully!" });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});


module.exports = router;
