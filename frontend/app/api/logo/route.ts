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
      selectedFont,
      selectedColor,
    } = body;

    console.log("Logo API Input:", {
      companyName,
      productType,
      companyProfile,
      productValues,
      customers,
      selectedFont,
      selectedColor,
    });

    const logoPrompt = `Create a minimal logo for a company with the following details:
      Company Name: ${companyName}
      Type: ${productType}
      Profile: ${companyProfile}
      Values: ${productValues.join(", ")}
      Target Customers: ${customers}
      Primary Font: ${selectedFont}
      Primary Color: #${selectedColor}

      The logo should be simple, memorable, and reflect the company's identity.`;

    console.log("Logo Generation Prompt:", logoPrompt);

    const logoMessage = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL_LOGO,
      max_tokens: 500,
      temperature: 1,
      system: `you are a vector logo designer that creates simple and minimal logos and designs based on the user's business.

You follow these rules:
- always use viewBox="0 0 400 400"
- if you use text you never use paths to create the text you use a <text></text> element and you only write one line of text like "Apple", no taglines.
- logos are always centered and take up 90% of the viewport
- follow good simple design processes
- you only respond with the SVG code
- you never use code blocks
- you never write vector paths, only text with backgrounds
- you only use text elements and backgrounds like this using only one rect: <rect width="400" height="400" rx="20" ry="20"/>
- the backgrounds should always be a flat colour, the text should be unique using stylistic colour schemes, gradients`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${logoPrompt}, please reflect on your design as you write it to ensure its accuracy in design.`,
            },
          ],
        },
      ],
    });

    console.log("Logo API Raw Response:", logoMessage);

    // Extract the SVG code from the response
    const svgCode = Array.isArray(logoMessage.content)
      ? logoMessage.content
          .filter((block) => block.type === "text")
          .map((block) => (block.type === "text" ? block.text : ""))
          .join("")
      : "";

    console.log("Generated SVG Code:", svgCode);

    return NextResponse.json({ logo: svgCode });
  } catch (error) {
    console.error("Error in logo generation API:", error);
    return NextResponse.json(
      { error: "Failed to generate logo" },
      { status: 500 }
    );
  }
}
