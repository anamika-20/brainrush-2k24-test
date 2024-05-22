import { Schema, model, models } from "mongoose";

const resultsSchema = new Schema({
  team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  score: {
    type: Number,
  },
  time: {
    type: Date,
  },
});
const Results = (models && models.Results) || model("Results", resultsSchema);
export default Results;
