# Motionxyne — Creative Post-Production & Video Editing Studio

Official website and client onboarding platform for **Motionxyne**, founded by **Sayan** in Bhubaneswar, India.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB (Official `mongodb` driver)
- **Validation**: Zod
- **Icons**: Lucide React

---

## MongoDB Setup & Form Submissions

Form submissions from the website are automatically validated with Zod schemas and saved into collections in your MongoDB database:

1. **Project Inquiries & Quotes** (from `ContactForm`):  
   - API Endpoint: `POST /api/contact`  
   - MongoDB Collection: `inquiries`  
   - Fields stored:
     - `fullName`, `email`, `phone`, `companyName`
     - `serviceType`, `platform`, `budgetRange`, `deadline`
     - `projectDescription`, `referenceVideoUrl`, `additionalRequirements`
     - `status`: `'new'`
     - `clientIp`, `userAgent`, `createdAt`, `updatedAt`

2. **Editor Applications** (from `EditorApplicationForm`):  
   - API Endpoint: `POST /api/editor-applications`  
   - MongoDB Collection: `editor_applications`  
   - Fields stored:
     - `fullName`, `email`, `phone`, `location`
     - `experienceLevel`, `primarySoftware`, `portfolioUrl`, `sampleWorkUrl`
     - `preferredProjectType`, `weeklyAvailability`, `motivation`
     - `status`: `'pending'`
     - `clientIp`, `userAgent`, `createdAt`, `updatedAt`

---

## Environment Configuration

In `.env.local`:

```env
# MongoDB Database Connection
# If using MongoDB Atlas:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/motion?retryWrites=true&w=majority

# If using local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/motion

MONGODB_DB_NAME=motion
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm start
```
