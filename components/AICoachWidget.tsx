import React, { useState } from 'react';
import { Bot, Zap, Activity, ArrowRight, TrendingUp, AlertTriangle, X } from 'lucide-react';
import { MarketSentiment, SimulationResult } from '../types';

interface AICoachWidgetProps {
  sentiment: MarketSentiment;
  onRunSimulation: () => SimulationResult;
  currentBalance: number;
}

const AICoachWidget: React.FC<AICoachWidgetProps> = ({ sentiment, onRunSimulation, currentBalance }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    // Fake delay for realistic AI feel
    setTimeout(() => {
      const result = onRunSimulation();
      setSimulationResult(result);
      setIsSimulating(false);
    }, 1500);
  };

  const closeSimulation = () => {
    setSimulationResult(null);
    setIsOpen(false);
  };

  const getSentimentColor = () => {
    switch (sentiment) {
      case 'HIGH_VOLATILITY': return 'text-rose-400';
      case 'BULLISH': return 'text-emerald-400';
      case 'BEARISH': return 'text-orange-400';
      default: return 'text-blue-400';
    }
  };

  const getSentimentText = () => {
    switch (sentiment) {
      case 'HIGH_VOLATILITY': return 'High Risk / Volatile';
      case 'BULLISH': return 'Bullish Momentum';
      case 'BEARISH': return 'Bearish Pressure';
      default: return 'Stable / Neutral';
    }
  };

  return (
    <>
      {/* Floating Widget Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {/* Sentiment Pill */}
        <div className="bg-slate-900/90 border border-slate-700 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5">
            <Activity className={`w-4 h-4 ${getSentimentColor()}`} />
            <span className="text-xs font-bold text-slate-300">Market: <span className={getSentimentColor()}>{getSentimentText()}</span></span>
        </div>

        {/* Coach Trigger */}
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border-2 border-indigo-400/30"
        >
          <Bot className="w-6 h-6" />
          <span className="font-bold pr-1">Ask AI Mentor</span>
        </button>
      </div>

      {/* Simulation Modal / Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
            
            <button 
              onClick={closeSimulation}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                    <Bot className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Predictive Simulation</h3>
                    <p className="text-slate-400 text-xs">Based on your win rate & market entropy</p>
                </div>
              </div>

              {!simulationResult ? (
                <div className="space-y-6">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    I will simulate <strong>1,000 scenarios</strong> for your next 5 trades to determine if you should continue or stop now.
                  </p>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Current Balance</span>
                        <span className="font-mono text-white">€{currentBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Market Condition</span>
                        <span className={`font-bold ${getSentimentColor()}`}>{getSentimentText()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    {isSimulating ? (
                        <>
                            <Zap className="w-4 h-4 animate-spin" /> Simulating...
                        </>
                    ) : (
                        <>
                            <Zap className="w-4 h-4" /> Run Simulation
                        </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                   {/* Result Header */}
                   <div className={`text-center p-4 rounded-xl border ${simulationResult.recommendation === 'CONTINUE' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                      <h4 className={`text-lg font-black uppercase tracking-wider mb-1 ${simulationResult.recommendation === 'CONTINUE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        AI Verdict: {simulationResult.recommendation}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {simulationResult.recommendation === 'CONTINUE' 
                            ? "Odds are in your favor." 
                            : "Risk of loss outweighs potential gain."}
                      </p>
                   </div>

                   {/* Comparison Stats */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-800 rounded-lg text-center opacity-60">
                          <p className="text-xs text-slate-400 mb-1">If you stop now</p>
                          <p className="font-mono font-bold text-white">€{currentBalance.toFixed(2)}</p>
                      </div>
                      <div className="p-4 bg-slate-800 rounded-lg text-center border border-indigo-500/30 relative overflow-hidden">
                          <div className="absolute inset-0 bg-indigo-500/5"></div>
                          <p className="text-xs text-indigo-300 mb-1">Projected (5 trades)</p>
                          <p className="font-mono font-bold text-white">€{simulationResult.projectedBalance.toFixed(2)}</p>
                      </div>
                   </div>

                   {/* Probability Bar */}
                   <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-400">Probability of Profit</span>
                            <span className="text-white font-bold">{simulationResult.next5TradesProb}%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ${simulationResult.next5TradesProb > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                style={{ width: `${simulationResult.next5TradesProb}%` }}
                            ></div>
                        </div>
                   </div>

                   <button
                    onClick={closeSimulation}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold transition-all"
                  >
                    Close Mentor
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AICoachWidget;
