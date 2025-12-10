import React from 'react';
import { BrainCircuit, Sparkles, AlertOctagon, TrendingUp, Lightbulb, UserCheck, Users, LineChart } from 'lucide-react';
import { AIInsight } from '../types';

interface AIInsightPanelProps {
  insights: AIInsight[];
}

const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insights }) => {
  if (insights.length === 0) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit className="w-24 h-24 text-indigo-500" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-slate-200">AI Neural Engine</h3>
        </div>
        <p className="text-sm text-slate-500 italic">
          Listening to market noise and analyzing behavior...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 rounded-xl p-0 shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="bg-indigo-950/30 p-4 border-b border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </div>
          <h3 className="font-bold text-indigo-100 text-sm tracking-wide">AI PREDICTIVE ANALYTICS</h3>
        </div>
        <span className="text-[10px] font-mono text-indigo-400/70 border border-indigo-400/30 px-2 py-0.5 rounded">V2.1 MENTOR</span>
      </div>

      {/* Insights List */}
      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`
              relative p-3 rounded-lg border flex gap-3 animate-in slide-in-from-right-2 duration-500
              ${insight.severity === 'critical' ? 'bg-rose-950/20 border-rose-500/30' : 
                insight.severity === 'warning' ? 'bg-amber-950/20 border-amber-500/30' : 
                insight.severity === 'success' ? 'bg-emerald-950/20 border-emerald-500/30' :
                'bg-slate-800/50 border-slate-700'}
            `}
          >
            {/* Icon based on type */}
            <div className={`
              mt-0.5 p-1.5 rounded-md h-fit
              ${insight.type === 'PROFIT' ? 'bg-emerald-500/20 text-emerald-400' : 
                insight.type === 'ANOMALY' ? 'bg-rose-500/20 text-rose-400' : 
                insight.type === 'BEHAVIOR' ? 'bg-orange-500/20 text-orange-400' : 
                insight.type === 'SOCIAL' ? 'bg-blue-500/20 text-blue-400' :
                insight.type === 'PREDICTION' ? 'bg-purple-500/20 text-purple-400' :
                'bg-indigo-500/20 text-indigo-400'}
            `}>
              {insight.type === 'PROFIT' && <TrendingUp className="w-4 h-4" />}
              {insight.type === 'ANOMALY' && <AlertOctagon className="w-4 h-4" />}
              {insight.type === 'STRATEGY' && <Lightbulb className="w-4 h-4" />}
              {insight.type === 'BEHAVIOR' && <UserCheck className="w-4 h-4" />}
              {insight.type === 'SOCIAL' && <Users className="w-4 h-4" />}
              {insight.type === 'PREDICTION' && <LineChart className="w-4 h-4" />}
              {insight.type === 'AUTOMATION' && <BrainCircuit className="w-4 h-4" />}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-xs font-bold uppercase tracking-wider
                  ${insight.severity === 'critical' ? 'text-rose-400' : 
                    insight.severity === 'warning' ? 'text-amber-400' : 
                    insight.severity === 'success' ? 'text-emerald-400' :
                    'text-indigo-300'}
                `}>
                  {insight.title}
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-snug">
                {insight.message}
              </p>
              
              {/* Action Button for Behavioral Correction */}
              {insight.onAction && insight.actionLabel && (
                  <button 
                    onClick={insight.onAction}
                    className="mt-3 text-xs bg-slate-700 hover:bg-indigo-600 text-white px-3 py-1.5 rounded transition-colors w-full border border-slate-600 hover:border-indigo-500 shadow-sm"
                  >
                    {insight.actionLabel}
                  </button>
              )}

              {/* Suggestion Visual */}
              {insight.type === 'STRATEGY' && !insight.onAction && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-indigo-400 font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>Recommendation Engine</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Decoration */}
      <div className="bg-slate-950 p-2 text-center border-t border-slate-800">
        <p className="text-[10px] text-slate-600 font-mono">AI Model Confidence: 96.5%</p>
      </div>
    </div>
  );
};

export default AIInsightPanel;
