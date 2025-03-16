// Example text to showcase fonts
const FONT_SHOWCASE_TEXT = "The quick brown fox jumps over the lazy dog";

import { ColorPaletteGenerator } from "./ColorPaletteGenerator";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiDownload, FiRefreshCw, FiCopy } from "react-icons/fi";
import jsPDF from "jspdf";
import pptxgen from "pptxgenjs";

interface BrandResultsProps {
  companyName: string;
  fontSuggestions: {
    option1: string;
    option2: string;
    option3: string;
  };
  colors: {
    option1: string;
    option2: string;
    option3: string;
  };
  logos: {
    mistralLogo: string | null;
    anthropicLogo: string | null;
  };
  onRegenerate: () => void;
  isLoading: boolean;
}

export function BrandResults({
  companyName,
  fontSuggestions,
  colors,
  logos,
  onRegenerate,
  isLoading,
}: BrandResultsProps) {
  const [selectedFont, setSelectedFont] = useState<string>("option1");
  const [selectedColor, setSelectedColor] = useState<string>("option1");
  const [copied, setCopied] = useState<string | null>(null);
  const [currentLogo, setCurrentLogo] = useState(
    logos.mistralLogo || logos.anthropicLogo || ""
  );

  useEffect(() => {
    if (!logos.mistralLogo && !logos.anthropicLogo) return;

    try {
      // Create a temporary div to hold the SVG
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = logos.mistralLogo || logos.anthropicLogo || "";

      // Get the SVG element
      const svgElement = tempDiv.querySelector("svg");
      if (!svgElement) {
        console.error("No SVG element found in logo");
        return;
      }

      // Set fixed dimensions for the SVG
      svgElement.setAttribute("width", "500");
      svgElement.setAttribute("height", "500");
      svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

      // Ensure viewBox exists
      const viewBox = svgElement.getAttribute("viewBox") || "0 0 512 512";
      svgElement.setAttribute("viewBox", viewBox);

      // Find all text elements and update them
      const textElements = svgElement.querySelectorAll("text");
      if (textElements.length > 0) {
        textElements.forEach((text) => {
          // Update font family and color
          text.setAttribute(
            "font-family",
            `'${fontSuggestions[selectedFont]}', sans-serif`
          );
          text.setAttribute("fill", `#${colors[selectedColor]}`);

          // Set text alignment
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("dominant-baseline", "central");
        });
      }

      // Find all path elements and update their colors
      const pathElements = svgElement.querySelectorAll("path");
      pathElements.forEach((path) => {
        const fill = path.getAttribute("fill");
        if (fill && fill !== "none" && fill !== "transparent") {
          path.setAttribute("fill", `#${colors[selectedColor]}`);
        }

        const stroke = path.getAttribute("stroke");
        if (stroke && stroke !== "none" && stroke !== "transparent") {
          path.setAttribute("stroke", `#${colors[selectedColor]}`);
        }
      });

      // Set the updated SVG
      setCurrentLogo(tempDiv.innerHTML);
    } catch (error) {
      console.error("Error updating SVG:", error);
      setCurrentLogo(logos.mistralLogo || logos.anthropicLogo || "");
    }
  }, [
    logos.mistralLogo,
    logos.anthropicLogo,
    selectedFont,
    selectedColor,
    colors,
    fontSuggestions,
  ]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Function to create a data URL for the SVG
  const createSvgDataUrl = (svgContent: string) => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    
    // Get the selected color in RGB format for use in the PDF
    const selectedColorHex = `#${colors[selectedColor]}`;
    const selectedColorRGB = hexToRgb(selectedColorHex).split(', ').map(Number);
    const r = selectedColorRGB[0];
    const g = selectedColorRGB[1];
    const b = selectedColorRGB[2];

    // Helper function to add header and footer
    const addHeaderFooter = (pageNum = 1, totalPages = 1) => {
      if (pageNum > 1) {
        // Header
        doc.setFillColor(r, g, b);
        doc.rect(0, 0, pageWidth, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(companyName, margin, 10);
        const date = new Date().toLocaleDateString();
        doc.text(date, pageWidth - margin, 10, { align: "right" });

        // Footer
        const footerText = "Generated by fudeno";
        const pageText = `Page ${pageNum} of ${totalPages}`;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(10);
        doc.text(footerText, margin, pageHeight - 10);
        doc.text(pageText, pageWidth - margin, pageHeight - 10, {
          align: "right",
        });
      }
    };

    // Title Page - Completely redesigned for a more modern look
    doc.setFillColor(r, g, b); // Brand color for header
    doc.rect(0, 0, pageWidth, 60, "F"); // Larger header area
    
    // Add a decorative element - diagonal stripe
    doc.setFillColor(Math.min(r + 22, 255), Math.max(g - 15, 0), Math.min(b + 15, 255)); // Slightly lighter shade for visual interest
    doc.triangle(0, 0, pageWidth, 0, 0, 100, "F");
    
    // Add company name in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, margin, 30);
    
    // Add current date in header
    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(date, pageWidth - margin, 30, { align: "right" });
    
    // Main title area
    const centerY = pageHeight / 2 - 40;
    
    // Add a decorative background element
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(margin, centerY - 30, pageWidth - (margin * 2), 160, 5, 5, "F");
    
    // Add a colored accent line
    doc.setFillColor(r, g, b);
    doc.rect(margin, centerY - 30, 5, 160, "F");
    
    // Add the logo to the cover page
    if (currentLogo) {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = createSvgDataUrl(currentLogo);
        });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL("image/png");

        // Add the logo to the center of the cover
        const logoWidth = 100;
        const logoHeight = 100;
        const logoX = (pageWidth - logoWidth) / 2;
        const logoY = centerY - 10;
        doc.addImage(pngData, "PNG", logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        console.error("Error converting SVG to PNG for cover:", error);
      }
    }
    
    // Add Brand Guidelines text
    doc.setTextColor(r, g, b);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text("Brand Guidelines", pageWidth / 2, centerY + 80, { align: "center" });
    
    // Add company name
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.text(companyName, pageWidth / 2, centerY + 110, { align: "center" });
    
    // Add date
    doc.setFontSize(14);
    doc.text(date, pageWidth / 2, centerY + 130, { align: "center" });
    
    // Add decorative elements at the bottom
    doc.setFillColor(30, 30, 30); // Dark footer background
    doc.rect(0, pageHeight - 40, pageWidth, 40, "F");
    
    // Add a subtle accent line above the footer
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(2);
    doc.line(0, pageHeight - 40, pageWidth, pageHeight - 40);
    
    // Add a decorative element in the footer
    doc.setFillColor(r, g, b, 0.2);
    doc.circle(pageWidth - 20, pageHeight - 20, 10, "F");
    
    // Add footer text with improved styling
    doc.setTextColor(220, 220, 220); // Light text for dark background
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by", 20, pageHeight - 20);
    doc.setFont("helvetica", "bold");
    doc.text("fudeno", 70, pageHeight - 20);
    
    // Add page number with improved styling
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Page 1", pageWidth - 40, pageHeight - 20, { align: "right" });

    // Logo Page
    doc.addPage();
    
    // Add colored header
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, margin, 10);
    doc.text(date, pageWidth - margin, 10, { align: "right" });
    
    // Section title with decorative elements
    let yPosition = margin + 30;
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition - 10, pageWidth - margin, yPosition - 10);
    
    doc.setTextColor(r, g, b);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Brand Logo", pageWidth / 2, yPosition, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 10, pageWidth - margin, yPosition + 10);
    yPosition += 30;

    // Logo description with improved styling
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Primary logo with customized typography and colors",
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 40;

    // Add logo with decorative background
    if (currentLogo) {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = createSvgDataUrl(currentLogo);
        });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL("image/png");

        // Add decorative background for logo
        doc.setFillColor(248, 248, 248);
        const logoWidth = 160;
        const logoHeight = 160;
        const logoX = (pageWidth - logoWidth) / 2;
        doc.roundedRect(logoX - 20, yPosition - 20, logoWidth + 40, logoHeight + 40, 5, 5, "F");
        
        // Add a subtle border
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.roundedRect(logoX - 20, yPosition - 20, logoWidth + 40, logoHeight + 40, 5, 5, "S");
        
        // Add the logo
        doc.addImage(pngData, "PNG", logoX, yPosition, logoWidth, logoHeight);
        
        yPosition += logoHeight + 60;
        
        // Add usage guidelines
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Logo Usage Guidelines", margin, yPosition);
        yPosition += 15;
        
        // Add guidelines with bullet points
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        
        const guidelines = [
          "Maintain clear space around the logo equal to the height of the logo's main element",
          "Do not stretch, distort, or change the proportions of the logo",
          "Do not change the colors of the logo unless using approved brand variations",
          "Ensure the logo is clearly visible against its background"
        ];
        
        guidelines.forEach((guideline, index) => {
          doc.setFont("helvetica", "bold");
          doc.text("•", margin, yPosition + (index * 15));
          doc.setFont("helvetica", "normal");
          doc.text(guideline, margin + 10, yPosition + (index * 15));
        });
      } catch (error) {
        console.error("Error converting SVG to PNG:", error);
      }
    }
    
    // Add footer
    doc.setFillColor(30, 30, 30);
    doc.rect(0, pageHeight - 40, pageWidth, 40, "F");
    
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(2);
    doc.line(0, pageHeight - 40, pageWidth, pageHeight - 40);
    
    doc.setFillColor(r, g, b, 0.2);
    doc.circle(pageWidth - 20, pageHeight - 20, 10, "F");
    
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by", 20, pageHeight - 20);
    doc.setFont("helvetica", "bold");
    doc.text("fudeno", 70, pageHeight - 20);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Page 2", pageWidth - 40, pageHeight - 20, { align: "right" });

    // Typography Page
    doc.addPage();
    
    // Add colored header
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, margin, 10);
    doc.text(date, pageWidth - margin, 10, { align: "right" });
    
    // Section title with decorative elements
    yPosition = margin + 30;
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition - 10, pageWidth - margin, yPosition - 10);
    
    doc.setTextColor(r, g, b);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Typography", pageWidth / 2, yPosition, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 10, pageWidth - margin, yPosition + 10);
    yPosition += 40;

    // Add decorative background for typography section
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(margin, yPosition - 10, pageWidth - (margin * 2), 200, 5, 5, "F");
    
    // Primary font showcase with improved styling
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Primary Font", margin + 15, yPosition + 15);
    
    // Add font name with brand color
    doc.setTextColor(r, g, b);
    doc.setFontSize(24);
    doc.text(fontSuggestions[selectedFont], margin + 15, yPosition + 45);
    
    // Add a decorative line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin + 15, yPosition + 55, pageWidth - margin - 15, yPosition + 55);
    
    yPosition += 70;

    // Font usage examples with improved styling
    const examples = [
      { size: 24, text: "Heading 1 Example", weight: "Bold" },
      { size: 20, text: "Heading 2 Example", weight: "Semibold" },
      { size: 16, text: "Heading 3 Example", weight: "Medium" },
      { size: 12, text: FONT_SHOWCASE_TEXT, weight: "Regular" },
    ];

    examples.forEach((example, index) => {
      // Add a small colored square before each example
      doc.setFillColor(r, g, b, 0.1 * (5 - index));
      doc.rect(margin + 15, yPosition - 5, 10, 10, "F");
      
      // Add the text example
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(example.size);
      doc.setFont(index < 2 ? "helvetica" : "helvetica", index < 3 ? "bold" : "normal");
      doc.text(
        example.text,
        margin + 35,
        yPosition
      );
      
      // Add the size and weight info
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        `${example.size}px - ${example.weight}`,
        pageWidth - margin - 15,
        yPosition,
        { align: "right" }
      );
      
      yPosition += example.size + 15;
    });
    
    // Add typography guidelines
    yPosition += 20;
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Typography Guidelines", margin, yPosition);
    yPosition += 15;
    
    // Add guidelines with bullet points
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    const typographyGuidelines = [
      "Maintain consistent font usage across all brand communications",
      "Use appropriate font weights to establish visual hierarchy",
      "Ensure adequate contrast between text and background for readability",
      "Maintain appropriate line spacing (1.5x font size recommended)"
    ];
    
    typographyGuidelines.forEach((guideline, index) => {
      doc.setFont("helvetica", "bold");
      doc.text("•", margin, yPosition + (index * 15));
      doc.setFont("helvetica", "normal");
      doc.text(guideline, margin + 10, yPosition + (index * 15));
    });
    
    // Add footer
    doc.setFillColor(30, 30, 30);
    doc.rect(0, pageHeight - 40, pageWidth, 40, "F");
    
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(2);
    doc.line(0, pageHeight - 40, pageWidth, pageHeight - 40);
    
    doc.setFillColor(r, g, b, 0.2);
    doc.circle(pageWidth - 20, pageHeight - 20, 10, "F");
    
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by", 20, pageHeight - 20);
    doc.setFont("helvetica", "bold");
    doc.text("fudeno", 70, pageHeight - 20);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Page 3", pageWidth - 40, pageHeight - 20, { align: "right" });

    // Color Palette Page
    doc.addPage();
    
    // Add colored header
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, margin, 10);
    doc.text(date, pageWidth - margin, 10, { align: "right" });
    
    // Section title with decorative elements
    yPosition = margin + 30;
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition - 10, pageWidth - margin, yPosition - 10);
    
    doc.setTextColor(r, g, b);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Color Palette", pageWidth / 2, yPosition, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 10, pageWidth - margin, yPosition + 10);
    yPosition += 40;

    // Primary color with improved styling
    const primaryColor = `#${colors[selectedColor]}`;
    const colorBoxSize = 60;
    const colorSpacing = 20;
    
    // Add decorative background for primary color
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(margin, yPosition - 10, pageWidth - (margin * 2), 100, 5, 5, "F");
    
    // Add primary color title
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Primary Brand Color", margin + 15, yPosition + 15);
    
    // Add primary color box with shadow effect
    let xPosition = margin + 15;
    yPosition += 40;
    
    // Add shadow effect (subtle rectangle behind the color)
    doc.setFillColor(180, 180, 180, 0.3);
    doc.rect(xPosition + 3, yPosition + 3, colorBoxSize, colorBoxSize, "F");
    
    // Add the color box
    doc.setFillColor(
      parseInt(colors[selectedColor].substring(0, 2), 16),
      parseInt(colors[selectedColor].substring(2, 4),
      16),
      parseInt(colors[selectedColor].substring(4, 6),
      16)
    );
    doc.rect(xPosition, yPosition, colorBoxSize, colorBoxSize, "F");
    
    // Add border to color box
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.rect(xPosition, yPosition, colorBoxSize, colorBoxSize, "S");

    // Color information with improved styling
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      primaryColor.toUpperCase(),
      xPosition + colorBoxSize + 20,
      yPosition + 15
    );

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Add color values with icons/symbols
    doc.text(
      `RGB: ${hexToRgb(primaryColor)}`,
      xPosition + colorBoxSize + 20,
      yPosition + 35
    );
    doc.text(
      `HSL: ${hexToHsl(primaryColor)}`,
      xPosition + colorBoxSize + 20,
      yPosition + 55
    );
    
    // Add a note about color usage
    yPosition += colorBoxSize + 30;
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(
      "This is your primary brand color. Use it for key elements, calls-to-action, and brand accents.",
      margin + 15,
      yPosition
    );

    // Generate color variations with improved styling
    yPosition += 40;
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Color Variations", margin, yPosition);
    yPosition += 20;
    
    // Add decorative background for color variations
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(margin, yPosition - 10, pageWidth - (margin * 2), 100, 5, 5, "F");
    yPosition += 20;

    // Create a row of color variations with labels and percentages
    const variations = [0.8, 0.6, 0.4, 0.2];
    const smallColorBoxSize = 50;
    
    variations.forEach((opacity, index) => {
      const xPos = margin + 15 + index * (smallColorBoxSize + 20);
      
      // Add shadow effect
      doc.setFillColor(180, 180, 180, 0.3);
      doc.rect(xPos + 2, yPosition + 2, smallColorBoxSize, smallColorBoxSize, "F");
      
      // Add color box
      doc.setFillColor(
        parseInt(colors[selectedColor].substring(0, 2), 16),
        parseInt(colors[selectedColor].substring(2, 4), 16),
        parseInt(colors[selectedColor].substring(4, 6), 16)
      );
      doc.saveGraphicsState();
      doc.setGState(doc.GState({ opacity }));
      doc.rect(xPos, yPosition, smallColorBoxSize, smallColorBoxSize, "F");
      doc.restoreGraphicsState();
      
      // Add border
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.rect(xPos, yPosition, smallColorBoxSize, smallColorBoxSize, "S");
      
      // Add percentage label
      doc.saveGraphicsState();
      doc.setGState(doc.GState({ opacity: 1 }));
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${opacity * 100}%`,
        xPos + smallColorBoxSize/2,
        yPosition + smallColorBoxSize + 15,
        { align: "center" }
      );
      
      // Add usage label
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      let usageText = "";
      switch(index) {
        case 0: usageText = "Primary"; break;
        case 1: usageText = "Secondary"; break;
        case 2: usageText = "Tertiary"; break;
        case 3: usageText = "Background"; break;
      }
      doc.text(
        usageText,
        xPos + smallColorBoxSize/2,
        yPosition + smallColorBoxSize + 30,
        { align: "center" }
      );
    });
    
    // Add color usage guidelines
    yPosition += smallColorBoxSize + 50;
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Color Usage Guidelines", margin, yPosition);
    yPosition += 15;
    
    // Add guidelines with bullet points
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    const colorGuidelines = [
      "Use the primary color for key elements and calls-to-action",
      "Lighter variations work well for backgrounds and secondary elements",
      "Ensure adequate contrast between text and background colors",
      "Maintain color consistency across all brand materials"
    ];
    
    colorGuidelines.forEach((guideline, index) => {
      doc.setFont("helvetica", "bold");
      doc.text("•", margin, yPosition + (index * 15));
      doc.setFont("helvetica", "normal");
      doc.text(guideline, margin + 10, yPosition + (index * 15));
    });
    
    // Add footer
    doc.setFillColor(30, 30, 30);
    doc.rect(0, pageHeight - 40, pageWidth, 40, "F");
    
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(2);
    doc.line(0, pageHeight - 40, pageWidth, pageHeight - 40);
    
    doc.setFillColor(r, g, b, 0.2);
    doc.circle(pageWidth - 20, pageHeight - 20, 10, "F");
    
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by", 20, pageHeight - 20);
    doc.setFont("helvetica", "bold");
    doc.text("fudeno", 70, pageHeight - 20);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Page 4", pageWidth - 40, pageHeight - 20, { align: "right" });

    // Save the PDF
    doc.save(`${companyName.toLowerCase()}-brand-guidelines.pdf`);
  };

  const generatePPTX = async () => {
    const pres = new pptxgen();

    // Set global presentation properties
    pres.layout = "LAYOUT_16x9";
    pres.author = "Generated by fudeno";
    pres.company = companyName;
    pres.subject = "Brand Guidelines Template";
    pres.title = `${companyName} - Brand Template`;

    // Title Slide
    const slide1 = pres.addSlide();
    slide1.background = { color: "FFFFFF" };

    // Add modern accent shape - vertical bar on the right
    slide1.addShape(pres.ShapeType.rect, {
      x: "85%",
      y: "0%",
      w: "15%",
      h: "100%",
      fill: { color: `#${colors[selectedColor]}` },
    });

    // Add subtle accent line at the bottom
    slide1.addShape(pres.ShapeType.rect, {
      x: "0%",
      y: "95%",
      w: "85%",
      h: "0.3%",
      fill: { color: `#${colors[selectedColor]}`, transparency: 70 },
    });

    // Convert SVG to PNG for better compatibility
    if (currentLogo) {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = createSvgDataUrl(currentLogo);
        });

        // Set higher resolution for better quality
        canvas.width = img.width * 2; // Double the resolution
        canvas.height = img.height * 2;
        ctx?.scale(2, 2); // Scale up for better quality
        ctx?.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL("image/png");

        // Add larger logo with better positioning
        slide1.addImage({
          data: pngData,
          x: "15%",
          y: "10%",
          w: "50%",
          h: "70%",
        });
      } catch (error) {
        console.error("Error converting SVG to PNG for PPTX:", error);
      }
    }

    // Remove company name text and tagline
    // ... existing code ...

    // Content Slide
    const slide2 = pres.addSlide();
    slide2.background = { color: "FFFFFF" };

    // Add modern header bar
    slide2.addShape(pres.ShapeType.rect, {
      x: "0%",
      y: "0%",
      w: "100%",
      h: "15%",
      fill: { color: `#${colors[selectedColor]}` },
    });

    // Add subtle footer line
    slide2.addShape(pres.ShapeType.rect, {
      x: "5%",
      y: "92%",
      w: "90%",
      h: "0.3%",
      fill: { color: `#${colors[selectedColor]}`, transparency: 70 },
    });

    // Add section title with modern styling
    slide2.addText("Our Vision", {
      x: "5%",
      y: "4%",
      w: "90%",
      h: "7%",
      fontSize: 28,
      fontFace: fontSuggestions[selectedFont],
      color: "FFFFFF",
      bold: true,
    });

    // Add three-column layout with icons
    const columnContent = [
      {
        title: "Mission",
        text: "To deliver exceptional value through innovative solutions and unwavering commitment to excellence.",
        icon: "⭐",
      },
      {
        title: "Values",
        text: "Integrity, collaboration, and continuous improvement drive everything we do.",
        icon: "🎯",
      },
      {
        title: "Goals",
        text: "Setting new industry standards while creating sustainable growth and positive impact.",
        icon: "🚀",
      },
    ];

    columnContent.forEach((column, index) => {
      // Add column container with subtle background
      slide2.addShape(pres.ShapeType.roundRect, {
        x: `${5 + index * 31}%`,
        y: "20%",
        w: "28%",
        h: "65%",
        fill: { color: "F8F8F8" },
        line: { color: "EEEEEE", width: 1 },
      });

      // Add icon
      slide2.addText(column.icon, {
        x: `${8 + index * 31}%`,
        y: "25%",
        w: "22%",
        h: "15%",
        fontSize: 32,
        align: "left",
      });

      // Add title
      slide2.addText(column.title, {
        x: `${8 + index * 31}%`,
        y: "42%",
        w: "22%",
        h: "8%",
        fontSize: 24,
        fontFace: fontSuggestions[selectedFont],
        color: `#${colors[selectedColor]}`,
        bold: true,
      });

      // Add content
      slide2.addText(column.text, {
        x: `${8 + index * 31}%`,
        y: "52%",
        w: "22%",
        h: "25%",
        fontSize: 16,
        fontFace: fontSuggestions[selectedFont],
        color: "666666",
        lineSpacing: 20,
      });
    });

    // Add page number
    slide2.addText("2", {
      x: "90%",
      y: "92%",
      w: "5%",
      h: "5%",
      fontSize: 12,
      color: "666666",
      align: "right",
    });

    // Save the presentation
    pres.writeFile({
      fileName: `${companyName.toLowerCase()}-presentation-template.pptx`,
    });
  };

  return (
    <motion.div
      className="min-h-screen bg-[#f5f5f5] w-full"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-[1920px] mx-auto px-8 py-8">
        <div className="space-y-6">
          {/* Header Card */}
          <motion.div
            variants={item}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="px-5 py-4 flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-[24px] font-medium text-gray-900">
                  Your Brand Assets
                </h2>
                <p className="text-[13px] text-gray-500">
                  Customize your brand identity with the options below
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={generatePDF}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:border-[#C60F7B] transition-all duration-300 hover:scale-[1.02] hover:shadow-md shadow-sm flex items-center gap-2 group text-[13px] font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-y-0.5 transition-transform duration-300"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Export Corporate Design PDF
                </button>
                <button
                  onClick={generatePPTX}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:border-[#C60F7B] transition-all duration-300 hover:scale-[1.02] hover:shadow-md shadow-sm flex items-center gap-2 group text-[13px] font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-y-0.5 transition-transform duration-300"
                  >
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  Export Branded PPTX Template
                </button>
                <button
                  onClick={onRegenerate}
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#C60F7B] rounded-md text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-[13px] font-medium"
                >
                  <FiRefreshCw
                    className={`${isLoading ? "animate-spin" : ""} w-3.5 h-3.5`}
                  />
                  {isLoading ? "Generating..." : "Generate New Options"}
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-12 gap-6">
            {/* Mistral Logo Section */}
            <motion.div
              variants={item}
              className="col-span-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="border-b border-gray-100 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#C60F7B]/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C60F7B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-gray-900">
                      Logo Design
                    </h3>
                    <p className="text-[13px] text-gray-500">
                      Preview and download your logo design
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center justify-center space-y-5">
                  <div className="w-full bg-[#fafafa] rounded-lg p-4 border border-gray-100 overflow-hidden group hover:border-[#C60F7B] transition-all duration-300">
                    <div
                      className="flex justify-center items-center bg-white rounded-lg"
                      style={{ height: "400px" }}
                    >
                      {logos.mistralLogo && (
                        <img
                          src={createSvgDataUrl(logos.mistralLogo)}
                          alt="Mistral Logo Preview"
                          style={{
                            maxWidth: "300px",
                            maxHeight: "400px",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => {
                        const blob = new Blob([logos.mistralLogo || ""], {
                          type: "image/svg+xml",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${companyName.toLowerCase()}-mistral-logo.svg`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="flex-1 px-4 py-2 bg-[#C60F7B] rounded-md text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-md shadow-sm flex items-center justify-center gap-2 group text-[13px] font-medium"
                    >
                      <FiDownload className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-300" />
                      Download SVG
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-md hover:border-[#C60F7B] transition-all duration-300 hover:scale-[1.02] hover:shadow-md shadow-sm flex items-center justify-center gap-2 group text-[13px] font-medium"
                      onClick={() => {
                        if (!logos.mistralLogo) return;
                        const svgBlob = new Blob([logos.mistralLogo], {
                          type: "image/svg+xml",
                        });
                        const url = URL.createObjectURL(svgBlob);
                        const img = new Image();
                        img.onload = () => {
                          const canvas = document.createElement("canvas");
                          canvas.width = img.width;
                          canvas.height = img.height;
                          const ctx = canvas.getContext("2d");
                          ctx?.drawImage(img, 0, 0);
                          canvas.toBlob((pngBlob) => {
                            if (pngBlob) {
                              const pngUrl = URL.createObjectURL(pngBlob);
                              const a = document.createElement("a");
                              a.href = pngUrl;
                              a.download = `${companyName.toLowerCase()}-mistral-logo.png`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(pngUrl);
                            }
                          }, "image/png");
                        };
                        img.src = url;
                      }}
                    >
                      <FiDownload className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-300" />
                      Download PNG
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Anthropic Logo Section */}
            <motion.div
              variants={item}
              className="col-span-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="border-b border-gray-100 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#C60F7B]/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C60F7B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-gray-900">
                      Logo Text Design
                    </h3>
                    <p className="text-[13px] text-gray-500">
                      Preview and download your logo text design
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center justify-center space-y-5">
                  <div className="w-full bg-[#fafafa] rounded-lg p-4 border border-gray-100 overflow-hidden group hover:border-[#C60F7B] transition-all duration-300">
                    <div
                      className="flex justify-center items-center bg-white rounded-lg"
                      style={{ height: "400px" }}
                    >
                      {logos.anthropicLogo && (
                        <img
                          src={createSvgDataUrl(logos.anthropicLogo)}
                          alt="Anthropic Logo Preview"
                          style={{
                            maxWidth: "300px",
                            maxHeight: "400px",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => {
                        const blob = new Blob([logos.anthropicLogo || ""], {
                          type: "image/svg+xml",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${companyName.toLowerCase()}-anthropic-logo.svg`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="flex-1 px-4 py-2 bg-[#C60F7B] rounded-md text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-md shadow-sm flex items-center justify-center gap-2 group text-[13px] font-medium"
                    >
                      <FiDownload className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-300" />
                      Download SVG
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-md hover:border-[#C60F7B] transition-all duration-300 hover:scale-[1.02] hover:shadow-md shadow-sm flex items-center justify-center gap-2 group text-[13px] font-medium"
                      onClick={() => {
                        if (!logos.anthropicLogo) return;
                        const svgBlob = new Blob([logos.anthropicLogo], {
                          type: "image/svg+xml",
                        });
                        const url = URL.createObjectURL(svgBlob);
                        const img = new Image();
                        img.onload = () => {
                          const canvas = document.createElement("canvas");
                          canvas.width = img.width;
                          canvas.height = img.height;
                          const ctx = canvas.getContext("2d");
                          ctx?.drawImage(img, 0, 0);
                          canvas.toBlob((pngBlob) => {
                            if (pngBlob) {
                              const pngUrl = URL.createObjectURL(pngBlob);
                              const a = document.createElement("a");
                              a.href = pngUrl;
                              a.download = `${companyName.toLowerCase()}-anthropic-logo.png`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(pngUrl);
                            }
                          }, "image/png");
                        };
                        img.src = url;
                      }}
                    >
                      <FiDownload className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-300" />
                      Download PNG
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Brand Preview and Customize Your Brand sections in a row */}
            <div className="col-span-8">
              {/* Brand Preview */}
              <motion.div
                variants={item}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-[#C60F7B]/10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C60F7B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900">
                        Brand Preview
                      </h3>
                      <p className="text-[13px] text-gray-500">
                        See how your brand elements work together
                      </p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {/* Typography Section */}
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-[13px] font-medium text-gray-900">
                        Typography
                      </h4>
                      <div className="space-y-6">
                        <div
                          className="text-[42px] font-bold leading-tight transition-all duration-300"
                          style={{
                            fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            color: `#${colors[selectedColor]}`,
                          }}
                        >
                          {companyName || "Your Company Name"}
                        </div>
                        <div className="space-y-3">
                          <div
                            className="text-[32px] font-semibold transition-all duration-300"
                            style={{
                              fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            }}
                          >
                            H1 - Main Heading
                          </div>
                          <div
                            className="text-[24px] font-medium transition-all duration-300"
                            style={{
                              fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            }}
                          >
                            H2 - Section Heading
                          </div>
                          <div
                            className="text-[20px] font-medium transition-all duration-300"
                            style={{
                              fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            }}
                          >
                            H3 - Subsection Heading
                          </div>
                          <div
                            className="text-[16px] leading-relaxed transition-all duration-300"
                            style={{
                              fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            }}
                          >
                            Body text - {FONT_SHOWCASE_TEXT}
                          </div>
                          <div
                            className="text-[14px] text-gray-600 transition-all duration-300"
                            style={{
                              fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            }}
                          >
                            Caption text - Additional information and metadata
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="p-6 space-y-6">
                    <h4 className="text-[13px] font-medium text-gray-900">
                      Color Palette
                    </h4>
                    <ColorPaletteGenerator
                      primaryColor={`#${colors[selectedColor]}`}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Customize Your Brand section */}
            <div className="col-span-4">
              {/* Font Options */}
              <motion.div
                variants={item}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-[#C60F7B]/10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C60F7B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <text
                          x="50%"
                          y="50%"
                          text-anchor="middle"
                          dy=".1em"
                          font-size="14"
                        >
                          Aa
                        </text>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900">
                        Customize Your Brand
                      </h3>
                      <p className="text-[13px] text-gray-500">
                        Select your preferred font and color combinations
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-6">
                    {/* Font Selection */}
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-900 mb-3">
                        Font Options
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(fontSuggestions).map(([key, font]) => (
                          <div
                            key={key}
                            onClick={() => setSelectedFont(key)}
                            className={`p-3 rounded-md border cursor-pointer transition-all duration-300 transform hover:scale-[1.01] ${
                              key === selectedFont
                                ? "border-[#C60F7B] bg-[#C60F7B]/5"
                                : "border-gray-200 hover:border-[#C60F7B]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-[13px] font-medium text-gray-900 flex items-center gap-2">
                                Option {key.slice(-1)}
                                {key === selectedFont && (
                                  <span className="text-[11px] text-[#C60F7B]">
                                    (Selected)
                                  </span>
                                )}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(font, `font-${key}`);
                                }}
                                className="text-gray-400 hover:text-[#C60F7B] transition-colors"
                              >
                                <FiCopy size={12} />
                                {copied === `font-${key}` && (
                                  <span className="ml-2 text-[11px] text-[#C60F7B]">
                                    Copied!
                                  </span>
                                )}
                              </button>
                            </div>
                            <p className="text-[11px] text-gray-500 mb-1.5">
                              {font}
                            </p>
                            <div
                              className="text-[15px] text-gray-900 transition-all duration-300"
                              style={{
                                fontFamily: `'${font}', sans-serif`,
                                opacity: document.fonts?.check(`12px '${font}'`)
                                  ? 1
                                  : 0.5,
                              }}
                            >
                              {FONT_SHOWCASE_TEXT}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-900 mb-3">
                        Color Options
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(colors).map(([key, color]) => (
                          <div
                            key={key}
                            onClick={() => setSelectedColor(key)}
                            className={`p-3 rounded-md border cursor-pointer transition-all duration-300 transform hover:scale-[1.01] ${
                              key === selectedColor
                                ? "border-[#C60F7B] bg-[#C60F7B]/5"
                                : "border-gray-200 hover:border-[#C60F7B]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-[13px] font-medium text-gray-900 flex items-center gap-2">
                                Option {key.slice(-1)}
                                {key === selectedColor && (
                                  <span className="text-[11px] text-[#C60F7B]">
                                    (Selected)
                                  </span>
                                )}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(`#${color}`, `color-${key}`);
                                }}
                                className="text-gray-400 hover:text-[#C60F7B] transition-colors"
                              >
                                <FiCopy size={12} />
                                {copied === `color-${key}` && (
                                  <span className="ml-2 text-[11px] text-[#C60F7B]">
                                    Copied!
                                  </span>
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-14 h-14 rounded-md shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer"
                                style={{ backgroundColor: `#${color}` }}
                              />
                              <div className="space-y-1">
                                <code className="text-[13px] font-mono text-gray-600">
                                  #{color}
                                </code>
                                <div className="flex flex-col gap-1">
                                  <div className="px-2 py-1 bg-gray-50 rounded text-[11px] text-gray-600">
                                    RGB: {hexToRgb(`#${color}`)}
                                  </div>
                                  <div className="px-2 py-1 bg-gray-50 rounded text-[11px] text-gray-600">
                                    HSL: {hexToHsl(`#${color}`)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper functions for color conversion
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "";
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `${r}, ${g}, ${b}`;
};

const hexToHsl = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "";
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%`;
};
