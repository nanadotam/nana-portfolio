import {
  Paragraph,
  TextRun,
  AlignmentType,
  LevelFormat,
  BorderStyle,
  TabStopType,
  TabStopPosition,
} from 'docx';

const FONT = 'Verdana';
const FONT_SIZE = 20; // 10pt in half-points

/**
 * Creates a centered heading for section titles
 */
export function SectionHeader(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 24, // 12pt
        font: FONT,
        color: '000000'
      })
    ],
    alignment: AlignmentType.CENTER,
    border: {
      bottom: {
        color: '000000',
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6
      }
    },
    spacing: {
      before: 120,
      after: 60,
      line: 240,
      lineRule: 'auto'
    }
  });
}

/**
 * Creates a paragraph with left-right date formatting
 * Uses tab stops for right-alignment
 */
export function DateLine(leftText, rightText, isBold = false) {
  return new Paragraph({
    children: [
      new TextRun({
        text: leftText,
        bold: isBold,
        size: FONT_SIZE,
        font: FONT
      }),
      new TextRun({
        text: '\t',
        font: FONT
      }),
      new TextRun({
        text: rightText,
        size: FONT_SIZE,
        font: FONT
      })
    ],
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX
      }
    ],
    spacing: {
      before: 40,
      after: 20,
      line: 240,
      lineRule: 'auto'
    }
  });
}

/**
 * Creates a bullet point paragraph
 */
export function BulletPoint(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: FONT_SIZE,
        font: FONT
      })
    ],
    numbering: {
      reference: 'bullet-numbering',
      level: 0
    },
    spacing: {
      before: 20,
      after: 20,
      line: 240,
      lineRule: 'auto'
    }
  });
}

/**
 * Creates a simple text paragraph
 */
export function TextParagraph(text, options = {}) {
  const { bold = false, italic = false, size = FONT_SIZE, spacing = { before: 20, after: 20 } } = options;

  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold,
        italic,
        size,
        font: FONT
      })
    ],
    spacing
  });
}

/**
 * Creates a header with company name and location
 */
export function ExperienceHeader(company, location, bold = true) {
  return DateLine(`${company}`, `${location}`, bold);
}

/**
 * Creates a role subtitle
 */
export function RoleSubtitle(role) {
  return new Paragraph({
    children: [
      new TextRun({
        text: role,
        italic: true,
        size: FONT_SIZE,
        font: FONT
      })
    ],
    spacing: {
      before: 0,
      after: 40,
      line: 240,
      lineRule: 'auto'
    }
  });
}

/**
 * Creates a horizontal spacing element
 */
export function Spacer(height = 60) {
  return new Paragraph({
    children: [new TextRun('')],
    spacing: {
      before: height,
      after: 0
    }
  });
}

/**
 * Creates a skills line with label and comma-separated values
 */
export function SkillsLine(label, skills) {
  const skillsText = Array.isArray(skills) ? skills.join(', ') : skills;

  return new Paragraph({
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        size: FONT_SIZE,
        font: FONT
      }),
      new TextRun({
        text: skillsText,
        size: FONT_SIZE,
        font: FONT
      })
    ],
    spacing: {
      before: 30,
      after: 30,
      line: 240,
      lineRule: 'auto'
    }
  });
}

/**
 * Creates a contact info line
 */
export function ContactLine(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: FONT_SIZE,
        font: FONT
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: {
      before: 0,
      after: 20,
      line: 240,
      lineRule: 'auto'
    }
  });
}

/**
 * Creates a name header (centered, large, bold)
 */
export function NameHeader(name) {
  return new Paragraph({
    children: [
      new TextRun({
        text: name,
        bold: true,
        size: 32, // 16pt
        font: FONT
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: {
      before: 0,
      after: 60,
      line: 240,
      lineRule: 'auto'
    }
  });
}
