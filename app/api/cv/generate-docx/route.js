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

    // Return as binary response so it can be downloaded
    return new Response(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${result.downloadName}"`,
        'Content-Length': result.buffer.length
      }
    });
  } catch (error) {
    console.error('DOCX generation error:', error);
    return Response.json(
      { error: error.message || 'Failed to generate DOCX' },
      { status: 500 }
    );
  }
}
