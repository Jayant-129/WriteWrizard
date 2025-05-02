<div align="center">
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=61DAFB" alt="next.js" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Liveblocks-black?style=for-the-badge&logoColor=white&logo=liveblocks&color=FF865C" alt="liveblocks" />
    <img src="https://img.shields.io/badge/-Gemini_AI-black?style=for-the-badge&logoColor=white&logo=googlegemini&color=8E75B2" alt="gemini AI" />
  </div>

  <h1 align="center">WriteWrizard</h1>
  <h3 align="center">AI-Powered Collaborative Document Editor</h3>

   <div align="center">
     A real-time collaborative document editor with AI writing assistance
    </div>
</div>

## 📋 Table of Contents

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🧩 [AI Writing Assistant](#ai-writing-assistant)
6. 🔄 [Collaboration Features](#collaboration-features)
7. 👥 [Usage](#usage)
8. 🚀 [Deployment](#deployment)

## <a name="introduction">🤖 Introduction</a>

WriteWrizard is an AI-powered collaborative document editor that enables seamless teamwork and enhanced writing productivity. Built with Next.js to handle the user interface, Liveblocks for real-time collaboration features, Gemini AI for intelligent writing assistance, and styled with TailwindCSS, this application allows multiple users to work together on documents in real-time while leveraging AI to improve their writing.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Frontend**: Next.js, TypeScript, TailwindCSS, ShadCN UI
- **Real-time Collaboration**: Liveblocks
- **Editor**: Lexical Editor
- **Authentication**: Clerk
- **AI Integration**: Google Gemini AI
- **Styling**: Tailwind CSS

## <a name="features">🔋 Features</a>

👉 **Authentication**: User authentication using GitHub through Clerk, ensuring secure sign-in/out and session management.

👉 **AI-Powered Writing Assistant**: Intelligent writing suggestions, title recommendations, and content improvements using Google Gemini AI.

👉 **Collaborative Text Editor**: Multiple users can edit the same document simultaneously with real-time updates.

👉 **Documents Management**:

- **Create Documents**: Users can create new documents, which are automatically saved and listed.
- **Delete Documents**: Users can delete documents they own.
- **Share Documents**: Users can share documents via email or link with view/edit permissions.
- **List Documents**: Display all documents owned or shared with the user, with search and sorting functionalities.

👉 **Comments**: Users can add inline and general comments, with threading for discussions.

👉 **Active Collaborators**: Show active collaborators with real-time presence indicators.

👉 **Notifications**: Notify users of document shares, new comments, and collaborator activities.

👉 **Rich Text Editing**: Support for headings, formatting, alignment, and other text styling options.

👉 **Responsive**: The application is responsive across all devices.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v16.x or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Installation**

1. Clone the repository:

```bash
git clone https://github.com/yourusername/WriteWrizard.git
cd WriteWrizard
```

2. Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=

# Google Gemini AI
GOOGLE_AI_STUDIO_API_KEY=
```

Replace the placeholder values with your actual Clerk, LiveBlocks, and Google AI Studio credentials. You can obtain these credentials by signing up on:

- [Clerk](https://clerk.com/)
- [Liveblocks](https://liveblocks.io/)
- [Google AI Studio](https://makersuite.google.com/)

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="ai-writing-assistant">🧩 AI Writing Assistant</a>

WriteWrizard features an AI-powered writing assistant that helps users improve their documents:

- **Smart Suggestions**: Get real-time suggestions for improving your text
- **Title Generation**: AI can suggest document titles based on content
- **Content Enhancement**: Request AI assistance for rewriting, improving, or expanding sections
- **Formatting Help**: AI can help with proper formatting and structure

Access the AI assistant through the magic wand icon in the editor toolbar.

## <a name="collaboration-features">🔄 Collaboration Features</a>

WriteWrizard enables real-time collaboration with:

- **Presence Awareness**: See who is currently viewing or editing the document
- **Cursor Tracking**: View other users' cursors in real-time
- **Comment Threading**: Have discussions within comments
- **Permission Management**: Control who can view or edit your documents

## <a name="usage">👥 Usage</a>

1. **Sign in** using your credentials
2. **Create a new document** or access existing shared documents
3. **Edit your document** using the rich text editor
4. **Use AI assistance** by clicking the magic wand icon
5. **Share your document** with collaborators by clicking the share button
6. **Add comments** to discuss specific parts of the document

## <a name="deployment">🚀 Deployment</a>

This project can be easily deployed on [Vercel](https://vercel.com/):

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Configure the environment variables
4. Deploy

---

<div align="center">
  <h3>Built with ❤️ by <a href="https://github.com/yourusername">Your Name</a></h3>
  <p>Updated: April 2025</p>
</div>
