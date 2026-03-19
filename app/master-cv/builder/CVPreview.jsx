'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Printer, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { previewDocument, downloadDocument, generatePDF } from '@/lib/engine/generate';

export function CVPreview({
  docxBuffer,
  tailoredCV,
  masterCV,
  onClose,
  format = 'docx'
}) {
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Generate preview on mount
  useEffect(() => {
    const generatePreview = async () => {
      try {
        setLoading(true);
        if (docxBuffer) {
          const preview = await previewDocument(docxBuffer);
          setHtmlContent(preview.html);
        }
      } catch (error) {
        console.error('Preview error:', error);
        toast.error('Failed to generate preview');
      } finally {
        setLoading(false);
      }
    };

    generatePreview();
  }, [docxBuffer]);

  const handleDownloadDocx = async () => {
    try {
      setDownloading(true);
      await downloadDocument({
        format: 'docx',
        template: 'cv',
        variant: 'full',
        tailoredCV,
        masterCV
      });
      toast.success('CV downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download CV');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrintPDF = async () => {
    try {
      setDownloading(true);
      if (docxBuffer) {
        await generatePDF(docxBuffer);
        toast.success('Print dialog opened');
      }
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to open print dialog');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">CV Preview</h2>
            <p className="text-sm text-gray-600">{tailoredCV.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader2 size={48} className="mx-auto mb-4 animate-spin text-blue-600" />
                <p className="text-gray-600">Generating preview...</p>
              </div>
            </div>
          ) : htmlContent ? (
            <div
              className="bg-white p-8 shadow-md rounded-lg mx-auto max-w-2xl"
              dangerouslySetInnerHTML={{
                __html: htmlContent
              }}
              style={{
                fontFamily: 'Verdana, sans-serif'
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500">No preview available</p>
            </div>
          )}
        </div>

        {/* Footer - Download/Print Buttons */}
        <div className="border-t p-6 bg-gray-50 flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>

          {format !== 'pdf' && (
            <button
              onClick={handleDownloadDocx}
              disabled={downloading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Download DOCX
            </button>
          )}

          {format !== 'docx' && (
            <button
              onClick={handlePrintPDF}
              disabled={downloading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Printer size={16} />
              )}
              Print PDF
            </button>
          )}

          {format === 'both' && (
            <>
              <button
                onClick={handleDownloadDocx}
                disabled={downloading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                DOCX
              </button>
              <button
                onClick={handlePrintPDF}
                disabled={downloading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Printer size={16} />
                )}
                PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
