import dbConnect from "@/db/dbConnect";
import Pony from "@/db/models/Pony";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    const ponies = await Pony.find();
    return response.status(200).json(ponies);
  }
}
