import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/UserChats.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// Helper function to clean MongoDB connection string by removing duplicate query parameters
const cleanMongoUri = (uri) => {
  if (!uri) return uri;
  
  try {
    const [base, queryString] = uri.split("?");
    if (!queryString) return uri;
    
    const params = new URLSearchParams(queryString);
    // Remove duplicates by recreating the URLSearchParams (keeps last occurrence)
    const cleanParams = new URLSearchParams();
    
    // Get all unique keys
    const seenKeys = new Set();
    for (const [key, value] of params.entries()) {
      if (!seenKeys.has(key.toLowerCase())) {
        seenKeys.add(key.toLowerCase());
        cleanParams.append(key, value);
      }
    }
    
    const cleanQuery = cleanParams.toString();
    return cleanQuery ? `${base}?${cleanQuery}` : base;
  } catch (err) {
    console.log("Warning: Could not parse MongoDB URI, using original:", err.message);
    return uri;
  }
};

const connect = async () => {
  try {
    const mongoUri = cleanMongoUri(process.env.MONGO);
    // Log connection attempt (hide password for security)
    if (mongoUri) {
      const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
      console.log("Attempting to connect to MongoDB:", maskedUri);
    }
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    if (err.message.includes("authentication failed")) {
      console.error("\n⚠️  Authentication failed. Please check:");
      console.error("   1. Username and password in your .env file match MongoDB Atlas");
      console.error("   2. The database user exists in MongoDB Atlas (Database Access)");
      console.error("   3. Your IP address is whitelisted in Network Access");
      console.error("   4. The password doesn't contain special characters that need URL encoding");
    }
    console.log(err);
  }
};
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// app.get("/api/test", ClerkExpressRequireAuth(), (req, res) => {
//   const { userId } = req.auth;
//   console.log(userId);
//   res.send("Success");
// });

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = req.auth;
  const { text } = req.body;

  try {
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // Check if user chat exists

    const userChats = await UserChats.find({ userId: userId });

    if (!userChats.length) {
      const nextIndex = 1;
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: `AI ${nextIndex}`,
          },
        ],
      });

      await newUserChats.save();
    } else {
      const existing = userChats[0]?.chats || [];
      const nextIndex = existing.length + 1;
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: `AI ${nextIndex}`,
            },
          },
        }
      );
    }

    // Always respond with the new chat id
    return res.status(200).send(savedChat._id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error creating chat" });
  }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = req.auth;
  try {
    const userChats = await UserChats.find({ userId });
    const chats = userChats?.[0]?.chats || [];
    res.status(200).send(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error fetching userchats" });
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = req.auth;
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error fetching chat" });
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = req.auth;

  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];
  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error adding chat" });
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
  connect();
  console.log("Server running on 3000");
});
