<img src="https://fudeno.pages.dev/logo.svg" width="200" alt="fudeno Logo" />

Fudeno means "Pen Brain" in japanese, it's an intuitive interface for anyone to quickly create corporate designs by just describing their business in a few easy steps.

It cuts out significant cost and time it takes conversing with external design teams and allows the user to ideate and get started with their brand **fast**.

Fudeno is comprised of 2 main components:

- a NextJS frontend application for the user experience and orchestration of API's
- a finetuned Mistral Large 2 agent for drawing SVG vector logo's

## Launching the NextJS Application

First create a .env file and enter these required env variables:

```
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=
ANTHROPIC_MODEL_LOGO=
MISTRAL_AGENT_MODEL=
MISTRAL_API_KEY=
```

then

```
cd frontend
npm install
npm run dev
```

You should now have a local working version!

## Finetuning Mistral Large to Draw SVG's

We utilised the takara-ai/fudeno-instruct-4M dataset with 10K rows from the train set and 1K from the validation set and used mistral's UI finetuning experience to do this.

### Finetuning Data Preparation

We used a simple python script to stream the dataset and convert it to a JSONL instruct format that Mistral requires.

```python
from datasets import load_dataset
import json

# Load the dataset in streaming mode
dataset = load_dataset("takara-ai/fudeno-instruct-4M", streaming=True, split="train")

# Select only the 'prompt' and 'svg' columns
dataset = dataset.select_columns(['prompt', 'svg'])

print(dataset)

# Convert to the standard instruct format
def convert_to_instruct_format(example):
    """
    Convert a single example to the standard instruct format with user and assistant messages.
    """
    return {
        "messages": [
            {
                "role": "user",
                "content": example["prompt"]
            },
            {
                "role": "assistant",
                "content": example["svg"]
            }
        ]
    }

# Apply the conversion to the dataset
instruct_dataset = dataset.map(convert_to_instruct_format, remove_columns=['prompt', 'svg'])

collected_examples = []
for i, example in enumerate(instruct_dataset):
    if i >= 1000:
        break
    collected_examples.append(example)
    if i % 1000 == 0 and i > 0:
        print(f"Collected {i} examples so far...")

# Save the collected examples to a JSONL file
output_file = "finetuning/fudeno_4M_instruct_dataset_1k_train.jsonl"
print(f"Saving {len(collected_examples)} examples to {output_file}...")
with open(output_file, "w") as f:
    for example in collected_examples:
        f.write(json.dumps(example) + "\n")

print(f"Dataset saved to '{output_file}' with {len(collected_examples)} examples")

# Print a sample to verify the format
print("\nSample of the converted dataset:")
print(collected_examples[0] if collected_examples else "No examples collected")

```

An example file to do this is in /finetuning and works with any python above version 3.8.

Installing dependencies:

```
cd finetuning
pip install -r requirements
```

Create the dataset:

```
python dataset.py
```

This will create, depending on how many examples you have set it for, a JSONL instruct dataset that you can now upload in the Mistral UI and finetune any model, we recommend Mistral Large Latest or Mistral Small Latest.

After training finished we then registered it as an agent ready as an endpoint.

Server Prompt:

```
- You will use the primary color as a fill
```

Few Shot examples:

Input:

```
Create a simple icon composed of 1 path with clean, minimal design representing Speech bubble.
```

Output:

```
<svg viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg"><path d="M20.7134 8.12811L20.4668 8.69379C20.2864 9.10792 19.7136 9.10792 19.5331 8.69379L19.2866 8.12811C18.8471 7.11947 18.0555 6.31641 17.0677 5.87708L16.308 5.53922C15.8973 5.35653 15.8973 4.75881 16.308 4.57612L17.0252 4.25714C18.0384 3.80651 18.8442 2.97373 19.2761 1.93083L19.5293 1.31953C19.7058 0.893489 20.2942 0.893489 20.4706 1.31953L20.7238 1.93083C21.1558 2.97373 21.9616 3.80651 22.9748 4.25714L23.6919 4.57612C24.1027 4.75881 24.1027 5.35653 23.6919 5.53922L22.9323 5.87708C21.9445 6.31641 21.1529 7.11947 20.7134 8.12811ZM10 3H14V5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17H14C17.3137 17 20 14.3137 20 11H22C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3Z"/></svg>
```
