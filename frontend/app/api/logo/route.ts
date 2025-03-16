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
    console.log("Starting logo generation with body:", body);

    const {
      companyName,
      productType,
      companyProfile,
      productValues,
      customers,
      selectedFont,
      selectedColor,
    } = body;

    const logoPrompt = `Create a minimal logo for a company with the following details:
      Company Name: ${companyName}
      Type: ${productType}
      Profile: ${companyProfile}
      Values: ${productValues.join(", ")}
      Target Customers: ${customers}
      Primary Font: ${selectedFont}
      Primary Color: #${selectedColor}

      The logo should be simple, memorable, and reflect the company's identity.`;

    console.log("Starting parallel logo generation...");

    // Create array of promises for Mistral variations
    const mistralPromises = Array.from({ length: 3 }, (_, i) =>
      mistral.agents
        .complete({
          agentId: process.env.MISTRAL_AGENT_MODEL,
          messages: [
            {
              role: "user",
              content: `${logoPrompt}\n\nThis is variation ${
                i + 1
              } of 3. Make it unique from other variations.`,
            },
          ],
        })
        .catch((error) => {
          console.error(`Error in Mistral variation ${i + 1}:`, error);
          return null;
        })
    );

    // Generate all logos in parallel
    const [anthropicResponse, ...mistralResponses] = await Promise.all([
      // Anthropic logo
      anthropic.messages
        .create({
          model: process.env.ANTHROPIC_MODEL_LOGO,
          max_tokens: 500,
          temperature: 1,
          system:
            "you are a vector logo designer that creates simple and minimal logos and designs based on the user's business.\n\n- do not use paths\n- do not use polygons\n- do not try to make art\n- focus on typography\n- only respond with the <text></text>\n- experiment with the text rendering for unique designs",
          messages: [
            {
              role: "user",
              content: [{ type: "text", text: logoPrompt }],
            },
          ],
        })
        .catch((error) => {
          console.error("Error in Anthropic generation:", error);
          return null;
        }),

      // Add Mistral promises
      ...mistralPromises,
    ]);

    console.log("All API calls completed");

    // Process Anthropic response
    const anthropicSvg =
      anthropicResponse && Array.isArray(anthropicResponse.content)
        ? anthropicResponse.content
            .filter((block) => block.type === "text")
            .map((block) => (block.type === "text" ? block.text : ""))
            .join("")
        : "";

    console.log("Anthropic SVG:", anthropicSvg);

    // Process Mistral responses
    const mistralLogos = mistralResponses
      .filter((response) => response !== null)
      .map((response) => response.choices[0].message.content);

    console.log("Mistral Logos:", mistralLogos);
    mistralLogos.forEach((logo, index) => {
      console.log(`Mistral Logo ${index + 1}:`, logo);
    });

    console.log(`Successfully generated ${mistralLogos.length} Mistral logos`);

    return NextResponse.json({
      anthropicLogo: anthropicSvg,
      mistralLogos: mistralLogos,
    });
  } catch (error) {
    console.error("Fatal error in logo generation API:", error);

    return NextResponse.json(
      {
        error: "Failed to generate logo",
        details: error.message,
        anthropicLogo: null,
        mistralLogos: [],
      },
      { status: 500 }
    );
  }
}
