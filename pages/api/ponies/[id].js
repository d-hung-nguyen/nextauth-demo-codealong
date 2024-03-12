import dbConnect from "@/db/dbConnect";
import Pony from "@/db/models/Pony";

export default async function handler(request, response) {
  await dbConnect();

  const { id } = request.query;

  if (request.method === "GET") {
    const pony = await Pony.findById(id);
    return response.status(200).json(pony);
  }
}
