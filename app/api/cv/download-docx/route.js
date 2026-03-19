import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';

export async function POST(request) {
  try {
    const { cv, answers } = await request.json();

    if (!cv) {
      return Response.json(
        { error: "CV data is required" },
        { status: 400 }
      );
    }

    const FONT = "Verdana";
    const children = [];

    // Name
    children.push(
      new Paragraph({
        children: [new TextRun({ text: cv.name, bold: true, size: 32, font: FONT })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      })
    );

    // Contact line
    const contactParts = [
      cv.contact?.email,
      cv.contact?.phone,
      cv.contact?.location,
      cv.contact?.linkedin,
      cv.contact?.github,
    ].filter(Boolean);

    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join("  |  "), size: 18, font: FONT, color: "666666" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Helper to add section headers
    const addSection = (title) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, font: FONT, color: "000000" })],
          spacing: { before: 300, after: 100 },
          border: { bottom: { style: "single", size: 1, color: "000000" } },
        })
      );
    };

    // Professional Summary
    if (cv.summary) {
      addSection("Professional Summary");
      children.push(
        new Paragraph({
          children: [new TextRun({ text: cv.summary, size: 20, font: FONT })],
          spacing: { after: 100 },
        })
      );
    }

    // Experience
    if (cv.experiences?.length) {
      addSection("Experience");
      cv.experiences.forEach((exp) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.role, bold: true, size: 21, font: FONT }),
              new TextRun({ text: `  —  ${exp.organization}`, size: 21, font: FONT, color: "555555" }),
            ],
            spacing: { before: 140, after: 40 },
          })
        );
        children.push(
          new Paragraph({
            children: [new TextRun({ text: exp.period || "", italics: true, size: 18, font: FONT, color: "888888" })],
            spacing: { after: 60 },
          })
        );
        (exp.bullet_points || []).forEach((bp) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: bp, size: 20, font: FONT })],
              bullet: { level: 0 },
              spacing: { after: 40 },
            })
          );
        });
      });
    }

    // Projects
    if (cv.projects?.length) {
      addSection("Projects");
      cv.projects.forEach((proj) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: proj.organization || proj.role, bold: true, size: 21, font: FONT }),
              new TextRun({ text: `  (${proj.period || ""})`, size: 18, font: FONT, color: "888888" }),
            ],
            spacing: { before: 140, after: 40 },
          })
        );
        (proj.bullet_points || []).forEach((bp) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: bp, size: 20, font: FONT })],
              bullet: { level: 0 },
              spacing: { after: 40 },
            })
          );
        });
      });
    }

    // Technical Skills
    if (cv.skills?.length) {
      addSection("Technical Skills");
      children.push(
        new Paragraph({
          children: [new TextRun({ text: cv.skills.join("  |  "), size: 20, font: FONT })],
          spacing: { after: 100 },
        })
      );
    }

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { font: FONT }
          }
        }
      },
      sections: [
        {
          properties: {
            page: {
              size: { width: 12240, height: 15840 },
              margin: { top: 720, right: 720, bottom: 720, left: 720 },
            },
          },
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${cv.name.replace(/\s+/g, "_")}_CV_${answers?.role?.replace(/\s+/g, "_") || "Tailored"}.docx"`,
      },
    });
  } catch (error) {
    console.error("DOCX generation error:", error);
    return Response.json(
      { error: error.message || "Failed to generate DOCX" },
      { status: 500 }
    );
  }
}
