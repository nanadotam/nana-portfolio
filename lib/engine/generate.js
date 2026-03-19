'use client';

import { createDocx } from '../docx/builder';
import { buildCVTemplate, buildCompactCVTemplate } from '../templates/cv';

/**
 * Main document generation engine
 * Orchestrates the entire process from data to DOCX output
 */
export async function generateDocument({
  format = 'docx',
  template = 'cv',
  variant = 'full',
  tailoredCV,
  masterCV
}) {
  try {
    if (!tailoredCV) {
      throw new Error('tailoredCV is required');
    }

    // Step 1: Build template elements based on variant
    let elements;
    if (template === 'cv') {
      if (variant === 'compact') {
        elements = buildCompactCVTemplate(tailoredCV);
      } else {
        elements = buildCVTemplate(tailoredCV, masterCV);
      }
    } else {
      throw new Error(`Template "${template}" not supported`);
    }

    // Step 2: Generate DOCX buffer
    const docxBuffer = await createDocx(elements);

    // Step 3: Convert to base64 for easy transmission
    const base64 = Buffer.from(docxBuffer).toString('base64');

    return {
      success: true,
      format,
      buffer: docxBuffer,
      base64,
      size: docxBuffer.length,
      downloadName: `CV-${tailoredCV.name?.replace(/\s+/g, '-') || 'Untitled'}.docx`
    };
  } catch (error) {
    console.error('Document generation error:', error);
    throw new Error(`Failed to generate document: ${error.message}`);
  }
}

/**
 * Generates and downloads a document
 * Works in browser only
 */
export async function downloadDocument({
  format = 'docx',
  template = 'cv',
  variant = 'full',
  tailoredCV,
  masterCV
}) {
  try {
    const result = await generateDocument({
      format,
      template,
      variant,
      tailoredCV,
      masterCV
    });

    if (!result.success) {
      throw new Error('Document generation failed');
    }

    // Convert base64 to blob
    const binaryString = atob(result.base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return result;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

/**
 * Converts DOCX buffer to HTML for preview (requires mammoth library)
 */
export async function previewDocument(docxBuffer) {
  try {
    // Dynamically import mammoth only when needed (browser)
    const mammoth = (await import('mammoth')).default;

    const result = await mammoth.convertToHtml({ arrayBuffer: docxBuffer });

    return {
      html: result.value,
      messages: result.messages
    };
  } catch (error) {
    console.error('Preview error:', error);
    throw new Error(`Failed to generate preview: ${error.message}`);
  }
}

/**
 * Validates CV data before generation
 */
export function validateCVData(tailoredCV) {
  const errors = [];

  if (!tailoredCV.name) errors.push('Name is required');
  if (!tailoredCV.contact) errors.push('Contact information is required');

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }

  return true;
}

/**
 * Generates PDF by printing the HTML preview
 * Works in browser only
 */
export async function generatePDF(docxBuffer) {
  try {
    const { html } = await previewDocument(docxBuffer);

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Write HTML to iframe
    const doc = iframe.contentDocument;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Verdana, sans-serif; }
              * { box-sizing: border-box; }
            }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    doc.close();

    // Wait for content to load then print
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 100);

    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}
