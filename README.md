# FlowCraft AI

FlowCraft AI is a powerful web application designed for UX designers to streamline their workflow creation process. It leverages AI to transform natural language project briefs into interactive, editable user flow diagrams with UI component suggestions.

![FlowCraft AI](https://res.cloudinary.com/dhruvandev/image/upload/LeandingPage_itlx6z.png)

## 🚀 Features

### 🎙️ Voice Input for Project Briefs

- Speak your project brief instead of typing
- Makes input faster and more accessible
- Seamless voice-to-text conversion

### 🧠 AI-Generated UX Flows

- Transform text briefs into structured user flows
- Each step includes suggested UI components
- Intelligent flow organization based on user needs

### 🔄 Interactive Flow Diagram

- Drag-and-drop node manipulation
- Add, edit, or remove steps
- Connect nodes to create complex flows
- Visual flow representation

### 💡 AI-Powered Suggestions

- Get real-time AI suggestions for improvements
- Alternative steps and component
- Context-aware recommendations

### 📤 Multiple Export Options

- JSON export for developers
- PNG export for quick sharing
- Seamless integration into design workflows

### 💾 Save and Load Flows

- Save work to database (authenticated users)
- Organize flows with folders
- Search and filter saved flows

### 🧩 UI Component Visualization

- Visual component suggestions for each step
- Quick component identification
- Modern UI component recommendations

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI** components
- **Framer Motion** for animations
- **Zustand** for state management

### Backend & Database

- **Next.js API Routes**
- **PostgreSQL** with **Drizzle ORM**
- **Better Auth** for authentication

### AI Integration

- **Anthropic Claude** via AI SDK
- **Vercel AI SDK**

### Flow Visualization

- **React Flow** for interactive diagrams

## 📋 Installation

1. Clone the repository:

```bash
git clone https://github.com/vakharwalad23/FlowCraft-AI.git
cd flowcraft-ai
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/flowcraft"

# Authentication
AUTH_SECRET="your-auth-secret"
AUTH_URL="http://localhost:3000"

# AI
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

4. Set up the database:

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🧪 Sample .env File

```
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/flowcraft"

# Authentication
AUTH_SECRET="complex-random-string-for-auth"
AUTH_URL="http://localhost:3000"

# AI
ANTHROPIC_API_KEY="sk-ant-api-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 📚 Project Structure

- `/app` - Next.js application routes and API endpoints
- `/components` - React components organized by functionality
- `/db` - Database schema and connection setup
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and shared code
- `/store` - Zustand state management
- `/public` - Static assets

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React Flow](https://reactflow.dev/)
- [Anthropic Claude](https://www.anthropic.com/)
- [Vercel](https://vercel.com/)
- [Shadcn UI](https://ui.shadcn.com/)
