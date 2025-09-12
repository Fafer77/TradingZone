export type TradeFromAPI = {
  id: string;
  sample: string; 
  strategy: string | null; 
  date: string;
  instrument: string;
  initial_risk_pips: string; 
  initial_target_pips: string;
  realized_pnl: string; 
  realized_r_multiple: string; 
  outcome: "WIN" | "LOSS" | "BE";
  rules_followed: boolean;
  context: string;
  comment: string;
};

export type TradeSampleFromAPI = {
  id: string;
  name: string;
  size: number;
  start_date: string;
  end_date: string | null;
  grade: string;
  pnl: string; 
  owner: number;
  trades: TradeFromAPI[];
  trades_count: number;
};

export type PlaybookFromAPI = {
  id: string;
  title: string;
  overview: string;
  trade_type: "day_trading" | "scalping" | "swing_trading";
  entry_criteria: string[];
  exit_strategy: string[];
  stop_loss_rules: string[];
  enhancers: string[];
  trade_management: string[];
  checklist: string[];
  owner: number;
  calculated_ev: number;
};

export type Reminder = {
  id: string;
  text: string;
};

export type MarketDriver = {
  id: string;
  name: string;
  percentage: number;
  color: string;
};
