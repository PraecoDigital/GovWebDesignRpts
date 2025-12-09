import React, { useState } from 'react';
import { DutyCategory, ReportData, ReportItem, JD_DUTIES_MAP } from '../types';
import { Plus, Trash2, Wand2, Loader2, Save, BarChart3 } from 'lucide-react';

interface Props {
  data: ReportData;
  onChange: (data: ReportData) => void;
  onPolish: () => void;
  isPolishing: boolean;
}

export const ReportForm: React.FC<Props> = ({ data, onChange, onPolish, isPolishing }) => {
  const [activeCategory, setActiveCategory] = useState<DutyCategory>(DutyCategory.DESIGN_DEV);
  const [newItemText, setNewItemText] = useState("");

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newItem: ReportItem = {
      id: crypto.randomUUID(),
      category: activeCategory,
      description: newItemText,
      status: 'Completed'
    };
    onChange({ ...data, items: [...data.items, newItem] });
    setNewItemText("");
  };

  const handleRemoveItem = (id: string) => {
    onChange({ ...data, items: data.items.filter(i => i.id !== id) });
  };

  const updateItemStatus = (id: string, status: ReportItem['status']) => {
    onChange({
      ...data,
      items: data.items.map(i => i.id === id ? { ...i, status } : i)
    });
  };

  const updateAnalytics = (field: keyof typeof data.analytics, value: string) => {
    onChange({
      ...data,
      analytics: {
        ...data.analytics,
        [field]: value
      }
    });
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-8">
      
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gov-600 focus:border-transparent outline-none bg-white text-gray-900"
            placeholder="e.g. John Doe"
            value={data.employeeName}
            onChange={(e) => onChange({ ...data, employeeName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Week Ending</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gov-600 focus:border-transparent outline-none bg-white text-gray-900"
            value={data.weekEnding}
            onChange={(e) => onChange({ ...data, weekEnding: e.target.value })}
          />
        </div>
      </div>

      {/* Executive Summary */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Executive Summary</label>
          <button
            onClick={onPolish}
            disabled={isPolishing}
            className="text-xs flex items-center gap-1 text-gov-600 hover:text-gov-800 font-medium"
          >
            {isPolishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
            AI Polish
          </button>
        </div>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gov-600 focus:border-transparent outline-none resize-none bg-white text-gray-900"
          placeholder="Briefly describe your main achievements this week..."
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
        />
      </div>

      {/* Duties Tracker */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Save className="w-5 h-5 text-gov-600" />
          Duties & Deliverables
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Category Selector */}
          <div className="lg:col-span-1 space-y-1">
            {Object.values(DutyCategory).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  activeCategory === cat 
                    ? 'bg-gov-50 text-gov-800 border-l-4 border-gov-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="lg:col-span-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-bold text-gray-800 mb-2">{activeCategory}</h4>
            <p className="text-xs text-gray-500 mb-4 italic">"{JD_DUTIES_MAP[activeCategory]}"</p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gov-600 outline-none text-sm bg-white text-gray-900"
                placeholder="What did you do in this area this week?"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-gov-600 text-white rounded-md hover:bg-gov-800 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {data.items.filter(i => i.category === activeCategory).length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">No entries for this duty yet.</p>
              )}
              {data.items.filter(i => i.category === activeCategory).map(item => (
                <div key={item.id} className="bg-white p-3 rounded border border-gray-200 shadow-sm flex items-start gap-3 group">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{item.description}</p>
                    <div className="flex gap-2 mt-2">
                      {(['Completed', 'In Progress', 'Planned'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => updateItemStatus(item.id, status)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            item.status === status
                              ? 'bg-gov-100 text-gov-800 border-gov-200'
                              : 'bg-transparent text-gray-400 border-transparent hover:bg-gray-50'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gov-600" />
          Standard Website Analytics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Total Page Views</label>
            <input
              type="text"
              placeholder="e.g. 15,200"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gov-600 focus:border-transparent outline-none text-sm bg-white text-gray-900"
              value={data.analytics.pageViews}
              onChange={(e) => updateAnalytics('pageViews', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Unique Visitors</label>
            <input
              type="text"
              placeholder="e.g. 8,450"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gov-600 focus:border-transparent outline-none text-sm bg-white text-gray-900"
              value={data.analytics.uniqueVisitors}
              onChange={(e) => updateAnalytics('uniqueVisitors', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bounce Rate</label>
            <input
              type="text"
              placeholder="e.g. 45%"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gov-600 focus:border-transparent outline-none text-sm bg-white text-gray-900"
              value={data.analytics.bounceRate}
              onChange={(e) => updateAnalytics('bounceRate', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Avg. Session Duration</label>
            <input
              type="text"
              placeholder="e.g. 2m 15s"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gov-600 focus:border-transparent outline-none text-sm bg-white text-gray-900"
              value={data.analytics.avgSessionDuration}
              onChange={(e) => updateAnalytics('avgSessionDuration', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Challenges & Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Key Challenges / Blockers</label>
           <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gov-600 focus:border-transparent outline-none h-24 text-sm bg-white text-gray-900"
            placeholder="Any technical or bureaucratic hurdles?"
            value={data.challenges}
            onChange={(e) => onChange({ ...data, challenges: e.target.value })}
          />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Plan for Next Week</label>
           <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gov-600 focus:border-transparent outline-none h-24 text-sm bg-white text-gray-900"
            placeholder="Priorities based on project timelines..."
            value={data.nextSteps}
            onChange={(e) => onChange({ ...data, nextSteps: e.target.value })}
          />
        </div>
      </div>

    </div>
  );
};