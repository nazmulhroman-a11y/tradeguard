import React from 'react';
import { Settings, RefreshCw, DollarSign, Percent, Target, Calculator, Trophy, ShieldAlert, TrendingDown, StopCircle, Gauge, Bot, Zap } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onReset: () => void;
  isTradeActive: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, onReset, isTradeActive }) => {
  const handleChange = (field: keyof AppSettings, value: number | string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
          <Settings className="w-5 h-5" />
          Configuration
        </h2>
        <div className="flex gap-2">
            <button
            onClick={onReset}
            className="text-xs flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
            >
            <RefreshCw className="w-3 h-3" /> Reset
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Initial Balance */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Balance (€/$)</label>
          <div className="relative group">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="number"
              value={settings.initialBalance}
              disabled={isTradeActive}
              onChange={(e) => handleChange('initialBalance', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Payout Percentage */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Broker Payout (%)</label>
          <div className="relative group">
            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="number"
              value={settings.payoutPercentage}
              onChange={(e) => handleChange('payoutPercentage', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Strategy Selection */}
        <div className="space-y-2 lg:col-span-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Invest Strategy</label>
          <div className="relative">
            <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={settings.strategy}
              onChange={(e) => setSettings(prev => ({ ...prev, strategy: e.target.value as any }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
            >
              <option value="PERCENTAGE">Percentage (%) - Compounding</option>
              <option value="FIXED">Fixed Amount - Steady</option>
              <option value="MASANIELLO">Masaniello - Target Based (Recommended)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Inputs based on Strategy */}
      <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
        
        {settings.strategy === 'MASANIELLO' ? (
          <>
            <div className="space-y-2">
               <label className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Total Trades Plan</label>
               <div className="relative group">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={settings.totalEvents}
                    onChange={(e) => handleChange('totalEvents', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Target Wins</label>
               <div className="relative group">
                  <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    value={settings.targetWins}
                    onChange={(e) => handleChange('targetWins', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
               </div>
            </div>
          </>
        ) : (
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {settings.strategy === 'PERCENTAGE' ? 'Risk Per Trade (%)' : 'Amount Per Trade'}
            </label>
            <div className="relative group">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="number"
                value={settings.strategy === 'PERCENTAGE' ? settings.riskPercentage : settings.fixedAmount}
                onChange={(e) => handleChange(settings.strategy === 'PERCENTAGE' ? 'riskPercentage' : 'fixedAmount', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* --- Risk Management Section --- */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" /> Risk & Automation
             </h3>
             {/* Auto Pilot Toggle */}
             <div className="flex items-center gap-3 bg-slate-800/50 p-1.5 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-400 font-medium pl-2 flex items-center gap-1">
                    <Bot className="w-3 h-3" /> Auto-Pilot
                </span>
                <button 
                    onClick={() => handleChange('enableAutoPilot', !settings.enableAutoPilot)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${settings.enableAutoPilot ? 'bg-indigo-500' : 'bg-slate-600'}`}
                >
                    <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${settings.enableAutoPilot ? 'translate-x-4.5' : 'translate-x-1'}`}
                        style={{ transform: settings.enableAutoPilot ? 'translateX(18px)' : 'translateX(2px)' }}
                    />
                </button>
             </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Risk Tolerance */}
          <div className="space-y-2">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Tolerance</label>
             <div className="relative">
                <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={settings.riskTolerance}
                  onChange={(e) => setSettings(prev => ({ ...prev, riskTolerance: e.target.value as any }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
                >
                  <option value="LOW">Low (Defensive 0.8x)</option>
                  <option value="MEDIUM">Medium (Standard 1.0x)</option>
                  <option value="HIGH">High (Aggressive 1.2x)</option>
                </select>
             </div>
          </div>

          {/* Safety Brake (Max Losses) */}
          <div className="space-y-2">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Max Losses (Stop)</label>
             <div className="relative group">
                <StopCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                <input
                  type="number"
                  placeholder="0 = Disabled"
                  value={settings.maxLossesAllowed}
                  onChange={(e) => handleChange('maxLossesAllowed', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
             </div>
          </div>

          {/* Drawdown Warning */}
          <div className="space-y-2">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Drawdown Limit (%)</label>
             <div className="relative group">
                <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={settings.maxDrawdownWarning}
                  onChange={(e) => handleChange('maxDrawdownWarning', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
             </div>
          </div>

          {/* Session TP/SL */}
          <div className="space-y-2">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Session Take Profit</label>
             <div className="relative group">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="number"
                  placeholder="0 = No Limit"
                  value={settings.sessionTakeProfit}
                  onChange={(e) => handleChange('sessionTakeProfit', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
