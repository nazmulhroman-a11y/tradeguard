import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Target, ShieldAlert, Lock, AlertTriangle, TrendingDown, FlaskConical } from 'lucide-react';
import SettingsPanel from './components/SettingsPanel';
import StatsCard from './components/StatsCard';
import TradeList from './components/TradeList';
import AIInsightPanel from './components/AIInsightPanel';
import AICoachWidget from './components/AICoachWidget';
import AIExperimentalLab from './components/AIExperimentalLab';
import { Trade, AppSettings, AIInsight, MarketSentiment, SimulationResult } from './types';

function App() {
  // --- State ---
  const [settings, setSettings] = useState<AppSettings>({
    initialBalance: 100,
    payoutPercentage: 85,
    riskPercentage: 5,
    strategy: 'MASANIELLO',
    enableAutoPilot: false,
    fixedAmount: 1,
    totalEvents: 20,
    targetWins: 12,
    // Risk Management Defaults
    riskTolerance: 'MEDIUM',
    maxLossesAllowed: 0,
    maxDrawdownWarning: 0,
    sessionTakeProfit: 0,
    sessionStopLoss: 0,
  });

  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentBalance, setCurrentBalance] = useState(100);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment>('NEUTRAL');
  const [isLabOpen, setIsLabOpen] = useState(false);
  
  // Update current balance when settings change (only if no trades yet)
  useEffect(() => {
    if (trades.length === 0) {
      setCurrentBalance(settings.initialBalance);
    }
  }, [settings.initialBalance, trades.length]);

  // --- Logic & Calculations ---

  // 1. Peak Balance & Drawdown Calculation
  const peakBalance = useMemo(() => {
    const balances = [settings.initialBalance, ...trades.map(t => t.balanceAfter)];
    return Math.max(...balances);
  }, [settings.initialBalance, trades]);

  const currentDrawdown = peakBalance > 0 
    ? ((peakBalance - currentBalance) / peakBalance) * 100 
    : 0;

  const totalProfit = currentBalance - settings.initialBalance;
  const totalLosses = trades.filter(t => t.result === 'LOSS').length;
  const totalWins = trades.filter(t => t.result === 'WIN').length;

  // --- MOCK MARKET SENTIMENT ENGINE ---
  useEffect(() => {
    const interval = setInterval(() => {
        const sentiments: MarketSentiment[] = ['BULLISH', 'BEARISH', 'HIGH_VOLATILITY', 'NEUTRAL'];
        const rand = Math.random();
        let newSentiment: MarketSentiment = 'NEUTRAL';
        
        if (rand < 0.2) newSentiment = 'HIGH_VOLATILITY';
        else if (rand < 0.4) newSentiment = 'BULLISH';
        else if (rand < 0.6) newSentiment = 'BEARISH';
        
        setMarketSentiment(newSentiment);
    }, 45000);

    return () => clearInterval(interval);
  }, []);
  
  // --- AI ENGINE LOGIC ---
  useEffect(() => {
    // Run AI analysis when trades or market sentiment changes
    const generateInsights = () => {
      if (trades.length < 3) return;

      const newInsights: AIInsight[] = [];
      const winRate = (totalWins / trades.length) * 100;
      const profitPercentage = ((currentBalance - settings.initialBalance) / settings.initialBalance) * 100;
      
      const last5Trades = trades.slice(-5);
      const consecutiveWins = last5Trades.reverse().findIndex(t => t.result === 'LOSS'); 
      const currentWinStreak = consecutiveWins === -1 ? last5Trades.length : consecutiveWins;
      
      const last5TradesOriginal = trades.slice(-5);
      const consecutiveLosses = last5TradesOriginal.reverse().findIndex(t => t.result === 'WIN');
      const currentLossStreak = consecutiveLosses === -1 ? last5TradesOriginal.length : consecutiveLosses;
      
      // Calculate Recent Win Rate (Last 5)
      const recentWins = last5TradesOriginal.filter(t => t.result === 'WIN').length;
      const recentWinRate = (recentWins / last5TradesOriginal.length) * 100;

      // --- NEW FEATURE: COLLABORATIVE AI LEARNING (MOCK) ---
      // Logic: Compare user stats with fake "database"
      if (trades.length >= 5) {
          if (winRate < 45 && settings.strategy === 'PERCENTAGE') {
              newInsights.push({
                  id: 'collab-masa-suggest',
                  type: 'SOCIAL',
                  title: 'Community Insight 👥',
                  message: 'Data from 5,000 users with similar ~40% win rates shows that the Masaniello strategy yielded 15% more profit than your current Percentage strategy.',
                  severity: 'info',
                  timestamp: Date.now(),
                  actionLabel: 'Try Masaniello',
                  onAction: () => {
                       setSettings(prev => ({ ...prev, strategy: 'MASANIELLO' }));
                       alert("Strategy Switched to Masaniello based on Community Data.");
                  }
              });
          }
      }

      // --- NEW FEATURE: TIME-SERIES PREDICTION ---
      // Logic: Simple momentum/reversion check
      if (trades.length >= 8 && settings.strategy === 'MASANIELLO') {
           const last3 = trades.slice(-3).map(t => t.result);
           const allWins = last3.every(r => r === 'WIN');
           
           if (allWins && winRate > 60) {
               // Predicted Momentum
               newInsights.push({
                   id: 'time-series-bull',
                   type: 'PREDICTION',
                   title: 'Trend Forecast 📈',
                   message: 'Time-series analysis predicts a continuation of the bullish trend for the next 3 trades. AI suggests temporarily increasing your Masaniello target to capture this.',
                   severity: 'success',
                   timestamp: Date.now(),
                   actionLabel: 'Boost Target (+1)',
                   onAction: () => {
                       setSettings(prev => ({ ...prev, targetWins: Math.min(prev.totalEvents, prev.targetWins + 1) }));
                   }
               });
           }
      }


      // --- 1. PRESCRIPTIVE: AUTO-STRATEGY ADAPTATION ---
      if (settings.enableAutoPilot) {
        // Condition: Aggressive Switch (High Win Rate -> Percentage)
        if (recentWinRate >= 80 && settings.strategy === 'FIXED') {
           newInsights.push({
             id: 'auto-switch-compound',
             type: 'AUTOMATION',
             title: 'Hot Streak Detected! 🔥',
             message: 'You won 4 out of 5 trades. AI recommends switching to "Percentage" mode to compound these gains.',
             severity: 'success',
             timestamp: Date.now(),
             actionLabel: 'Switch to Percentage (Compound)',
             onAction: () => {
                setSettings(prev => ({ ...prev, strategy: 'PERCENTAGE' }));
                alert("Strategy switched to Percentage Mode!");
             }
           });
        }
        
        // Condition: Defensive Switch (Low Win Rate -> Fixed)
        if (recentWinRate <= 20 && settings.strategy === 'PERCENTAGE') {
           newInsights.push({
             id: 'auto-switch-defensive',
             type: 'AUTOMATION',
             title: 'Preserve Capital 🛡️',
             message: 'Recent performance is low. AI strongly suggests switching to "Fixed Amount" to prevent rapid drawdown.',
             severity: 'warning',
             timestamp: Date.now(),
             actionLabel: 'Switch to Fixed (Safe)',
             onAction: () => {
                setSettings(prev => ({ ...prev, strategy: 'FIXED', fixedAmount: prev.initialBalance * 0.01 })); // Default 1% fixed
                alert("Strategy switched to Fixed Amount Mode!");
             }
           });
        }
      }

      // --- 2. PRESCRIPTIVE: DYNAMIC MASANIELLO TARGETING ---
      if (settings.strategy === 'MASANIELLO' && trades.length >= 5 && settings.enableAutoPilot) {
         const expectedWinRate = settings.targetWins / settings.totalEvents;
         const currentRealWinRate = totalWins / trades.length;
         
         // If performance is significantly better than needed (+15%)
         if (currentRealWinRate > expectedWinRate + 0.15) {
             const newTarget = Math.min(settings.totalEvents, settings.targetWins + 2);
             if (newTarget > settings.targetWins) {
                 newInsights.push({
                   id: 'masa-dynamic-upgrade',
                   type: 'AUTOMATION',
                   title: 'Performance Exceeding Target 🚀',
                   message: `You are winning faster than expected! Probability of hitting ${newTarget} wins is now 85%. Update target?`,
                   severity: 'success',
                   timestamp: Date.now(),
                   actionLabel: `Upgrade Target to ${newTarget}`,
                   onAction: () => {
                      setSettings(prev => ({ ...prev, targetWins: newTarget }));
                      alert(`Masaniello Target Updated to ${newTarget} Wins!`);
                   }
                 });
             }
         }
      }

      // --- 3. PATTERN RECOGNITION (FRAUD/ANOMALY) ---
      // Check for alternating patterns (W-L-W-L-W-L) length 6
      if (trades.length >= 6) {
         const last6 = trades.slice(-6).map(t => t.result); // ['WIN', 'LOSS', ...]
         const isAlternating = last6.every((val, i, arr) => i === 0 || val !== arr[i - 1]);
         
         if (isAlternating) {
            newInsights.push({
                id: 'pattern-alternating',
                type: 'ANOMALY',
                title: 'Unnatural Pattern Detected 🕵️',
                message: 'W/L/W/L/W/L pattern detected. This often indicates market manipulation or a bot algorithm. AI suggests pausing.',
                severity: 'critical',
                timestamp: Date.now()
            });
         }
      }


      // --- EXISTING LOGIC ---
      // Behavioral Correction (Martingale)
      const lastTrade = trades[trades.length - 1];
      const prevTrade = trades[trades.length - 2];
      if (lastTrade && prevTrade) {
          if (prevTrade.result === 'LOSS' && lastTrade.investment > prevTrade.investment * 1.5 && lastTrade.result === 'LOSS') {
              newInsights.push({
                  id: 'beh-martingale-1',
                  type: 'BEHAVIOR',
                  title: 'Dangerous Behavior',
                  message: `Martingale detected. -€${lastTrade.investment.toFixed(2)} loss. I can set a Safety Brake.`,
                  severity: 'critical',
                  timestamp: Date.now(),
                  actionLabel: 'Auto-Set Safety Brake',
                  onAction: () => {
                      setSettings(prev => ({ ...prev, maxLossesAllowed: totalLosses + 3 }));
                      alert("Safety Brake Activated!");
                  }
              });
          }
      }

      // Lock-in Profit Alerts
      if (profitPercentage >= 15 && totalProfit > 0) {
        newInsights.push({
          id: 'alert-profit-1',
          type: 'PROFIT',
          title: 'Smart Take Profit',
          message: `+${profitPercentage.toFixed(1)}% ROI secured. Lock in profit now?`,
          severity: 'warning',
          timestamp: Date.now()
        });
      }

      // Limit to 3 most recent insights
      setAiInsights(prev => {
         const combined = [...newInsights, ...prev];
         const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
         return unique.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);
      });
    };

    generateInsights();
  }, [trades, totalWins, currentBalance, settings, marketSentiment]);


  // --- PREDICTIVE SIMULATION FUNCTION ---
  const runSimulation = (): SimulationResult => {
      // Monte Carlo Simulation
      const SIMULATION_COUNT = 1000;
      const FUTURE_TRADES = 5;
      let profitableScenarios = 0;
      let totalprojectedBalance = 0;

      let baseWinProb = trades.length > 0 ? totalWins / trades.length : 0.5;
      
      if (marketSentiment === 'HIGH_VOLATILITY') baseWinProb -= 0.1;
      if (marketSentiment === 'BULLISH') baseWinProb += 0.05;
      if (marketSentiment === 'BEARISH') baseWinProb -= 0.05;

      baseWinProb = Math.max(0.1, Math.min(0.9, baseWinProb));

      for (let i = 0; i < SIMULATION_COUNT; i++) {
          let simBalance = currentBalance;
          for (let j = 0; j < FUTURE_TRADES; j++) {
              const simInvestment = (simBalance * settings.riskPercentage) / 100;
              const win = Math.random() < baseWinProb;
              
              if (win) {
                  simBalance += simInvestment * (settings.payoutPercentage / 100);
              } else {
                  simBalance -= simInvestment;
              }
          }
          if (simBalance > currentBalance) profitableScenarios++;
          totalprojectedBalance += simBalance;
      }

      const prob = Math.round((profitableScenarios / SIMULATION_COUNT) * 100);
      const avgProjected = totalprojectedBalance / SIMULATION_COUNT;

      return {
          next5TradesProb: prob,
          projectedBalance: avgProjected,
          recommendation: prob > 55 ? 'CONTINUE' : 'STOP'
      };
  };


  // 2. Safety Checks (Locks)
  const safetyChecks = {
    drawdownLimit: settings.maxDrawdownWarning > 0 && currentDrawdown >= settings.maxDrawdownWarning,
    maxLosses: settings.maxLossesAllowed > 0 && totalLosses >= settings.maxLossesAllowed,
    takeProfit: settings.sessionTakeProfit > 0 && totalProfit >= settings.sessionTakeProfit,
    stopLoss: settings.sessionStopLoss > 0 && totalProfit <= -settings.sessionStopLoss,
  };

  const isSafetyLocked = Object.values(safetyChecks).some(Boolean);

  // 3. Investment Calculation
  const getNextInvestment = () => {
    // If Safety Lock is active or Masaniello ended, return 0
    if (isSafetyLocked) return 0;

    let amount = 0;
    
    if (settings.strategy === 'FIXED') {
      amount = settings.fixedAmount;
    } 
    else if (settings.strategy === 'PERCENTAGE') {
      amount = (currentBalance * settings.riskPercentage) / 100;
    } 
    else if (settings.strategy === 'MASANIELLO') {
      const remainingTrades = settings.totalEvents - trades.length;
      const remainingWinsNeeded = settings.targetWins - totalWins;

      if (remainingTrades <= 0 || remainingWinsNeeded <= 0) return 0;

      const ratio = remainingWinsNeeded / remainingTrades;
      amount = currentBalance * ratio;
      if (amount < 0) amount = 0;
    }

    // Apply Risk Tolerance Multiplier
    const multipliers = { LOW: 0.8, MEDIUM: 1.0, HIGH: 1.2 };
    amount = amount * multipliers[settings.riskTolerance];

    return Math.max(0, Math.min(amount, currentBalance));
  };

  const nextInvestment = getNextInvestment();
  const payoutMultiplier = settings.payoutPercentage / 100;
  const expectedProfit = nextInvestment * payoutMultiplier;

  // Handle a trade result
  const handleTradeResult = (result: 'WIN' | 'LOSS') => {
    if (nextInvestment <= 0) return; 

    const investment = nextInvestment;
    let profitOrLoss = 0;
    let newBalance = currentBalance;

    if (result === 'WIN') {
      profitOrLoss = investment * payoutMultiplier;
      newBalance += profitOrLoss;
    } else {
      profitOrLoss = -investment;
      newBalance -= investment;
    }

    const newTrade: Trade = {
      id: trades.length + 1,
      investment: investment,
      result: result,
      payout: 1 + payoutMultiplier,
      profitOrLoss: profitOrLoss,
      balanceAfter: newBalance,
      timestamp: Date.now(),
    };

    setTrades([...trades, newTrade]);
    setCurrentBalance(newBalance);
  };

  const resetData = () => {
    if (window.confirm("Are you sure you want to reset all trade history?")) {
      setTrades([]);
      setCurrentBalance(settings.initialBalance);
      setAiInsights([]);
    }
  };

  // Stats for the chart
  const chartData = [
    { name: 'Start', balance: settings.initialBalance },
    ...trades.map(t => ({ name: `T${t.id}`, balance: t.balanceAfter }))
  ];

  // Masaniello Specific Stats
  const remainingTrades = settings.totalEvents - trades.length;
  const remainingWins = settings.targetWins - totalWins;
  const isMasanielloComplete = settings.strategy === 'MASANIELLO' && (remainingTrades <= 0 || remainingWins <= 0);
  const masanielloSuccess = remainingWins <= 0;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 font-sans pb-20 relative">
      {/* Generative AI Lab Modal */}
      {isLabOpen && (
          <AIExperimentalLab 
             onClose={() => setIsLabOpen(false)} 
             startBalance={settings.initialBalance}
          />
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
             <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
              TradeGuard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Smart Money & Risk Management System</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsLabOpen(true)}
                className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 px-4 py-2 rounded-full border border-indigo-500/30 transition-all font-bold text-xs uppercase tracking-wide hover:scale-105 active:scale-95"
             >
                <FlaskConical className="w-4 h-4" /> AI Lab <span className="hidden sm:inline">(Experimental)</span>
             </button>

             <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
                <div className={`w-2 h-2 rounded-full ${isSafetyLocked ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                <span className="text-xs font-semibold text-slate-300">
                    {isSafetyLocked ? 'SYSTEM LOCKED' : 'SYSTEM ACTIVE'}
                </span>
             </div>
          </div>
        </header>

        {/* Top Controls */}
        <SettingsPanel 
          settings={settings} 
          setSettings={setSettings} 
          onReset={resetData}
          isTradeActive={trades.length > 0} 
        />

        {/* Safety Lock Banners */}
        {isSafetyLocked && (
            <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 flex items-start gap-4 animate-in slide-in-from-top-2">
                <div className="p-2 bg-rose-500/20 rounded-full text-rose-500">
                    <Lock className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-rose-400 text-lg">Trading Safety Lock Activated</h3>
                    <p className="text-slate-300 text-sm mt-1">The system has halted trading because a safety limit was reached:</p>
                    <ul className="list-disc list-inside text-slate-400 text-sm mt-2 space-y-1">
                        {safetyChecks.drawdownLimit && <li>Max Drawdown Limit Reached ({currentDrawdown.toFixed(2)}%)</li>}
                        {safetyChecks.maxLosses && <li>Max Losses Limit Reached ({totalLosses} Losses)</li>}
                        {safetyChecks.takeProfit && <li className="text-emerald-400">Target Session Profit Achieved! (+€{totalProfit.toFixed(2)})</li>}
                        {safetyChecks.stopLoss && <li>Stop Loss Limit Reached (Current: €{totalProfit.toFixed(2)})</li>}
                    </ul>
                    <button onClick={resetData} className="mt-4 text-xs bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-bold transition-colors">
                        Reset Session to Continue
                    </button>
                </div>
            </div>
        )}

        {/* Stats Overview */}
        <StatsCard 
          currentBalance={currentBalance}
          initialBalance={settings.initialBalance}
          wins={totalWins}
          losses={totalLosses}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Action Area (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Masaniello Status Banner */}
            {settings.strategy === 'MASANIELLO' && isMasanielloComplete && !isSafetyLocked && (
               <div className={`p-4 rounded-xl border ${masanielloSuccess ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-rose-500/20 border-rose-500/50'}`}>
                  <h3 className={`font-bold text-lg flex items-center gap-2 ${masanielloSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {masanielloSuccess ? '🎉 Target Achieved!' : '⚠️ Session Ended'}
                  </h3>
                  <p className="text-slate-300 text-sm mt-1">
                    {masanielloSuccess 
                      ? `Congratulations! You hit ${settings.targetWins} wins.` 
                      : `You ran out of events. Reset to start a new session.`}
                  </p>
               </div>
            )}

            <TradeList 
              trades={trades}
              nextTradeInvestment={nextInvestment}
              onTradeResult={handleTradeResult}
              expectedProfit={expectedProfit}
            />
          </div>

          {/* Sidebar / Chart (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* AI Insight Panel */}
            <AIInsightPanel insights={aiInsights} />
            
            {/* Strategy & Risk Info Card */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 relative overflow-hidden">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Live Risk Monitor
                </h4>

                <div className="space-y-4">
                    {/* Drawdown Indicator */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-1"><TrendingDown className="w-3 h-3"/> Drawdown</span>
                            <span className={`font-mono font-bold ${currentDrawdown > (settings.maxDrawdownWarning || 100) ? 'text-rose-500' : 'text-slate-200'}`}>
                                {currentDrawdown.toFixed(2)}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${currentDrawdown > 5 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${Math.min(currentDrawdown * 5, 100)}%` }} // Visual scaling
                            ></div>
                        </div>
                    </div>

                    {/* Risk Tolerance Badge */}
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Risk Mode</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${
                            settings.riskTolerance === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                            settings.riskTolerance === 'MEDIUM' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}>
                            {settings.riskTolerance}
                        </span>
                    </div>

                    {/* Masaniello Stats (Only if active) */}
                    {settings.strategy === 'MASANIELLO' && (
                      <div className="pt-4 border-t border-slate-700/50 mt-4">
                        <h5 className="text-xs font-bold text-indigo-400 mb-2 uppercase">Masaniello Progress</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Wins Needed</span>
                            <span className={`font-mono font-bold ${remainingWins <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {Math.max(0, remainingWins)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Trades Left</span>
                            <span className="text-white font-bold">{Math.max(0, remainingTrades)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
            </div>

            {/* Chart Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
               <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-slate-200">Balance Growth</h3>
               </div>
               <div className="h-48 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={['auto', 'auto']} tickFormatter={(val) => `€${Math.round(val)}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                        itemStyle={{ color: '#818cf8' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#fff' }}
                      />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* NEW: AI Coach Widget */}
      <AICoachWidget 
         sentiment={marketSentiment} 
         onRunSimulation={runSimulation}
         currentBalance={currentBalance}
      />
    </div>
  );
}

export default App;
