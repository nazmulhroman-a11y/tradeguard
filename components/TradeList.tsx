import React, { useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, History } from 'lucide-react';
import { Trade } from '../types';

interface TradeListProps {
  trades: Trade[];
  nextTradeInvestment: number;
  onTradeResult: (result: 'WIN' | 'LOSS') => void;
  expectedProfit: number;
}

const TradeList: React.FC<TradeListProps> = ({ trades, nextTradeInvestment, onTradeResult, expectedProfit }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new trade is added
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [trades]);

  return (
    <div className="flex flex-col h-full">
      {/* Active Trade Action Card */}
      <div className="mb-8 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 animate-pulse"></div>
        <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            
            <div className="text-center md:text-left space-y-1">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Next Trade #{trades.length + 1}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">€{nextTradeInvestment.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                    If WIN: <span className="text-emerald-400">+€{expectedProfit.toFixed(2)}</span>
                </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
                <button
                    onClick={() => onTradeResult('WIN')}
                    className="flex-1 md:flex-none group flex flex-col items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500 border-2 border-emerald-500/50 hover:border-emerald-500 text-emerald-400 hover:text-white py-4 px-8 rounded-xl transition-all duration-200 active:scale-95"
                >
                    <CheckCircle2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-lg">WIN</span>
                </button>
                <button
                    onClick={() => onTradeResult('LOSS')}
                    className="flex-1 md:flex-none group flex flex-col items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 border-2 border-rose-500/50 hover:border-rose-500 text-rose-400 hover:text-white py-4 px-8 rounded-xl transition-all duration-200 active:scale-95"
                >
                    <XCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-lg">LOSS</span>
                </button>
            </div>
        </div>
      </div>

      {/* History Table */}
      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-slate-200">Trade History</h3>
        </div>
        
        <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
            <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                <th className="px-6 py-3 font-semibold">#</th>
                <th className="px-6 py-3 font-semibold">Invest</th>
                <th className="px-6 py-3 font-semibold">Result</th>
                <th className="px-6 py-3 font-semibold">P/L</th>
                <th className="px-6 py-3 font-semibold text-right">Balance</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {trades.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            No trades executed yet. Start your session above.
                        </td>
                    </tr>
                ) : (
                    trades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-slate-500">#{trade.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-200">€{trade.investment.toFixed(2)}</td>
                        <td className="px-6 py-4">
                        {trade.result === 'WIN' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> WIN
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle className="w-3 h-3" /> LOSS
                            </span>
                        )}
                        </td>
                        <td className={`px-6 py-4 font-bold ${trade.profitOrLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.profitOrLoss >= 0 ? '+' : ''}€{trade.profitOrLoss.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-300">
                        €{trade.balanceAfter.toFixed(2)}
                        </td>
                    </tr>
                    ))
                )}
                <div ref={bottomRef} />
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default TradeList;
