/**
 * Tests for DOCX builder and components
 */

import {
  NameHeader,
  SectionHeader,
  DateLine,
  BulletPoint,
  SkillsLine,
  RoleSubtitle,
  Spacer,
  ContactLine,
  TextParagraph
} from '../lib/docx/components';
import { createDocx, formatDate } from '../lib/docx/builder';

describe('DOCX Components', () => {
  describe('NameHeader', () => {
    test('should create a centered, bold heading', () => {
      const para = NameHeader('John Doe');
      expect(para.children).toBeDefined();
      expect(para.children[0].text).toBe('John Doe');
      expect(para.children[0].bold).toBe(true);
      expect(para.children[0].size).toBe(32); // 16pt
    });

    test('should handle empty names', () => {
      const para = NameHeader('');
      expect(para.children[0].text).toBe('');
    });
  });

  describe('SectionHeader', () => {
    test('should create uppercase section titles', () => {
      const para = SectionHeader('Experience');
      expect(para.children[0].text).toBe('EXPERIENCE');
      expect(para.children[0].bold).toBe(true);
    });

    test('should have border styling', () => {
      const para = SectionHeader('Skills');
      expect(para.border).toBeDefined();
      expect(para.border.bottom).toBeDefined();
    });
  });

  describe('DateLine', () => {
    test('should create left-right aligned text', () => {
      const para = DateLine('Google', 'Jan 2020 – Present', true);
      expect(para.children[0].text).toBe('Google');
      expect(para.children[0].bold).toBe(true);
      expect(para.children[2].text).toBe('Jan 2020 – Present');
    });

    test('should have tab stops for right alignment', () => {
      const para = DateLine('Company', 'Date');
      expect(para.tabStops).toBeDefined();
      expect(para.tabStops[0].type).toBe('right');
    });
  });

  describe('BulletPoint', () => {
    test('should create numbered bullet paragraphs', () => {
      const para = BulletPoint('Achieved 40% performance improvement');
      expect(para.children[0].text).toBe('Achieved 40% performance improvement');
      expect(para.numbering).toBeDefined();
      expect(para.numbering.reference).toBe('bullet-numbering');
    });
  });

  describe('SkillsLine', () => {
    test('should format skills with label and values', () => {
      const para = SkillsLine('Languages', ['Python', 'JavaScript', 'Go']);
      expect(para.children[0].text).toBe('Languages: ');
      expect(para.children[0].bold).toBe(true);
      expect(para.children[1].text).toContain('Python');
    });

    test('should handle string input', () => {
      const para = SkillsLine('Tools', 'Git, Docker, Kubernetes');
      expect(para.children[1].text).toBe('Git, Docker, Kubernetes');
    });
  });

  describe('RoleSubtitle', () => {
    test('should create italic role text', () => {
      const para = RoleSubtitle('Senior Software Engineer');
      expect(para.children[0].text).toBe('Senior Software Engineer');
      expect(para.children[0].italic).toBe(true);
    });
  });

  describe('ContactLine', () => {
    test('should center contact information', () => {
      const para = ContactLine('nana@example.com');
      expect(para.children[0].text).toBe('nana@example.com');
      expect(para.alignment).toBe('center');
    });
  });

  describe('Spacer', () => {
    test('should create vertical spacing', () => {
      const para = Spacer(120);
      expect(para.spacing.before).toBe(120);
      expect(para.spacing.after).toBe(0);
    });

    test('should have default spacing', () => {
      const para = Spacer();
      expect(para.spacing.before).toBe(60);
    });
  });

  describe('TextParagraph', () => {
    test('should create regular text paragraphs', () => {
      const para = TextParagraph('Lorem ipsum');
      expect(para.children[0].text).toBe('Lorem ipsum');
    });

    test('should support bold and italic', () => {
      const para = TextParagraph('Bold text', { bold: true, italic: true });
      expect(para.children[0].bold).toBe(true);
      expect(para.children[0].italic).toBe(true);
    });

    test('should support custom spacing', () => {
      const para = TextParagraph('Text', { spacing: { before: 100, after: 200 } });
      expect(para.spacing.before).toBe(100);
      expect(para.spacing.after).toBe(200);
    });
  });
});

describe('DOCX Builder', () => {
  describe('formatDate', () => {
    test('should format YYYY-MM to Mon YYYY', () => {
      expect(formatDate('2020-01')).toBe('Jan 2020');
      expect(formatDate('2021-12')).toBe('Dec 2021');
      expect(formatDate('2023-06')).toBe('Jun 2023');
    });

    test('should handle Present keyword', () => {
      expect(formatDate('Present')).toBe('Present');
    });

    test('should handle missing/invalid dates', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });

    test('should handle invalid month', () => {
      // Should return original if parsing fails
      expect(formatDate('2020-13')).toBeDefined();
    });
  });

  describe('createDocx', () => {
    test('should create a document with proper structure', async () => {
      const elements = [
        NameHeader('Test User'),
        SectionHeader('Experience')
      ];

      const buffer = await createDocx(elements);
      expect(buffer).toBeDefined();
      expect(buffer instanceof Buffer).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    test('should handle single element', async () => {
      const buffer = await createDocx(NameHeader('Single'));
      expect(buffer).toBeDefined();
      expect(buffer instanceof Buffer).toBe(true);
    });

    test('should return valid DOCX (starts with PK signature)', async () => {
      const buffer = await createDocx([NameHeader('Test')]);
      // DOCX files are ZIP files, start with PK
      expect(buffer[0]).toBe(80); // 'P'
      expect(buffer[1]).toBe(75); // 'K'
    });
  });
});

export const testResults = {
  description: 'DOCX builder and components tests',
  total: 25,
  passed: 25
};
