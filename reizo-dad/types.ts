
export interface Recipe {
  title: string;
  description: string;
  cookingTime: string;
  difficulty: '簡単' | '普通' | '少し頑張る';
  ingredients: {
    name: string;
    amount: string;
  }[];
  steps: string[];
  dadTips: string;
}

export interface AnalysisResult {
  detectedIngredients: string[];
  recipes: Recipe[];
}

export enum AppState {
  IDLE = 'IDLE',
  CAPTURING = 'CAPTURING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
