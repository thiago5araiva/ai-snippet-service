# AI Snippet Service

A modern web application that helps developers manage and share code snippets with AI-powered features.

## 🚀 Features

- Create and manage code snippets
- AI-powered code analysis and suggestions
- Modern, responsive UI built with React and Tailwind CSS
- RESTful API backend with Express and TypeScript
- Docker support for easy deployment

## 🛠️ Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios for API communication

### Backend

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- OpenAI Integration
- Jest for testing

## 📋 Prerequisites

- Node.js 20.x
- Yarn package manager
- Docker and Docker Compose (for containerized deployment)
- MongoDB (if running locally)

## 🚀 Getting Started

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ai-snippet-service.git
cd ai-snippet-service
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
yarn install

# Install frontend dependencies
cd ../frontend
yarn install
```

3. Set up environment variables:

   - Create `.env` files in both `backend` and `frontend` directories
   - See `.env.example` files for required variables

4. Start the development servers:

```bash
# Start backend (from backend directory)
yarn dev

# Start frontend (from frontend directory)
yarn dev
```

### Docker Setup

1. Build and start the containers:

```bash
docker-compose up --build
```

The application will be available at:

- Frontend: http://localhost:3030
- Backend: http://localhost:3000

## 🧪 Testing

```bash
# Run backend tests
cd backend
yarn test

# Run frontend tests
cd frontend
yarn test
```

## 📦 Project Structure

```
ai-snippet-service/
├── backend/           # Express.js backend
│   ├── src/          # Source files
│   ├── tests/        # Test files
│   └── package.json  # Backend dependencies
├── frontend/         # React frontend
│   ├── src/         # Source files
│   └── package.json # Frontend dependencies
└── docker-compose.yml # Docker configuration
```

## 🔧 Environment Variables

### Backend (.env)

```
PORT=3000
MONGODB_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
