'use client';

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function MasterCVAdminPage() {
  const supabase = createSupabaseClient();
  const [currentCV, setCurrentCV] = useState(null);
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCurrentCV();
  }, []);

  const loadCurrentCV = async () => {
    try {
      setLoading(true);

      // Get the most recent active CV
      const { data, error } = await supabase
        .from('master_cv')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const cv = data[0];
        setCurrentCV(cv);
        setJsonInput(JSON.stringify(cv.json_data, null, 2));
      } else {
        // Load from file system
        const response = await fetch('/data/master_cv.json');
        if (response.ok) {
          const fileCV = await response.json();
          setJsonInput(JSON.stringify(fileCV, null, 2));
        }
      }
    } catch (error) {
      console.error('Load CV error:', error);
      toast.error('Failed to load current CV');
    } finally {
      setLoading(false);
    }
  };

  const validateJSON = (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);

      // Check for required keys
      const required = ['personal_info', 'experience', 'education', 'projects', 'skills'];
      const missing = required.filter(k => !parsed[k]);

      if (missing.length > 0) {
        throw new Error(`Missing required keys: ${missing.join(', ')}`);
      }

      return parsed;
    } catch (error) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a .json file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        try {
          validateJSON(content);
          setJsonInput(content);
          toast.success('JSON loaded. Click "Save CV" to apply changes.');
        } catch (error) {
          toast.error(error.message);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSaveCV = async () => {
    try {
      setUploading(true);

      const parsed = validateJSON(jsonInput);

      // Save to Supabase
      const { error } = await supabase.from('master_cv').insert({
        json_data: parsed,
        is_active: true,
        uploaded_by: 'admin'
      });

      if (error) throw error;

      // Deactivate previous CVs
      await supabase
        .from('master_cv')
        .update({ is_active: false })
        .neq('json_data', JSON.stringify(parsed));

      setCurrentCV({ json_data: parsed, created_at: new Date().toISOString() });
      toast.success('Master CV saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadJSON = () => {
    const element = document.createElement('a');
    const file = new Blob([jsonInput], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'master_cv.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadCSV = () => {
    try {
      const parsed = validateJSON(jsonInput);
      let csv = 'Category,Item,Details\n';

      // Personal Info
      csv += `Personal,Name,${parsed.personal_info.name}\n`;
      csv += `Personal,Email,${parsed.personal_info.email}\n`;
      csv += `Personal,Phone,${parsed.personal_info.phone}\n`;

      // Experience
      (parsed.experience || []).forEach(exp => {
        csv += `Experience,"${exp.company}","${exp.role} | ${exp.location} | ${exp.start} to ${exp.end}"\n`;
      });

      // Education
      (parsed.education || []).forEach(edu => {
        csv += `Education,"${edu.institution}","${edu.degree} | ${edu.location}"\n`;
      });

      // Projects
      (parsed.projects || []).forEach(proj => {
        csv += `Projects,"${proj.name}","${proj.description}"\n`;
      });

      // Skills
      Object.entries(parsed.skills || {}).forEach(([category, skills]) => {
        if (Array.isArray(skills)) {
          csv += `Skills,${category},"${skills.join(', ')}"\n`;
        }
      });

      const element = document.createElement('a');
      const file = new Blob([csv], { type: 'text/csv' });
      element.href = URL.createObjectURL(file);
      element.download = 'master_cv.csv';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast.success('CSV downloaded!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
          <p>Loading Master CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Master CV Management</h1>
          <p className="text-gray-400">Upload, edit, and manage your master CV data</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <label className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors">
            <span>📤 Upload JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleSaveCV}
            disabled={uploading}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {uploading ? '💾 Saving...' : '💾 Save CV'}
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            📥 Download JSON
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            📊 Download CSV
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* JSON Editor */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>JSON Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
                className="w-full h-96 bg-gray-800 text-white p-4 rounded-lg border border-gray-700 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {currentCV && (
                  <>
                    {/* Personal Info */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">PERSONAL INFO</h3>
                      {currentCV.json_data?.personal_info && (
                        <div className="text-sm text-white space-y-1">
                          <p><strong>{currentCV.json_data.personal_info.name}</strong></p>
                          <p>{currentCV.json_data.personal_info.email}</p>
                          <p>{currentCV.json_data.personal_info.phone}</p>
                        </div>
                      )}
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">EDUCATION</h3>
                      <div className="space-y-2">
                        {currentCV.json_data?.education?.map((edu, i) => (
                          <div key={i} className="text-sm">
                            <p className="text-white font-medium">{edu.degree}</p>
                            <p className="text-gray-400">{edu.institution}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">EXPERIENCE</h3>
                      <div className="space-y-2">
                        {currentCV.json_data?.experience?.map((exp, i) => (
                          <div key={i} className="text-sm">
                            <p className="text-white font-medium">{exp.role}</p>
                            <p className="text-gray-400">{exp.company}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills Summary */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">SKILLS</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentCV.json_data?.skills?.frameworks?.slice(0, 5).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-900 text-blue-100 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Last Updated */}
                    <div className="pt-4 border-t border-gray-800">
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(currentCV.created_at).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="bg-gray-900 border-gray-800 mt-8">
          <CardHeader>
            <CardTitle>Required JSON Structure</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-300">
            <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
{`{
  "personal_info": { name, email, phone, location, ... },
  "experience": [ { company, role, start, end, achievements, ... } ],
  "education": [ { institution, degree, location, status, ... } ],
  "projects": [ { name, description, tech, start, end, highlights, ... } ],
  "skills": {
    "languages": [...],
    "frameworks": [...],
    "tools": [...],
    "design": [...],
    "databases": [...]
  }
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
