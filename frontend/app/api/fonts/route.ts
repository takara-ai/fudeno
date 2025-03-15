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

    const systemPrompt = `You are a brand design expert specializing in typography and color theory. Based on the company profile and values provided, suggest three distinct Google Fonts and three distinct color options that could work well for the brand.

IMPORTANT: 
1. Only suggest fonts that are available on Google Fonts (https://fonts.google.com/)
2. Each font and color should be a distinct option, not meant to be used together
3. Return your response in the following JSON format exactly:

{
  "fonts": {
    "option1": "Font name for option 1",
    "option2": "Font name for option 2",
    "option3": "Font name for option 3"
  },
  "colors": {
    "option1": "6-digit hex code without #",
    "option2": "6-digit hex code without #",
    "option3": "6-digit hex code without #"
  }
}

Example response:
{
  "fonts": {
    "option1": "Montserrat",
    "option2": "Roboto",
    "option3": "Playfair Display"
  },
  "colors": {
    "option1": "2E3192",
    "option2": "E6007E",
    "option3": "00B8B0"
  }
}

Guidelines for selection:
1. Fonts:
   - Each font should be a distinct style that could work well for the brand
   - Include a mix of different font categories (serif, sans-serif, display, etc.)
   - All fonts must be from Google Fonts
   - Each font should be suitable for both headings and body text

2. Colors:
   - Each color should be a distinct option that could work as a primary brand color
   - Colors should be provided as 6-digit hex codes without the # symbol
   - Each color should be strong enough to work as a standalone brand color
   - Colors should reflect different aspects of the brand's personality

3. Important:
   - The fonts and colors are independent options - they are not meant to be used together
   - The user will choose one font and one color to create their brand identity
   - Each option should be strong enough to work independently`;

    const message = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL,
      max_tokens: 1000,
      temperature: 1,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Generate font and color options for this company:
        Company Name: ${companyName}
        Type: ${productType}
        Profile: ${companyProfile}
        Values: ${productValues.join(", ")}
        Target Customers: ${customers}

        Remember to:
        1. ONLY suggest fonts available on Google Fonts
        2. Return response in the exact JSON format specified
        3. Provide distinct options that can work independently`,
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

      // Return the font and color suggestions
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
