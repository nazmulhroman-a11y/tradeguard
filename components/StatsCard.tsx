import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';

interface StatsCardProps {
  currentBalance: number;
  initialBalance: number;
  wins: number;
  losses: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ currentBalance, initialBalance, wins, losses }) => {
  const profit = currentBalance - initialBalance;
  const isProfit = profit >= 0;
  const totalTrades = wins + losses;
  const winRate = totalTrades === 0 ? 0 : Math.round((wins / totalTrades) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-sm text-slate-400">Current Balance</span>
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">€{currentBalance.toFixed(2)}</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg ${isProfit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
          <span className="text-sm text-slate-400">Net Profit</span>
        </div>
        <p className={`text-2xl font-bold tracking-tight ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isProfit ? '+' : ''}€{profit.toFixed(2)}
        </p>
      </div>

       <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <PieChart className="w-5 h-5" />
          </div>
          <span className="text-sm text-slate-400">Win Rate</span>
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">{winRate}%</p>
        <div className="w-full bg-slate-700 h-1.5 mt-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${winRate}%` }}></div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg flex flex-col justify-center">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-emerald-400 font-medium">Wins</span>
            <span className="text-lg font-bold text-emerald-400">{wins}</span>
        </div>
         <div className="flex justify-between items-center">
            <span className="text-sm text-rose-400 font-medium">Losses</span>
            <span className="text-lg font-bold text-rose-400">{losses}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
