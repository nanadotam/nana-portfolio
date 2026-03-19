import { generateDocument } from '@/lib/engine/generate';

export async function POST(req) {
  try {
    const { tailoredCV, masterCV, variant = 'full' } = await req.json();

    if (!tailoredCV) {
      return Response.json(
        { error: 'tailoredCV is required' },
        { status: 400 }
      );
    }

    // Generate the document
    const result = await generateDocument({
      format: 'docx',
      template: 'cv',
      variant,
      tailoredCV,
      masterCV
    });

    // Return base64 encoded buffer for preview
    return Response.json({
      success: true,
      base64: result.base64,
      size: result.size,
      downloadName: result.downloadName
    });
  } catch (error) {
    console.error('DOCX preview error:', error);
    return Response.json(
      { error: error.message || 'Failed to generate preview' },
      { status: 500 }
    );
  }
}
