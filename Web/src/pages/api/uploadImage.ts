import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { promises as fs } from "fs";
import { connectDB, insertTicketImage } from "@/lib/mongoose";

export const config = {
    api: {
        bodyParser: false,
    },
};

// Define types for better type safety
type FormidableFile = {
    filepath: string;
    originalFilename: string;
    mimetype?: string;
    size: number;
};

type FormidableFiles = {
    image?: FormidableFile[];
};

type FormidableFields = {
    id?: string[];
};

const uploadImage = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // Connect to the database
        await connectDB();

        // Create promise-based wrapper for formidable
        const parseForm = async (): Promise<{
            fields: FormidableFields;
            files: FormidableFiles;
        }> => {
            return new Promise((resolve, reject) => {
                const form = formidable({
                    multiples: false,
                    keepExtensions: true,
                });

                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    resolve({ fields: fields as FormidableFields, files: files as FormidableFiles });
                });
            });
        };

        // Parse the form
        const { fields, files } = await parseForm();

        // Get the image file
        const imageFile = files.image?.[0];
        const imageId = fields.id?.[0];

        if (!imageFile) {
            return res.status(400).json({ message: "No image file provided" });
        }

        if (!imageId) {
            return res.status(400).json({ message: "No ID provided" });
        }

        // Read the image data
        const imageData = await fs.readFile(imageFile.filepath);

        // Insert the image into the database
        await insertTicketImage(imageId, imageData, imageFile.mimetype || "application/octet-stream");

        // Clean up: remove the temporary file
        await fs.unlink(imageFile.filepath);

        return res.status(200).json({ message: "Image uploaded successfully" });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Error uploading image" });
    }
};

export default uploadImage;