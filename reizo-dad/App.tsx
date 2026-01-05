
import React, { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { RecipeCard } from './components/RecipeCard';
import { AppState, AnalysisResult } from './types';
import { analyzeFridgeImages } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [images, setImages] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setImages(prev => [...prev, base64String]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const startAnalysis = async () => {
    if (images.length === 0) return;
    
    setStatus(AppState.ANALYZING);
    setErrorMessage('');

    try {
      const analysis = await analyzeFridgeImages(images);
      setResult(analysis);
      setStatus(AppState.RESULT);
    } catch (error) {
      console.error(error);
      setErrorMessage('悪いな、ちょっと写真がうまく読み取れなかった。もう一回、明るい場所で撮ってくれるか？');
      setStatus(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setStatus(AppState.IDLE);
    setImages([]);
    setResult(null);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Layout>
      {(status === AppState.IDLE) && (
        <div className="flex flex-col items-center min-h-[70vh] py-6 animate-in fade-in duration-700">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
            <span className="text-4xl">🍳</span>
          </div>
          
          <h2 className="font-accent text-2xl font-bold text-orange-900 mb-2">お疲れ様！</h2>
          <p className="text-orange-800 text-center mb-8 leading-relaxed px-6">
            冷蔵庫の中をパッと撮って見せてくれ。<br/>
            パパが旨い飯の作り方を教えてやるぞ。
          </p>

          {images.length > 0 && (
            <div className="w-full mb-8 px-2">
              <p className="text-xs font-bold text-orange-400 mb-3 uppercase tracking-widest text-center">チェックする写真 ({images.length}枚)</p>
              <div className="flex flex-wrap justify-center gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 group">
                    <img 
                      src={`data:image/jpeg;base64,${img}`} 
                      className="w-full h-full object-cover rounded-lg border-2 border-white shadow-sm" 
                      alt={`fridge-${idx}`}
                    />
                    <button 
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md border-2 border-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-4 w-full px-6">
            <label className="cursor-pointer active:scale-95 transition-transform">
              <div className="flex items-center justify-center gap-3 bg-white text-orange-600 border-2 border-orange-100 py-4 rounded-2xl font-bold shadow-sm hover:bg-orange-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                {images.length === 0 ? "冷蔵庫を撮る" : "さらに撮る"}
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="hidden" 
                onChange={handleImageCapture}
              />
            </label>

            {images.length > 0 && (
              <button 
                onClick={startAnalysis}
                className="relative group active:scale-95 transition-transform"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-rose-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative flex items-center justify-center gap-3 bg-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
                  献立を相談する
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {status === AppState.ANALYZING && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="relative mb-10">
            <div className="w-24 h-24 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl animate-bounce">🥘</span>
            </div>
          </div>
          <h2 className="font-accent text-xl font-bold text-orange-900 mb-3">
            よし、何ができるか考え中だ...
          </h2>
          <p className="text-orange-400 animate-pulse">
            冷蔵庫の中をしっかりチェックしてるぞ。<br/>
            最高の献立を出すから、少し待ってろよ。
          </p>
        </div>
      )}

      {status === AppState.RESULT && result && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 pr-4">
              <h2 className="font-accent text-xl font-bold text-orange-900">パパのおすすめ献立</h2>
              <p className="text-xs text-orange-400 line-clamp-2">
                見つけた食材：{result.detectedIngredients.join('、')}
              </p>
            </div>
            <button 
              onClick={resetApp}
              className="flex-shrink-0 text-orange-700 text-xs font-bold bg-white px-3 py-2 rounded-lg border border-orange-100 shadow-sm active:bg-orange-50"
            >
              撮り直す
            </button>
          </div>

          <div className="space-y-4">
            {result.recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>

          <button 
            onClick={resetApp}
            className="w-full mt-8 mb-12 py-4 bg-white text-orange-700 font-bold rounded-2xl border-2 border-orange-100 shadow-sm active:bg-orange-50 flex items-center justify-center gap-2"
          >
            他のアイデアも見てみる
          </button>
        </div>
      )}

      {status === AppState.ERROR && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
          <div className="text-6xl mb-6">😅</div>
          <h2 className="text-xl font-bold text-orange-900 mb-4 font-accent">すまん、失敗だ！</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {errorMessage}
          </p>
          <button 
            onClick={resetApp}
            className="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
          >
            もう一度撮ってみる
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
