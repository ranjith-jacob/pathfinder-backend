const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

const jobSchema = new mongoose.Schema(
    {
        position: {
            type: String,
            required: true,
            trim: true
        },
        companyName: {
            type: String,
            required: true,
            trim: true   
        },
        salary: {
            type: Number,
            min: 0
        },
        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary", "Zero-Hour"],
            required: true
        },
        workArrangement: {
            type: String,
            enum: ["Remote", "In-person", "Hybrid"],
            required: true
        },
        location: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        employer: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["Applied", "Interviewing", "Offer", "Rejected", "Prospective"],
            default: "Prospective"
        },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        notes: [noteSchema]
    },
    { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

