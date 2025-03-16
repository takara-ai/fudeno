# Fudeno - AI-Powered Corporate Design Generator

<img src="https://fudeno.pages.dev/logo.svg" width="200" alt="fudeno Logo" />

## Overview

Fudeno ("Pen Brain" in Japanese) is an AI-powered platform that revolutionizes corporate design creation. It enables businesses to generate professional brand designs through simple text descriptions, significantly reducing the time and cost associated with traditional design processes.

## Architecture

The platform consists of two main components:

1. **Frontend Application**

   - Built with NextJS for a modern, responsive user interface
   - Handles user interactions and API orchestration
   - Implements real-time design preview and generation

2. **AI Logo Generator**
   - Powered by a finetuned Mistral Large 2 model
   - Specialized in generating SVG vector logos
   - Trained on the takara-ai/fudeno-instruct-4M dataset

## Quick Start

### Frontend Setup

1. Create a `.env` file in the frontend directory with the following required variables:

```
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_MODEL=your_model_here
ANTHROPIC_MODEL_LOGO=your_logo_model_here
MISTRAL_AGENT_MODEL=your_agent_model_here
MISTRAL_API_KEY=your_key_here
```

2. Install dependencies and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## AI Model Training

### Dataset Preparation

The logo generation model is trained using the takara-ai/fudeno-instruct-4M dataset. To prepare the training data:

1. Navigate to the finetuning directory:

```bash
cd finetuning
pip install -r requirements.txt
```

2. Generate the JSONL training dataset:

```bash
python dataset.py
```

This script:

- Processes the fudeno-instruct-4M dataset
- Converts examples to the Mistral instruct format
- Generates a JSONL file ready for model finetuning

### Model Configuration

The production model uses:

- Base: Mistral Large 2
- Training data: 10K training examples, 1K validation examples
- Server prompt configuration: Uses primary color as fill
- Endpoint: Deployed as a Mistral agent

## Example Usage

Input:

```
Create a simple icon composed of 1 path with clean, minimal design representing Speech bubble.
```

Output:

```svg
<svg viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
  <path d="M20.7134 8.12811L20.4668 8.69379C20.2864 9.10792 19.7136 9.10792 19.5331 8.69379L19.2866 8.12811C18.8471 7.11947 18.0555 6.31641 17.0677 5.87708L16.308 5.53922C15.8973 5.35653 15.8973 4.75881 16.308 4.57612L17.0252 4.25714C18.0384 3.80651 18.8442 2.97373 19.2761 1.93083L19.5293 1.31953C19.7058 0.893489 20.2942 0.893489 20.4706 1.31953L20.7238 1.93083C21.1558 2.97373 21.9616 3.80651 22.9748 4.25714L23.6919 4.57612C24.1027 4.75881 24.1027 5.35653 23.6919 5.53922L22.9323 5.87708C21.9445 6.31641 21.1529 7.11947 20.7134 8.12811ZM10 3H14V5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17H14C17.3137 17 20 14.3137 20 11H22C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3Z"/>
</svg>
```
