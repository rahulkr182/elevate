# Elevate: MERN Stack Fitness Tracker 🚀

Elevate is a high-performance, modern fitness tracking application built on the MERN stack. It moves beyond simple CRUD operations to deliver an intelligent, portfolio-ready experience—featuring an **AI-powered Fitness Coach**, dynamic data visualizations, and a premium glassmorphic UI.

## 🔥 Killer Features

- **🧠 AI Fitness Coach**: Integrates with OpenAI's GPT-4o-mini to provide personalized, actionable advice based on the user's daily macro consumption and long-term goals.
- **📊 Interactive Analytics**: Utilizes `recharts` to render a dynamic 7-day trailing history of calorie intake, helping users spot trends at a glance.
- **🎯 Precision Goal Tracking**: Real-time progress bars calculate the daily percentage of calories and protein consumed against custom user targets.
- **🔐 Secure Authentication**: JWT-based stateless authentication ensures user data is protected, with bcrypt password hashing.
- **✨ Premium UI/UX**: Built with React and TailwindCSS v4, featuring a sleek dark-mode aesthetic, smooth micro-animations, and glassmorphism.

## 🛠️ Tech Stack

**Frontend**
- React 19 (Vite)
- TailwindCSS v4
- Recharts (Data Visualization)
- Lucide React (Icons)
- Axios & React Router

**Backend**
- Node.js & Express
- MongoDB & Mongoose
- OpenAI API
- JSON Web Tokens (JWT) & Bcrypt

## 📸 Screenshots

*(Replace with actual screenshots of your deployed app)*
- **Dashboard Overview**: `![Dashboard](link-to-image)`
- **AI Coach in Action**: `![AI Coach](link-to-image)`
- **Data Analytics**: `![Analytics](link-to-image)`

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- OpenAI API Key

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/elevate-fitness.git
   cd elevate-fitness
   \`\`\`

2. **Backend Setup**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`
   Create a `.env` file in the `backend` directory:
   \`\`\`env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/fitness_tracker
   JWT_SECRET=your_super_secret_jwt_key
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`
   Start the backend server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Frontend Setup**
   Open a new terminal and navigate to the frontend folder:
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`
   Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to \`http://localhost:5173\` to see the app in action!

## 🌐 Deployment (Recommended)

To make this project truly portfolio-ready, deploy the components:
- **Frontend**: Deploy on [Vercel](https://vercel.com/)
- **Backend**: Deploy on [Render](https://render.com/) or [Railway](https://railway.app/)
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/atlas/database)

---
*Crafted with precision to demonstrate full-stack capabilities, API integration, and modern frontend design.*
