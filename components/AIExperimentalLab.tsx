import React, { useState } from 'react';
import { FlaskConical, X, Play, BrainCircuit, CheckCircle2, TrendingUp, ShieldAlert, Award } from 'lucide-react';
import { LabSimulationResult } from '../types';

interface AIExperimentalLabProps {
  onClose: () => void;
  startBalance: number;
}

const AIExperimentalLab: React.FC<AIExperimentalLabProps> = ({ onClose, startBalance }) => {
  const [simBalance, setSimBalance] = useState(startBalance);
  const [tradeCount, setTradeCount] = useState(100);
  const [targetWinRate, setTargetWinRate] = useState(55);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<LabSimulationResult[]>([]);

  const runGenerativeSimulation = () => {
    setIsSimulating(true);
    setResults([]);

    // Simulate slight delay for "Processing" feel
    setTimeout(() => {
        const payout = 0.85; // Fixed assumption for sim
        const simulationsPerStrategy = 500;
        
        const strategies = [
            { name: 'Fixed Amount (1%)', type: 'FIXED', val: 0.01 },
            { name: 'Percentage (3%)', type: 'PERCENT', val: 0.03 },
            { name: 'Masaniello (Safe)', type: 'MASA' }
        ];

        const finalResults: LabSimulationResult[] = strategies.map(strat => {
            let totalEndBalance = 0;
            let bankruptcies = 0;
            let profitCount = 0;

            for (let i = 0; i < simulationsPerStrategy; i++) {
                let currentBal = simBalance;
                // Masaniello State
                let masaTrades = tradeCount;
                let masaWins = Math.floor(tradeCount * (targetWinRate / 100)); // Dynamic target based on rate

                for (let t = 0; t < tradeCount; t++) {
                    if (currentBal <= 0) {
                        bankruptcies++;
                        break;
                    }

                    let stake = 0;
                    if (strat.type === 'FIXED') stake = simBalance * strat.val;
                    else if (strat.type === 'PERCENT') stake = currentBal * strat.val;
                    else if (strat.type === 'MASA') {
                        const remainingTrades = masaTrades - t;
                        if (remainingTrades > 0) {
                             const ratio = masaWins / remainingTrades;
                             stake = currentBal * ratio;
                        } else stake = 0;
                    }

                    // Win/Loss Simulation
                    const isWin = Math.random() * 100 < targetWinRate;
                    
                    if (isWin) {
                        currentBal += stake * payout;
                        if (strat.type === 'MASA') masaWins--;
                    } else {
                        currentBal -= stake;
                    }
                }
                
                if (currentBal > simBalance) profitCount++;
                totalEndBalance += currentBal;
            }

            return {
                strategyName: strat.name,
                finalBalanceAvg: totalEndBalance / simulationsPerStrategy,
                bankruptcyRisk: (bankruptcies / simulationsPerStrategy) * 100,
                winProbability: (profitCount / simulationsPerStrategy) * 100,
                recommended: false
            };
        });

        // Determine best strategy
        // Logic: Best balance with Risk < 5%, else Lowest Risk
        let bestStrat = finalResults.filter(r => r.bankruptcyRisk < 5).sort((a,b) => b.finalBalanceAvg - a.finalBalanceAvg)[0];
        if (!bestStrat) {
             bestStrat = finalResults.sort((a,b) => a.bankruptcyRisk - b.bankruptcyRisk)[0];
        }
        if (bestStrat) bestStrat.recommended = true;

        setResults(finalResults);
        setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
        <div className="bg-slate-900 border border-indigo-500/50 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-indigo-500/20 flex justify-between items-center bg-indigo-950/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <FlaskConical className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-wide">AI Generative Simulation Lab</h2>
                        <p className="text-xs text-indigo-300">Run 1,000+ scenarios to find the mathematically optimal path.</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
                
                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Start Capital</label>
                        <input 
                            type="number" 
                            value={simBalance}
                            onChange={(e) => setSimBalance(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Total Trades</label>
                        <input 
                            type="number" 
                            value={tradeCount}
                            onChange={(e) => setTradeCount(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Est. Win Rate (%)</label>
                        <input 
                            type="number" 
                            value={targetWinRate}
                            onChange={(e) => setTargetWinRate(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Action */}
                {!isSimulating && results.length === 0 && (
                    <div className="text-center py-8">
                        <BrainCircuit className="w-16 h-16 text-indigo-500/20 mx-auto mb-4" />
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">
                            The AI will now construct virtual timelines using different money management algorithms to find the safest and most profitable route for you.
                        </p>
                        <button 
                            onClick={runGenerativeSimulation}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto transition-all hover:scale-105"
                        >
                            <Play className="w-4 h-4 fill-current" /> Run Simulation
                        </button>
                    </div>
                )}

                {/* Loader */}
                {isSimulating && (
                    <div className="text-center py-12">
                        <div className="relative w-20 h-20 mx-auto mb-4">
                             <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                             <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                             <FlaskConical className="absolute inset-0 m-auto text-indigo-400 w-8 h-8 animate-pulse" />
                        </div>
                        <h3 className="text-lg font-bold text-white animate-pulse">Running Monte Carlo Simulations...</h3>
                        <p className="text-slate-500 text-sm">Analyzing 1,500 timelines...</p>
                    </div>
                )}

                {/* Results */}
                {results.length > 0 && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Simulation Findings</h3>
                        
                        <div className="grid gap-4">
                            {results.map((res, idx) => (
                                <div 
                                    key={idx} 
                                    className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden
                                        ${res.recommended ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800/50 border-slate-700'}
                                    `}
                                >
                                    {res.recommended && (
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                                            AI RECOMMENDED
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${res.recommended ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                            {res.recommended ? <Award className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{res.strategyName}</h4>
                                            <p className="text-xs text-slate-400 flex gap-3">
                                                <span className={`${res.winProbability > 50 ? 'text-emerald-400' : 'text-orange-400'}`}>
                                                    Win Chance: {res.winProbability.toFixed(1)}%
                                                </span>
                                                <span>|</span>
                                                <span className={`${res.bankruptcyRisk > 10 ? 'text-rose-400' : 'text-slate-400'}`}>
                                                    Ruin Risk: {res.bankruptcyRisk.toFixed(1)}%
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 uppercase">Avg. End Balance</p>
                                        <p className={`text-2xl font-mono font-bold ${res.finalBalanceAvg > simBalance ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            €{res.finalBalanceAvg.toFixed(0)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setResults([])} className="text-sm text-slate-400 hover:text-white underline">
                                Reset & Run Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default AIExperimentalLab;
