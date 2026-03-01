# English Learning App 📚

A comprehensive, full-stack English vocabulary learning platform designed to help users master new words efficiently. Built with **Next.js 15**, **Supabase**, and **Tailwind CSS**.

![English Learning App Preview](https://placehold.co/1200x600/e2e8f0/1e293b?text=English+Learning+App)

## 🌟 Key Features

*   **🔐 Secure Authentication**: Seamless sign-up and login system powered by Supabase Auth. Includes **Google Login** integration.
*   **📂 Vocabulary Management**: Create custom word sets or import them via JSON.
*   **🤖 AI-Assisted Import**: Built-in prompt generator to help you create vocabulary lists using ChatGPT/Claude.
*   **🧠 Interactive Learning Modes**:
    *   **Flashcards**: Classic flip-card study with bilingual definitions.
    *   **Quiz**: Test your recall with multiple-choice questions.
    *   **Spelling**: Practice correct spelling with definition hints.
    *   **Sentence Building**: Reassemble scrambled sentences to master usage.
*   **🎲 Randomized Sessions**: Every study session is shuffled to ensure effective learning and prevent pattern memorization.
*   **📱 Responsive Design**: Optimized for both desktop and mobile devices.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Shadcn UI
*   **Backend & Database**: Supabase (PostgreSQL, Auth)
*   **Language**: TypeScript

## ⚡️ Comprehensive Supabase Setup Guide

This project relies on Supabase for authentication and database storage. Follow these steps to set up your own backend.

### 1. Create a Supabase Project
1.  Go to [Supabase](https://supabase.com/) and sign in.
2.  Click **"New Project"**.
3.  Choose your organization, give it a name (e.g., `English Learning App`), and set a secure database password.
4.  Select a region close to your users.
5.  Click **"Create new project"** and wait for it to initialize.

### 2. Database Schema Setup
1.  Once your project is ready, go to the **SQL Editor** (icon on the left sidebar).
2.  Click **"New Query"**.
3.  Copy and paste the contents of the migration files located in this repository at `supabase/migrations/`.
    *   First, run the content of `0000_init.sql` (Creates tables and RLS policies).
    *   Then, run the content of `0001_add_definition_zh.sql` (Adds Chinese definition support).
4.  Click **"Run"** to execute the SQL and create your tables.

### 3. Environment Variables
1.  Go to **Project Settings** (gear icon) -> **API**.
2.  Copy the `Project URL` and `anon public` key.
3.  In your local project, rename `.env.local.example` to `.env.local`.
4.  Paste the values:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    ```

### 4. Authentication Setup
1.  Go to **Authentication** -> **Providers**.
2.  **Email/Password**: Enabled by default.
3.  **Google (Optional)**:
    *   Enable **Google**.
    *   You will need a **Client ID** and **Client Secret** from the [Google Cloud Console](https://console.cloud.google.com/).
    *   In Google Cloud Console, create an OAuth 2.0 Client ID (Web Application).
    *   Add your Supabase Callback URL (found in the Supabase Google Provider settings, usually `https://<project-ref>.supabase.co/auth/v1/callback`) to **Authorized redirect URIs**.
    *   Paste the Client ID and Secret back into Supabase and save.

### 5. URL Configuration (Crucial for Vercel Deployment)
1.  Go to **Authentication** -> **URL Configuration**.
2.  **Site URL**: Set this to your production URL (e.g., `https://your-app.vercel.app`).
3.  **Redirect URLs**: Add `https://your-app.vercel.app/**` to allow all sub-paths (like `/auth/callback`) to work correctly.
4.  If developing locally, make sure `http://localhost:3000` is also present.

## 🚀 Getting Started (Local Development)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/english-learning-app.git
    cd english-learning-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.


## 📖 JSON Import Format

To import words, use a JSON file with the following structure. You can use the built-in AI prompt in the "Import JSON" dialog to generate this format automatically.

```json
[
  {
    "word": "serendipity",
    "definition": "The occurrence of events by chance in a happy or beneficial way.",
    "definition_zh": "機緣巧合",
    "example": "We found the restaurant by pure serendipity."
  }
]
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
