export interface Trade {
  id: number;
  investment: number;
  result: 'WIN' | 'LOSS' | 'PENDING';
  payout: number; // The payout multiplier (e.g. 1.85)
  profitOrLoss: number;
  balanceAfter: number;
  timestamp: number;
}

export interface AppSettings {
  initialBalance: number;
  payoutPercentage: number; // e.g., 85 for 85%
  enableAutoPilot: boolean; // NEW: Enables prescriptive AI actions

  // Strategy Config
  strategy: 'PERCENTAGE' | 'FIXED' | 'MASANIELLO';
  
  // Percentage Strategy
  riskPercentage: number; 
  
  // Fixed Strategy
  fixedAmount: number;

  // Masaniello Strategy
  totalEvents: number;
  targetWins: number;

  // --- Risk Management ---
  riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH'; // Adjusts stake size slightly
  maxLossesAllowed: number; // Safety Brake: Stop after X losses
  maxDrawdownWarning: number; // Alert if balance drops X% from peak
  sessionTakeProfit: number; // Stop if loss >= X
  sessionStopLoss: number; // Stop if loss >= X
}

export interface AIInsight {
  id: string;
  type: 'STRATEGY' | 'PROFIT' | 'ANOMALY' | 'BEHAVIOR' | 'AUTOMATION' | 'SOCIAL' | 'PREDICTION';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: number;
  actionLabel?: string;
  onAction?: () => void;
}

export type MarketSentiment = 'BULLISH' | 'BEARISH' | 'HIGH_VOLATILITY' | 'NEUTRAL';

export interface SimulationResult {
  next5TradesProb: number; // Probability of profit in next 5 trades
  projectedBalance: number;
  recommendation: 'STOP' | 'CONTINUE';
}

export interface LabSimulationResult {
    strategyName: string;
    finalBalanceAvg: number;
    bankruptcyRisk: number; // Percentage
    winProbability: number; // Probability of ending in profit
    recommended: boolean;
}
