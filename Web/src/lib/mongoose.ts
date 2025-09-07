
import mongoose, { Document, Model, Schema } from "mongoose";

// Base interface for all documents
interface BaseDocument extends Document {
  createdAt?: Date;
  updatedAt?: Date;
}

// Connect to MongoDB and specify the database
const connectDB = async (): Promise<boolean> => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Using existing MongoDB connection");
      return true;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    await mongoose.connect(`${process.env.MONGODB_URI}/ticketResell`);
    console.log("Connected to MongoDB - ticketResell");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
};

// OTP Interface and Schema
interface IOTP extends BaseDocument {
  userId: string;
  otp: string;
  expiresAt: Date;
  isUsed?: boolean;
}

const otpSchema = new Schema<IOTP>(
  {
    userId: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    isUsed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create indexes for better query performance
otpSchema.index({ userId: 1, expiresAt: 1 });

// Ticket Image Interface and Schema
interface ITicketImage extends BaseDocument {
  id: string;
  image: Buffer;
  contentType: string;
}

const ticketImageSchema = new Schema<ITicketImage>(
  {
    id: { type: String, required: true, unique: true, index: true },
    image: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the models
const Otp: Model<IOTP> = mongoose.models.Otp || mongoose.model<IOTP>("Otp", otpSchema);
const TicketImage: Model<ITicketImage> = mongoose.models.TicketImage || mongoose.model<ITicketImage>("TicketImage", ticketImageSchema);

// OTP Operations
const insertOtp = async (userId: string, otp: string, expiresAt: Date): Promise<IOTP | null> => {
  try {
    // Invalidate any existing OTPs for this user
    await Otp.updateMany(
      { userId, isUsed: false },
      { $set: { isUsed: true } }
    );

    // Create new OTP
    const otpRecord = new Otp({
      userId,
      otp,
      expiresAt,
    });

    await otpRecord.save();
    console.log("OTP saved successfully for user:", userId);
    return otpRecord;
  } catch (error) {
    console.error("Error saving OTP:", error);
    return null;
  }
};

const fetchOtpFromDb = async (userId: string): Promise<string | null> => {
  try {
    const otpRecord = await Otp.findOne({
      userId,
      expiresAt: { $gte: new Date() },
      isUsed: false,
    }).sort({ createdAt: -1 });

    return otpRecord?.otp || null;
  } catch (error) {
    console.error("Error fetching OTP:", error);
    return null;
  }
};

// Ticket Image Operations
const insertTicketImage = async (
  id: string,
  imageData: Buffer,
  contentType: string
): Promise<ITicketImage | null> => {
  try {
    // Check if image already exists
    const existingImage = await TicketImage.findOne({ id });
    
    if (existingImage) {
      // Update existing image
      existingImage.image = imageData;
      existingImage.contentType = contentType;
      await existingImage.save();
      console.log("Image updated successfully for ID:", id);
      return existingImage;
    }

    // Create new image
    const ticketImage = new TicketImage({
      id,
      image: imageData,
      contentType,
    });

    await ticketImage.save();
    console.log("Image saved successfully for ID:", id);
    return ticketImage;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
};

// Fetch Image Operation
const fetchTicketImage = async (id: string): Promise<ITicketImage | null> => {
  try {
    return await TicketImage.findOne({ id });
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

export {
  connectDB,
  TicketImage,
  Otp,
  insertOtp,
  fetchOtpFromDb,
  insertTicketImage,
  fetchTicketImage,
  type IOTP,
  type ITicketImage,
};