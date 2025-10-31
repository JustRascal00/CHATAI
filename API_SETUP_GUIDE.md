# API Setup Guide for CHATAI

This document lists all the APIs and services you need to register for to get your API keys.

## 📋 Required APIs & Services

### 1. **Google Gemini AI API**
**Purpose:** Powers the AI chat functionality in your application.

**Where to get it:**
- **Website:** https://aistudio.google.com/apikey
- **Tutorial:** https://ai.google.dev/docs/get-started
- **Documentation:** https://ai.google.dev/docs

**Steps to get API Key:**
1. Go to https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Choose or create a Google Cloud project
5. Copy your API key

**Environment Variable Needed:**
- `VITE_GEMINI_PUBLIC_KEY` (Frontend - client/.env)

---

### 2. **ImageKit**
**Purpose:** Handles image uploads and storage for your application.

**Where to get it:**
- **Website:** https://imagekit.io/
- **Tutorial:** https://docs.imagekit.io/getting-started/quickstart-guides/upload-image-in-client-side-application
- **Documentation:** https://docs.imagekit.io/

**Steps to get API Keys:**
1. Go to https://imagekit.io/ and sign up
2. Create a new account or sign in
3. Go to Settings → API Keys section
4. Copy the following:
   - **URL Endpoint** (e.g., `https://ik.imagekit.io/your_imagekit_id`)
   - **Public Key**
   - **Private Key** (keep this secret!)

**Environment Variables Needed:**
- `VITE_IMAGE_KIT_ENDPOINT` (Frontend - client/.env)
- `VITE_IMAGE_KIT_PUBLIC_KEY` (Frontend - client/.env)
- `IMAGE_KIT_ENDPOINT` (Backend - backend/.env)
- `IMAGE_KIT_PUBLIC_KEY` (Backend - backend/.env)
- `IMAGE_KIT_PRIVATE_KEY` (Backend - backend/.env)

---

### 3. **Clerk (Authentication)**
**Purpose:** Provides user authentication and authorization for your application.

**Where to get it:**
- **Website:** https://clerk.com/
- **Tutorial:** https://clerk.com/docs/quickstarts/nextjs
- **Documentation:** https://clerk.com/docs

**Steps to get API Keys:**
1. Go to https://clerk.com/ and sign up
2. Create a new application
3. Go to Dashboard → API Keys
4. Copy the following:
   - **Publishable Key** (public, safe to use in frontend)
   - **Secret Key** (keep this secret, backend only!)

**Environment Variables Needed:**
- `VITE_CLERK_PUBLISHABLE_KEY` (Frontend - client/.env)
- `CLERK_SECRET_KEY` (Backend - backend/.env) - Usually auto-detected by Clerk SDK

---

### 4. **MongoDB (Database)**
**Purpose:** Stores your chat history and user data.

**Where to get it:**
- **Website:** https://www.mongodb.com/cloud/atlas/register
- **Tutorial:** https://www.mongodb.com/docs/atlas/getting-started/
- **Documentation:** https://www.mongodb.com/docs/

**Steps to get Connection String:**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a free cluster (M0 Sandbox)
4. Create a database user (username and password)
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Click "Connect" → "Connect your application"
7. Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)
8. Replace `<password>` with your actual password

**Environment Variable Needed:**
- `MONGO` (Backend - backend/.env) - Full MongoDB connection string

---

## 📝 Environment Files Setup

### Frontend (client/.env)
```env
VITE_GEMINI_PUBLIC_KEY=your_gemini_api_key_here
VITE_IMAGE_KIT_ENDPOINT=your_imagekit_endpoint_here
VITE_IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_API_URL=http://localhost:3000
```

### Backend (backend/.env)
```env
MONGO=your_mongodb_connection_string_here
IMAGE_KIT_ENDPOINT=your_imagekit_endpoint_here
IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key_here
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLIENT_URL=http://localhost:5173
PORT=3000
```

---

## 🔗 Quick Links Summary

| Service | Registration Link | Documentation |
|---------|------------------|---------------|
| **Google Gemini AI** | https://aistudio.google.com/apikey | https://ai.google.dev/docs |
| **ImageKit** | https://imagekit.io/ | https://docs.imagekit.io/ |
| **Clerk** | https://clerk.com/ | https://clerk.com/docs |
| **MongoDB Atlas** | https://www.mongodb.com/cloud/atlas/register | https://www.mongodb.com/docs/ |

---

## ⚠️ Important Notes

1. **Never commit your `.env` files to version control!** They should be in `.gitignore`
2. Keep your **Private Keys** and **Secret Keys** secure - never expose them in frontend code
3. For production, use environment variables in your hosting platform (Vercel, Heroku, etc.)
4. All these services offer free tiers that should be sufficient for development and small projects
5. Make sure to set proper CORS settings in Clerk and MongoDB for your frontend URL

---

## ✅ Checklist

- [ ] Google Gemini AI API key obtained
- [ ] ImageKit account created and API keys obtained
- [ ] Clerk account created and API keys obtained
- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] Frontend `.env` file created with all variables
- [ ] Backend `.env` file created with all variables
- [ ] Tested that all APIs are working correctly

