import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongoose";
import { Schema, model, models, Model } from "mongoose";
import  { Fields, Files, File } from "formidable";
import { promises as fs } from "fs";

// Define more specific types for formidable files
interface FormidableFile extends File {
  filepath: string;
}

// Define the interface for the image document
interface ITicketImage {
  _id: Schema.Types.ObjectId;
  id: string;
  image: Buffer;
}

// Define the schema matching your actual DB structure
const TicketImageSchema = new Schema<ITicketImage>({
  id: { type: String, required: true, unique: true },
  image: { type: Buffer, required: true },
});

// Get or create the model with proper typing
const TicketImage: Model<ITicketImage> = models.TicketImage || model<ITicketImage>("TicketImage", TicketImageSchema);

// Simple in-memory cache to store images
const imageCache: Record<string, Buffer> = {};

// Disable Next.js default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse formidable form
const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
  const form = new IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Valid image ID is required" });
    }

    switch (req.method) {
      case "DELETE":
        return handleDelete(id, res);
      case "GET":
        return handleGet(id, res);
      case "PUT":
        return handlePut(req, res);
      default:
        res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function handleDelete(id: string, res: NextApiResponse) {
  const deletedImage = await TicketImage.findOneAndDelete({ id });

  if (!deletedImage) {
    console.log("Image not found for ID:", id);
    return res.status(404).json({ message: "Image not found" });
  }

  delete imageCache[id];
  console.log("Image deleted:", deletedImage.id);
  return res.status(200).json({ message: "Image deleted successfully" });
}

async function handleGet(id: string, res: NextApiResponse) {
  console.log("Searching for image with ID:", id);

  if (imageCache[id]) {
    console.log("Image retrieved from cache for ID:", id);
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=3600, immutable");
    return res.send(imageCache[id]);
  }

  const imageDoc = await TicketImage.findOne({ id });

  if (!imageDoc) {
    console.log("Image not found for ID:", id);
    return res.status(404).json({ message: "Image not found" });
  }

  imageCache[id] = imageDoc.image;
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  return res.send(imageDoc.image);
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { fields, files } = await parseForm(req);
  const imageFile = files.image as FormidableFile;

  if (!imageFile?.filepath) {
    return res.status(400).json({ message: "Valid image file is required" });
  }

  console.log("Parsed files:", files);
  console.log("Image file path:", imageFile.filepath);

  const imageBuffer = await fs.readFile(imageFile.filepath);
  
  if (!fields.id || typeof fields.id !== 'string') {
    return res.status(400).json({ message: "Valid ID is required in form fields" });
  }

  const updatedImage = await TicketImage.findOneAndUpdate(
    { id: fields.id },
    { image: imageBuffer },
    { new: true }
  );

  if (!updatedImage) {
    return res.status(404).json({ message: "Image not found" });
  }

  imageCache[fields.id] = imageBuffer;

  console.log("Image updated successfully:", updatedImage.id);
  return res.status(200).json({ 
    message: "Image updated successfully", 
    imageId: updatedImage.id 
  });
}