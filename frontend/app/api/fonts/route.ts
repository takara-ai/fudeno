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

    const systemPrompt = `You are a brand design expert specializing in typography and color theory. Based on the company profile and values provided, suggest three Google Fonts combinations and a primary brand color that best represent the brand's identity.

IMPORTANT: 
1. Only suggest fonts that are available on Google Fonts (https://fonts.google.com/)
2. The color should reflect the brand's personality and values
3. Return your response in the following JSON format exactly:

{
  "primaryFont": "Font name for headings",
  "secondaryFont": "Font name for body text",
  "accentFont": "Font name for special elements",
  "primaryColorHex": "6-digit hex code without #"
}

Example response:
{
  "primaryFont": "Montserrat",
  "secondaryFont": "Open Sans",
  "accentFont": "Playfair Display",
  "primaryColorHex": "2E3192"
}

Guidelines for selection:
1. Primary Font: Should be bold and distinctive for headings and key UI elements
2. Secondary Font: Must be highly readable for body text
3. Accent Font: Can be more decorative but still professional
4. Primary Color: Should reflect brand values and create appropriate emotional response
5. All fonts must be from Google Fonts
6. Color should be provided as a 6-digit hex code without the # symbol`;

    const message = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL,
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Generate font and color combinations for this company:
        Company Name: ${companyName}
        Type: ${productType}
        Profile: ${companyProfile}
        Values: ${productValues.join(", ")}
        Target Customers: ${customers}

        Remember to:
        1. ONLY suggest fonts available on Google Fonts
        2. Return response in the exact JSON format specified
        3. Choose a color that reflects the brand personality`,
        },
      ],
    });

    // Parse the response text as JSON
    const responseText = Array.isArray(message.content)
      ? message.content
          .filter((block) => block.type === "text")
          .map((block) => (block.type === "text" ? block.text : ""))
          .join("")
      : "";

    // Try to parse the response as JSON
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log("Parsed JSON Response:", jsonResponse);
      return NextResponse.json(jsonResponse);
    } catch (error) {
      console.error("Failed to parse LLM response as JSON:", responseText);
      return NextResponse.json(
        { error: "Invalid response format from LLM" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in font suggestion API:", error);
    return NextResponse.json(
      { error: "Failed to generate font suggestions" },
      { status: 500 }
    );
  }
}
