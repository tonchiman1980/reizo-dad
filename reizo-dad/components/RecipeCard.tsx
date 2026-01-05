
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden mb-6 transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-orange-900 leading-tight">{recipe.title}</h3>
          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-bold">
            {recipe.difficulty}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{recipe.description}</p>
        
        <div className="flex gap-4 mb-6 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {recipe.cookingTime}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-1 font-accent">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
            材料
          </h4>
          <ul className="space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex justify-between text-sm border-b border-orange-50 pb-1">
                <span className="text-gray-700">{ing.name}</span>
                <span className="text-gray-500">{ing.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-1 font-accent">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
            パパの作り方手順
          </h4>
          <div className="space-y-4">
            {recipe.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold border border-orange-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
          <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
            パパのこだわり
          </h4>
          <p className="text-sm text-rose-900 leading-relaxed font-bold">
            「{recipe.dadTips}」
          </p>
        </div>
      </div>
    </div>
  );
};
