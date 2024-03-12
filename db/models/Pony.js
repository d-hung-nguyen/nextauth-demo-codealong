import mongoose from "mongoose";

const { Schema } = mongoose;

const ponySchema = new Schema({
  name: { type: String, required: true },
  alias: { type: String, required: true },
  url: { type: String, required: true },
  sex: { type: String, required: true },
  residence: { type: String, required: true },
  occupation: { type: String, required: true },
  kind: { type: [String], required: true },
  image: { type: [String], required: true },
});

const Pony = mongoose.models.Pony || mongoose.model("Pony", ponySchema);

export default Pony;
