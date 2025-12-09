import React from 'react';
import { DutyCategory, ReportData } from '../types';

interface Props {
  data: ReportData;
}

export const ReportPreview: React.FC<Props> = ({ data }) => {
  // Group items by category for the report
  const groupedItems = Object.values(DutyCategory).reduce((acc, cat) => {
    const items = data.items.filter(i => i.category === cat);
    if (items.length > 0) {
      acc[cat] = items;
    }
    return acc;
  }, {} as Record<DutyCategory, typeof data.items>);

  const hasAnalytics = Object.values(data.analytics).some((val) => (val as string).trim() !== "");

  return (
    <div className="bg-white text-black p-8 max-w-[210mm] mx-auto min-h-[297mm] shadow-2xl print:shadow-none print:w-full print:max-w-none print:p-0">
      
      {/* Letterhead Placeholder */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center print:border print:border-gray-300">
          <span className="text-[10px] text-gray-500 font-serif text-center leading-tight">Coat of<br/>Arms</span>
        </div>
        <h1 className="font-serif font-bold text-xl uppercase tracking-wide">Government of Trinidad and Tobago</h1>
        <h2 className="font-sans font-semibold text-md mt-1">Ministry / Department of Digital Transformation</h2>
        <p className="text-sm mt-2 font-medium">Weekly Activity Report</p>
      </div>

      {/* Metadata Table */}
      <div className="mb-6">
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr>
              <td className="font-bold py-1 w-32">Job Title:</td>
              <td className="py-1">Web Designer (Contractual)</td>
              <td className="font-bold py-1 w-32 text-right pr-2">Week Ending:</td>
              <td className="py-1">{data.weekEnding || "_________________"}</td>
            </tr>
            <tr>
              <td className="font-bold py-1">Employee:</td>
              <td className="py-1">{data.employeeName || "_________________"}</td>
              <td className="font-bold py-1 text-right pr-2">Date:</td>
              <td className="py-1">{data.reportDate}</td>
            </tr>
            <tr>
              <td className="font-bold py-1">Reports To:</td>
              <td className="py-1" colSpan={3}>Manager, Communications / Designated Officer</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Executive Summary */}
      {data.summary && (
        <div className="mb-6">
          <h3 className="font-bold text-sm uppercase border-b border-gray-400 mb-2 pb-1 bg-gray-100 px-1 print:bg-transparent">Executive Summary</h3>
          <p className="text-sm text-justify leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Analytics Snapshot */}
      {hasAnalytics && (
        <div className="mb-6">
          <h3 className="font-bold text-sm uppercase border-b border-gray-400 mb-2 pb-1 bg-gray-100 px-1 print:bg-transparent">Website Analytics Snapshot</h3>
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-50 print:bg-transparent">
              <tr>
                <th className="border border-gray-300 px-2 py-1 text-left">Page Views</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Unique Visitors</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Bounce Rate</th>
                <th className="border border-gray-300 px-2 py-1 text-left">Avg. Session</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-2 py-1">{data.analytics.pageViews || "-"}</td>
                <td className="border border-gray-300 px-2 py-1">{data.analytics.uniqueVisitors || "-"}</td>
                <td className="border border-gray-300 px-2 py-1">{data.analytics.bounceRate || "-"}</td>
                <td className="border border-gray-300 px-2 py-1">{data.analytics.avgSessionDuration || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Activities */}
      <div className="mb-6">
        <h3 className="font-bold text-sm uppercase border-b border-gray-400 mb-4 pb-1 bg-gray-100 px-1 print:bg-transparent">Activities & Deliverables</h3>
        
        {Object.entries(groupedItems).length === 0 && (
          <p className="text-sm text-gray-400 italic">No activities recorded for this period.</p>
        )}

        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="mb-4 break-inside-avoid">
            <h4 className="font-bold text-sm text-gray-800 mb-2 underline decoration-gray-300">{category}</h4>
            <ul className="list-disc pl-5 space-y-1">
              {items.map(item => (
                <li key={item.id} className="text-sm leading-snug">
                  <span className="text-black">{item.description}</span>
                  {item.status !== 'Completed' && (
                    <span className="text-xs ml-2 italic text-gray-600">[{item.status}]</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Challenges & Next Steps */}
      <div className="grid grid-cols-2 gap-8 mb-8 break-inside-avoid">
        {data.challenges && (
          <div>
            <h3 className="font-bold text-sm uppercase border-b border-gray-400 mb-2 pb-1 bg-gray-100 px-1 print:bg-transparent">Key Challenges</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.challenges}</p>
          </div>
        )}
        {data.nextSteps && (
          <div>
            <h3 className="font-bold text-sm uppercase border-b border-gray-400 mb-2 pb-1 bg-gray-100 px-1 print:bg-transparent">Projected Actions (Next Week)</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.nextSteps}</p>
          </div>
        )}
      </div>

      {/* Footer Signatures */}
      <div className="mt-12 break-inside-avoid">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <div className="border-t border-black pt-2">
              <p className="text-xs font-bold uppercase">Submitted By (Signature)</p>
            </div>
          </div>
          <div>
            <div className="border-t border-black pt-2">
              <p className="text-xs font-bold uppercase">Received By (Manager)</p>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-8 text-center">Generated via GovDesign Weekly Report App</p>
      </div>

    </div>
  );
};