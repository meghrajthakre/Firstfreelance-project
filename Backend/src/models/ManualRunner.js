const mongoose = require('mongoose');

const manualRunnerSchema = new mongoose.Schema(
    {
        matchId: { type: String, required: true, index: true },
        runnerId: { type: String, required: true },
        runnerName: { type: String, trim: true },
        lagai: { type: Number, default: 0 },
        khai: { type: Number, default: 0 },
        status: { type: String, trim: true, default: 'open' },
    },
    { timestamps: true }
);

manualRunnerSchema.index({ matchId: 1, runnerId: 1 }, { unique: true });

module.exports = mongoose.model('ManualRunner', manualRunnerSchema);
