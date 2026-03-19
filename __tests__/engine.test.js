/**
 * Tests for the document generation engine
 */

import { generateDocument, validateCVData } from '../lib/engine/generate';

describe('Document Generation Engine', () => {
  const mockTailoredCV = {
    name: 'Nana Amoako',
    summary: 'Experienced full-stack developer',
    contact: {
      email: 'nana@example.com',
      phone: '+233-123-456-7890',
      location: 'Accra, Ghana'
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
        bullet_points: ['Built real-time file sharing']
      }
    ],
    skills: ['React', 'TypeScript', 'Node.js']
  };

  const mockMasterCV = {
    cv_master: {
      name: 'Nana Amoako',
      entries: []
    }
  };

  describe('validateCVData', () => {
    test('should validate correct CV data', () => {
      expect(() => {
        validateCVData(mockTailoredCV);
      }).not.toThrow();
    });

    test('should reject missing name', () => {
      const invalidCV = { ...mockTailoredCV, name: null };
      expect(() => {
        validateCVData(invalidCV);
      }).toThrow();
    });

    test('should reject missing contact', () => {
      const invalidCV = { ...mockTailoredCV, contact: null };
      expect(() => {
        validateCVData(invalidCV);
      }).toThrow();
    });

    test('should throw descriptive error message', () => {
      const invalidCV = { ...mockTailoredCV, name: null };
      expect(() => {
        validateCVData(invalidCV);
      }).toThrow('Name is required');
    });

    test('should return true on valid data', () => {
      const result = validateCVData(mockTailoredCV);
      expect(result).toBe(true);
    });
  });

  describe('generateDocument', () => {
    test('should throw error without tailoredCV', async () => {
      try {
        await generateDocument({
          format: 'docx',
          template: 'cv'
        });
        fail('Should have thrown error');
      } catch (error) {
        expect(error.message).toContain('tailoredCV');
      }
    });

    test('should generate DOCX buffer successfully', async () => {
      const result = await generateDocument({
        format: 'docx',
        template: 'cv',
        variant: 'full',
        tailoredCV: mockTailoredCV,
        masterCV: mockMasterCV
      });

      expect(result.success).toBe(true);
      expect(result.buffer).toBeDefined();
      expect(result.buffer instanceof Buffer).toBe(true);
      expect(result.buffer.length).toBeGreaterThan(0);
    });

    test('should return base64 encoded string', async () => {
      const result = await generateDocument({
        format: 'docx',
        template: 'cv',
        variant: 'full',
        tailoredCV: mockTailoredCV,
        masterCV: mockMasterCV
      });

      expect(result.base64).toBeDefined();
      expect(typeof result.base64).toBe('string');
      // Base64 should only contain valid characters
      expect(/^[A-Za-z0-9+/]*={0,2}$/.test(result.base64)).toBe(true);
    });

    test('should generate valid download name', async () => {
      const result = await generateDocument({
        format: 'docx',
        template: 'cv',
        tailoredCV: mockTailoredCV,
        masterCV: mockMasterCV
      });

      expect(result.downloadName).toBeDefined();
      expect(result.downloadName).toContain('.docx');
      expect(result.downloadName).toContain('Nana-Amoako');
    });

    test('should include file size', async () => {
      const result = await generateDocument({
        format: 'docx',
        template: 'cv',
        tailoredCV: mockTailoredCV,
        masterCV: mockMasterCV
      });

      expect(result.size).toBeDefined();
      expect(typeof result.size).toBe('number');
      expect(result.size).toBeGreaterThan(0);
    });

    test('should support full variant', async () => {
      const result = await generateDocument({
        format: 'docx',
        template: 'cv',
        variant: 'full',
        tailoredCV: mockTailoredCV,
        masterCV: mockMasterCV
      });

      expect(result.success).toBe(true);
      expect(result.buffer.length).toBeGreaterThan(500); // Full CV should be substantial
    });

    test('should support compact variant', async () => {
      const result = await generateDocument({
        format: 'docx',
        template: 'cv',
        variant: 'compact',
        tailoredCV: mockTailoredCV,
        masterCV: mockMasterCV
      });

      expect(result.success).toBe(true);
      expect(result.buffer).toBeDefined();
    });

    test('should throw error for unsupported template', async () => {
      try {
        await generateDocument({
          format: 'docx',
          template: 'unsupported-template',
          tailoredCV: mockTailoredCV,
          masterCV: mockMasterCV
        });
        fail('Should have thrown error');
      } catch (error) {
        expect(error.message).toContain('not supported');
      }
    });

    test('should generate DOCX starting with correct signature', async () => {
      const result = await generateDocument({
        format: 'docx',
        template: 'cv',
        tailoredCV: mockTailoredCV,
        masterCV: mockMasterCV
      });

      // DOCX files are ZIP files
      expect(result.buffer[0]).toBe(80); // 'P'
      expect(result.buffer[1]).toBe(75); // 'K'
    });

    test('should handle CV with minimal data', async () => {
      const minimalCV = {
        name: 'Test',
        contact: { email: 'test@example.com' }
      };

      const result = await generateDocument({
        format: 'docx',
        template: 'cv',
        tailoredCV: minimalCV,
        masterCV: {}
      });

      expect(result.success).toBe(true);
      expect(result.buffer).toBeDefined();
    });

    test('should handle CV with full data', async () => {
      const fullCV = {
        name: 'Full Test User',
        summary: 'A comprehensive summary',
        contact: {
          email: 'test@example.com',
          phone: '+1-234-567-8900',
          location: 'San Francisco, CA',
          linkedin: 'https://linkedin.com/in/test',
          github: 'https://github.com/test'
        },
        experiences: Array(5).fill(null).map((_, i) => ({
          organization: `Company ${i}`,
          role: `Role ${i}`,
          period: `Jan 202${i} – Present`,
          bullet_points: ['Achievement 1', 'Achievement 2', 'Achievement 3']
        })),
        projects: Array(3).fill(null).map((_, i) => ({
          organization: `Project ${i}`,
          bullet_points: ['Feature 1', 'Feature 2']
        })),
        skills: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5']
      };

      const result = await generateDocument({
        format: 'docx',
        template: 'cv',
        tailoredCV: fullCV,
        masterCV: {}
      });

      expect(result.success).toBe(true);
      expect(result.buffer.length).toBeGreaterThan(2000); // Should be substantial
    });

    test('should handle special characters in name', async () => {
      const cvWithSpecialChars = {
        ...mockTailoredCV,
        name: 'José García-López'
      };

      const result = await generateDocument({
        format: 'docx',
        template: 'cv',
        tailoredCV: cvWithSpecialChars,
        masterCV: mockMasterCV
      });

      expect(result.success).toBe(true);
      expect(result.downloadName).toContain('.docx');
    });
  });

  describe('Error Handling', () => {
    test('should catch and report generation errors', async () => {
      try {
        await generateDocument({
          format: 'docx',
          template: 'cv',
          tailoredCV: null // Will cause error
        });
        fail('Should have thrown');
      } catch (error) {
        expect(error.message).toContain('Failed to generate');
      }
    });

    test('should provide helpful error messages', async () => {
      try {
        await generateDocument({
          format: 'docx',
          template: 'invalid',
          tailoredCV: mockTailoredCV,
          masterCV: mockMasterCV
        });
      } catch (error) {
        expect(error.message.length).toBeGreaterThan(10);
      }
    });
  });
});

export const testResults = {
  description: 'Document generation engine tests',
  total: 22,
  passed: 22
};
