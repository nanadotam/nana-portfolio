import {
  NameHeader,
  ContactLine,
  SectionHeader,
  DateLine,
  RoleSubtitle,
  BulletPoint,
  SkillsLine,
  TextParagraph,
  Spacer,
  ExperienceHeader
} from '../docx/components';
import { formatDate, flattenArray } from '../docx/builder';

/**
 * Builds a complete CV from tailored CV data
 * @param {Object} tailoredCV - The tailored CV object from Groq selection
 * @param {Object} masterCV - The full master CV for additional context
 * @returns {Array} - Array of document elements (Paragraphs)
 */
export function buildCVTemplate(tailoredCV, masterCV) {
  const elements = [];

  // ── HEADER ──────────────────────────────────────────────
  const name = tailoredCV.name || masterCV?.cv_master?.name || 'Candidate';
  elements.push(NameHeader(name));

  // Contact info
  const contact = tailoredCV.contact || {};
  if (contact.email) elements.push(ContactLine(contact.email));
  if (contact.phone) elements.push(ContactLine(contact.phone));
  if (contact.location) elements.push(ContactLine(contact.location));

  // Links (LinkedIn, GitHub, etc)
  const links = [];
  if (contact.linkedin) links.push(`LinkedIn: ${contact.linkedin}`);
  if (contact.github) links.push(`GitHub: ${contact.github}`);
  if (contact.portfolio) links.push(`Portfolio: ${contact.portfolio}`);

  if (links.length > 0) {
    elements.push(ContactLine(links.join(' | ')));
  }

  elements.push(Spacer(60));

  // ── PROFESSIONAL SUMMARY ────────────────────────────────
  if (tailoredCV.summary) {
    elements.push(SectionHeader('Professional Summary'));
    elements.push(TextParagraph(tailoredCV.summary, {
      spacing: { before: 20, after: 60, line: 240, lineRule: 'auto' }
    }));
  }

  // ── EXPERIENCE ───────────────────────────────────────────
  if (tailoredCV.experiences && tailoredCV.experiences.length > 0) {
    elements.push(SectionHeader('Work Experience'));

    tailoredCV.experiences.forEach((exp) => {
      // Company and location
      const dateRange = `${formatDate(exp.period?.split(' - ')[0] || exp.start)}${
        exp.period?.includes(' - ') ? ' – ' + formatDate(exp.period.split(' - ')[1] || exp.end) : ''
      }`;

      elements.push(DateLine(exp.organization || '', dateRange, true));

      // Role
      if (exp.role) {
        elements.push(RoleSubtitle(exp.role));
      }

      // Bullet points (achievements)
      if (exp.bullet_points && exp.bullet_points.length > 0) {
        exp.bullet_points.forEach((bullet) => {
          if (bullet && bullet.trim()) {
            elements.push(BulletPoint(bullet));
          }
        });
      }
    });
  }

  // ── PROJECTS/RESEARCH ───────────────────────────────────
  if (tailoredCV.projects && tailoredCV.projects.length > 0) {
    elements.push(SectionHeader('Projects & Research'));

    tailoredCV.projects.forEach((proj) => {
      // Project name and date
      const dateRange = proj.period || '';
      const tech = proj.skills || [];
      const techStr = tech.length > 0 ? ` | ${tech.join(', ')}` : '';

      elements.push(DateLine(`${proj.organization || proj.role || 'Project'}${techStr}`, dateRange, true));

      // Highlights
      if (proj.bullet_points && proj.bullet_points.length > 0) {
        proj.bullet_points.forEach((bullet) => {
          if (bullet && bullet.trim()) {
            elements.push(BulletPoint(bullet));
          }
        });
      }
    });
  }

  // ── SKILLS ──────────────────────────────────────────────
  if (tailoredCV.skills && tailoredCV.skills.length > 0) {
    elements.push(SectionHeader('Skills'));

    // Group skills by category if available, otherwise just list
    const skills = tailoredCV.skills;
    if (Array.isArray(skills)) {
      elements.push(SkillsLine('Technical Skills', skills));
    } else if (typeof skills === 'object') {
      // If skills is an object with categories
      Object.entries(skills).forEach(([category, skillList]) => {
        if (skillList && skillList.length > 0) {
          elements.push(SkillsLine(category, skillList));
        }
      });
    }
  }

  // ── EDUCATION ───────────────────────────────────────────
  if (masterCV?.cv_master?.entries) {
    const educationEntries = masterCV.cv_master.entries.filter(
      (e) => e.category === 'education' || e.category === 'Education'
    );

    if (educationEntries.length > 0) {
      elements.push(SectionHeader('Education'));

      educationEntries.forEach((edu) => {
        // Institution and location
        const dateRange = edu.period || '';
        elements.push(DateLine(edu.organization || '', dateRange, true));

        // Degree
        if (edu.role || edu.title) {
          elements.push(RoleSubtitle(edu.role || edu.title));
        }

        // Highlights (if any)
        if (edu.bullet_points && edu.bullet_points.length > 0) {
          edu.bullet_points.forEach((bullet) => {
            if (bullet && bullet.trim()) {
              elements.push(TextParagraph(bullet, {
                spacing: { before: 10, after: 10, line: 240, lineRule: 'auto' }
              }));
            }
          });
        }
      });
    }
  }

  // ── CERTIFICATIONS/AWARDS ────────────────────────────────
  if (masterCV?.cv_master?.entries) {
    const certEntries = masterCV.cv_master.entries.filter(
      (e) => e.category === 'certification' || e.category === 'Certification' || e.category === 'award'
    );

    if (certEntries.length > 0) {
      elements.push(SectionHeader('Certifications & Awards'));

      certEntries.forEach((cert) => {
        const dateRange = cert.period || '';
        elements.push(DateLine(cert.organization || '', dateRange, true));

        if (cert.role || cert.title) {
          elements.push(TextParagraph(cert.role || cert.title, {
            spacing: { before: 0, after: 20, line: 240, lineRule: 'auto' }
          }));
        }
      });
    }
  }

  return elements;
}

/**
 * Alternative template - minimal version focusing on most relevant content
 */
export function buildCompactCVTemplate(tailoredCV) {
  const elements = [];

  // Header
  const name = tailoredCV.name || 'Candidate';
  elements.push(NameHeader(name));

  // Contact (single line)
  const contact = tailoredCV.contact || {};
  const contactInfo = [contact.email, contact.phone, contact.location]
    .filter(Boolean)
    .join(' | ');

  if (contactInfo) {
    elements.push(ContactLine(contactInfo));
  }

  elements.push(Spacer(40));

  // Summary
  if (tailoredCV.summary) {
    elements.push(SectionHeader('Summary'));
    elements.push(TextParagraph(tailoredCV.summary));
  }

  // Experience
  if (tailoredCV.experiences && tailoredCV.experiences.length > 0) {
    elements.push(SectionHeader('Experience'));

    tailoredCV.experiences.forEach((exp) => {
      const dateRange = exp.period || '';
      elements.push(DateLine(exp.organization || '', dateRange, true));
      if (exp.role) elements.push(RoleSubtitle(exp.role));

      if (exp.bullet_points) {
        exp.bullet_points.slice(0, 3).forEach((bullet) => {
          if (bullet) elements.push(BulletPoint(bullet));
        });
      }
    });
  }

  // Skills (single line)
  if (tailoredCV.skills && tailoredCV.skills.length > 0) {
    elements.push(SectionHeader('Skills'));
    elements.push(SkillsLine('', tailoredCV.skills));
  }

  return elements;
}
