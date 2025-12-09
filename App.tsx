import React, { useState } from 'react';
import { ReportForm } from './components/ReportForm';
import { ReportPreview } from './components/ReportPreview';
import { ReportData, INITIAL_REPORT_DATA } from './types';
import { polishReportContent } from './services/geminiService';
import { Printer, Edit3, Eye, FileText, Wand2, AlertCircle } from 'lucide-react';

export default function App() {
  const [reportData, setReportData] = useState<ReportData>(INITIAL_REPORT_DATA);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [isPolishing, setIsPolishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePolish = async () => {
    setIsPolishing(true);
    setErrorMsg(null);
    try {
      const polished = await polishReportContent(reportData);
      setReportData(prev => ({
        ...prev,
        ...polished
      }));
    } catch (err) {
      setErrorMsg("Failed to connect to AI service. Please ensure API Key is configured.");
    } finally {
      setIsPolishing(false);
    }
  };

  const handlePrint = () => {
    setViewMode('preview');
    // Allow React to render the preview first
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navigation Bar - Hidden on Print */}
      <nav className="bg-gov-900 text-white shadow-lg no-print sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none">GovDesign Weekly</h1>
                <span className="text-xs text-gov-100 opacity-80">Official Reporting Tool</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-gov-800 rounded-lg p-1 mr-4">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'edit' ? 'bg-white text-gov-900 shadow-sm' : 'text-gov-100 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'preview' ? 'bg-white text-gov-900 shadow-sm' : 'text-gov-100 hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>

              {viewMode === 'edit' && (
                <button
                  onClick={handlePolish}
                  disabled={isPolishing}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Wand2 className={`w-4 h-4 ${isPolishing ? 'animate-spin' : ''}`} />
                  {isPolishing ? 'Polishing...' : 'AI Polish'}
                </button>
              )}

              <button
                onClick={handlePrint}
                className="bg-white text-gov-900 hover:bg-gov-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-transparent"
              >
                <Printer className="w-4 h-4" />
                Print PDF
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:max-w-none">
        
        {errorMsg && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md no-print">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'edit' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
               <ReportForm 
                  data={reportData} 
                  onChange={setReportData} 
                  onPolish={handlePolish}
                  isPolishing={isPolishing}
                />
            </div>
            <div className="lg:col-span-4">
               {/* Quick Tips / Job Description Context Sidebar */}
               <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                  <h3 className="font-bold text-gray-900 mb-3">Writing Guide</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Based on your Job Description (Ref#: C004), your report should highlight:
                  </p>
                  <ul className="text-xs space-y-2 text-gray-600 list-disc pl-4">
                    <li><strong className="text-gov-800">Accessibility:</strong> Compliance with government standards for citizens with disabilities.</li>
                    <li><strong className="text-gov-800">Engagement:</strong> Features like forms, surveys, and interactive elements.</li>
                    <li><strong className="text-gov-800">Maintenance:</strong> Updates to content ensuring it is current and relevant.</li>
                    <li><strong className="text-gov-800">Testing:</strong> Usability and responsiveness checks on devices.</li>
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 italic">
                      Tip: Use the <strong>AI Polish</strong> button to automatically format your rough notes into the formal language required by the Ministry.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <ReportPreview data={reportData} />
          </div>
        )}
      </main>
    </div>
  );
}