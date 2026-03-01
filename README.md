# English Learning App 📚

A comprehensive, full-stack English vocabulary learning platform designed to help users master new words efficiently. Built with **Next.js 15**, **Supabase**, and **Tailwind CSS**.

![English Learning App Preview](https://placehold.co/1200x600/e2e8f0/1e293b?text=English+Learning+App)

## 🌟 Key Features

*   **🔐 Secure Authentication**: Seamless sign-up and login system powered by Supabase Auth.
*   **📂 Vocabulary Management**: Create custom word sets or import them via JSON.
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

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18+)
*   npm or yarn
*   A Supabase account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/english-learning-app.git
    cd english-learning-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Rename `.env.local.example` to `.env.local` and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Setup Database:**
    Run the SQL scripts located in `supabase/migrations/` in your Supabase SQL Editor to set up tables and RLS policies.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📖 JSON Import Format

To import words, use a JSON file with the following structure:

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
