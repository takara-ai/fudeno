from datasets import load_dataset

# Load the dataset
dataset = load_dataset("takara-ai/multimodal-icon-instruct")

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

# Save the dataset in JSON Lines format
instruct_dataset["train"].to_json("finetuning/instruct_dataset.jsonl", orient="records", lines=True)

print(f"Dataset saved to 'finetuning/instruct_dataset.jsonl' with {instruct_dataset['train'].num_rows} examples")

# Print a sample to verify the format
print("\nSample of the converted dataset:")
print(instruct_dataset["train"][0])

