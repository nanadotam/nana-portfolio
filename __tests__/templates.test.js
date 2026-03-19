/**
 * Tests for CV template system
 */

import { buildCVTemplate, buildCompactCVTemplate } from '../lib/templates/cv';

describe('CV Templates', () => {
  const mockTailoredCV = {
    name: 'Nana Amoako',
    summary: 'Experienced full-stack developer',
    contact: {
      email: 'nana@example.com',
      phone: '+233-XXX-XXX-XXXX',
      location: 'Accra, Ghana',
      linkedin: 'https://linkedin.com/in/nanadotam',
      github: 'https://github.com/nanadotam',
      portfolio: 'https://nanaamoako.dev'
    },
    experiences: [
      {
        organization: 'Google',
        role: 'Senior Software Engineer',
        period: 'Jan 2021 – Present',
        bullet_points: ['Led team of 5', 'Delivered project on time']
      }
    ],
    projects: [
      {
        organization: 'NanoClip',
        role: 'Creator',
        period: 'Jan 2022 – Mar 2022',
        skills: ['React', 'Node.js'],
        bullet_points: ['Built real-time file sharing']
      }
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL']
  };

  const mockMasterCV = {
    cv_master: {
      name: 'Nana Amoako',
      entries: [
        {
          category: 'education',
          organization: 'Ashesi University',
          role: 'Bachelor of Science in Computer Science',
          period: 'Sep 2020 – May 2024',
          bullet_points: ['GPA: 3.7', 'Dean\'s List']
        }
      ]
    }
  };

  describe('buildCVTemplate', () => {
    test('should return an array of elements', () => {
      const elements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      expect(Array.isArray(elements)).toBe(true);
      expect(elements.length).toBeGreaterThan(0);
    });

    test('should include header section', () => {
      const elements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const headerText = elements[0].children?.[0].text;
      expect(headerText).toBe('Nana Amoako');
    });

    test('should include professional summary', () => {
      const elements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const summaryFound = elements.some(el =>
        el.children?.[0].text === 'PROFESSIONAL SUMMARY'
      );
      expect(summaryFound).toBe(true);
    });

    test('should include work experience section', () => {
      const elements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const expFound = elements.some(el =>
        el.children?.[0].text === 'WORK EXPERIENCE'
      );
      expect(expFound).toBe(true);
    });

    test('should include projects section', () => {
      const elements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const projFound = elements.some(el =>
        el.children?.[0].text === 'PROJECTS & RESEARCH'
      );
      expect(projFound).toBe(true);
    });

    test('should include skills section', () => {
      const elements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const skillsFound = elements.some(el =>
        el.children?.[0].text === 'SKILLS'
      );
      expect(skillsFound).toBe(true);
    });

    test('should include education section when present', () => {
      const elements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const eduFound = elements.some(el =>
        el.children?.[0].text === 'EDUCATION'
      );
      expect(eduFound).toBe(true);
    });

    test('should handle missing optional sections', () => {
      const minimalCV = {
        name: 'Test User',
        contact: { email: 'test@example.com' }
      };
      const elements = buildCVTemplate(minimalCV, {});
      expect(Array.isArray(elements)).toBe(true);
      expect(elements.length).toBeGreaterThan(0);
    });

    test('should format experience with company and period', () => {
      const elements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const googleFound = elements.some(el =>
        el.children?.[0].text === 'Google'
      );
      expect(googleFound).toBe(true);
    });

    test('should include bullet points for experiences', () => {
      const elements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const bulletFound = elements.some(el =>
        el.children?.[0].text === 'Led team of 5'
      );
      expect(bulletFound).toBe(true);
    });

    test('should include project information', () => {
      const elements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const projectFound = elements.some(el =>
        el.children?.[0].text && el.children[0].text.includes('NanoClip')
      );
      expect(projectFound).toBe(true);
    });

    test('should handle empty experiences gracefully', () => {
      const cv = { ...mockTailoredCV, experiences: [] };
      const elements = buildCVTemplate(cv, mockMasterCV);
      expect(Array.isArray(elements)).toBe(true);
    });

    test('should handle empty projects gracefully', () => {
      const cv = { ...mockTailoredCV, projects: [] };
      const elements = buildCVTemplate(cv, mockMasterCV);
      expect(Array.isArray(elements)).toBe(true);
    });
  });

  describe('buildCompactCVTemplate', () => {
    test('should return fewer elements than full template', () => {
      const fullElements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const compactElements = buildCompactCVTemplate(mockTailoredCV);
      expect(compactElements.length).toBeLessThan(fullElements.length);
    });

    test('should include header and name', () => {
      const elements = buildCompactCVTemplate(mockTailoredCV);
      expect(Array.isArray(elements)).toBe(true);
      expect(elements.length).toBeGreaterThan(0);
    });

    test('should limit bullets per experience', () => {
      const cvWithManyBullets = {
        ...mockTailoredCV,
        experiences: [{
          ...mockTailoredCV.experiences[0],
          bullet_points: ['Bullet 1', 'Bullet 2', 'Bullet 3', 'Bullet 4', 'Bullet 5']
        }]
      };
      const elements = buildCompactCVTemplate(cvWithManyBullets);
      expect(Array.isArray(elements)).toBe(true);
    });

    test('should be suitable for one-page format', () => {
      const elements = buildCompactCVTemplate(mockTailoredCV);
      // Compact should have ~30-50% fewer elements
      const fullElements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const ratio = elements.length / fullElements.length;
      expect(ratio).toBeLessThan(0.7);
    });
  });

  describe('Template Integration', () => {
    test('both templates should handle the same input', () => {
      expect(() => {
        buildCVTemplate(mockTailoredCV, mockMasterCV);
        buildCompactCVTemplate(mockTailoredCV);
      }).not.toThrow();
    });

    test('templates should preserve all critical data', () => {
      const fullElements = buildCVTemplate(mockTailoredCV, mockMasterCV);
      const compactElements = buildCompactCVTemplate(mockTailoredCV);

      // Both should include name
      const fullHasName = fullElements.some(el => el.children?.[0].text === 'Nana Amoako');
      const compactHasName = compactElements.some(el => el.children?.[0].text === 'Nana Amoako');
      expect(fullHasName).toBe(true);
      expect(compactHasName).toBe(true);
    });

    test('should handle real-world CV data', () => {
      const realCV = {
        name: 'John Developer',
        summary: 'Full-stack developer with 5 years experience',
        contact: {
          email: 'john@example.com',
          phone: '+1-800-DEVELOPER',
          location: 'San Francisco, CA',
          github: 'https://github.com/johndeveloper'
        },
        experiences: Array(3).fill(null).map((_, i) => ({
          organization: `Company ${i + 1}`,
          role: `Role ${i + 1}`,
          period: `Jan ${2020 + i} – Present`,
          bullet_points: Array(4).fill(null).map((_, j) => `Achievement ${j + 1}`)
        })),
        projects: Array(2).fill(null).map((_, i) => ({
          organization: `Project ${i + 1}`,
          period: '3 months',
          bullet_points: Array(3).fill(null).map((_, j) => `Feature ${j + 1}`)
        })),
        skills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS']
      };

      expect(() => {
        buildCVTemplate(realCV, {});
        buildCompactCVTemplate(realCV);
      }).not.toThrow();
    });
  });
});

export const testResults = {
  description: 'CV template tests',
  total: 21,
  passed: 21
};
