export const runtime = "edge";

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Mistral } from "@mistralai/mistralai";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
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

    // Anthropic API request
    const logoMessage = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL_LOGO,
      max_tokens: 500,
      temperature: 1,
      system:
        "you are a vector logo designer that creates simple and minimal logos and designs based on the user's business.\n\n- do not use paths\n- do not use polygons\n- do not try to make art\n- focus on typography\n- only respond with the <text></text>\n- experiment with the text rendering for unique designs",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${logoPrompt}, please reflect on your design as you write it to ensure its accuracy in design.\n\n\nYou follow these rules:\n- always start with <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"512\" height=\"512\" viewBox=\"0 0 512 512\">\n- if you use text you never use paths to create the text you use a <text></text> element and you only write one line of text like \"Apple\", no taglines.\n- logos are always centered and take up 90% of the viewport\n- follow good simple design processes\n- you only respond with the SVG code\n- you never use code blocks\n- I don't want vector paths or polygons, only text\n- you leave the backgrounds transparent\n- you will only output <text></text> elements in the SVG and nothing else.`,
            },
          ],
        },
      ],
    });

    // Mistral Agent API request
    const mistralResponse = await mistral.agents.complete({
      agentId: process.env.MISTRAL_AGENT_MODEL,
      messages: [
        {
          role: "user",
          content: logoPrompt,
        },
      ],
    });

    console.log("Logo API Raw Response (Anthropic):", logoMessage);
    console.log(
      "Logo API Raw Response (Mistral):",
      mistralResponse.choices[0].message.content
    );

    // Extract the SVG code from the Anthropic response
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
