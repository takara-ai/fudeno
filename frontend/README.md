# Fudeno Frontend

This is the frontend application for Fudeno, an AI-powered corporate design generator. It provides an intuitive interface for users to create professional brand designs through natural language descriptions.

## Tech Stack

- Next.js 14 with App Router
- Tailwind CSS for styling
- Next Themes for dark/light mode support
- React Icons for UI elements
- Integration with Mistral and Anthropic AI APIs

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with required API keys:

```bash
cp .env.example .env
```

Then fill in your API keys in the `.env` file.

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - Reusable React components
- `public/` - Static assets
- `styles/` - Global styles and Tailwind configuration

## Deployment

The application is configured for deployment on Vercel. Simply connect your repository and Vercel will handle the rest.

## Environment Variables

Required environment variables:

- `ANTHROPIC_API_KEY` - For text generation
- `ANTHROPIC_MODEL` - Model identifier for text generation
- `ANTHROPIC_MODEL_LOGO` - Model identifier for logo generation
- `MISTRAL_AGENT_MODEL` - Finetuned Mistral model for SVG generation
- `MISTRAL_API_KEY` - For accessing Mistral API

<img width="1525" alt="image" src="https://github.com/user-attachments/assets/68db6585-3807-49c0-89fc-7a298c2abb02">

### Features

- Next.js 14 with app router
- Prebuilt components for a quick start
- Tailwind CSS
- Next Themes for dark mode
- React Icons
