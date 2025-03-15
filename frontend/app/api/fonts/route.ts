import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyName,
      productType,
      companyProfile,
      productValues,
      customers,
    } = body;

    console.log("API Input:", {
      companyName,
      productType,
      companyProfile,
      productValues,
      customers,
    });

    const systemPrompt = `You are a brand design expert specializing in typography. Based on the company profile and values provided, suggest three Google Fonts combinations that best represent the brand's identity. Each combination should include a primary font for headings, a secondary font for body text, and an accent font for special elements.

IMPORTANT: Only suggest fonts that are available on Google Fonts (https://fonts.google.com/). Do not suggest any fonts from other sources.

Format your response exactly like this example:

/* Primary Font for Headings and Key UI Elements */
font-family: 'Poppins', sans-serif;

/* Secondary Font for Body Text */
font-family: 'Nunito', sans-serif;

/* Accent Font for Special Elements */
font-family: 'Outfit', sans-serif;

For each font suggestion:
1. Consider the brand's personality and values
2. Ensure good readability and accessibility
3. Verify the font is available on Google Fonts
4. Consider font pairing principles for visual harmony
5. Consider how the fonts reflect the company name and identity`;

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Generate font combinations for this company:
        Company Name: ${companyName}
        Type: ${productType}
        Profile: ${companyProfile}
        Values: ${productValues.join(", ")}
        Target Customers: ${customers}

        Remember to ONLY suggest fonts available on Google Fonts.`,
        },
      ],
    });

    // Extract the text content from the response
    const responseText = Array.isArray(message.content)
      ? message.content
          .filter((block) => block.type === "text")
          .map((block) => (block.type === "text" ? block.text : ""))
          .join("")
      : "";

    console.log("LLM Raw Response:", message);
    console.log("Extracted Response Text:", responseText);

    return NextResponse.json({ content: responseText });
  } catch (error) {
    console.error("Error in font suggestion API:", error);
    return NextResponse.json(
      { error: "Failed to generate font suggestions" },
      { status: 500 }
    );
  }
}
