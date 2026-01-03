
import React, { useState, ChangeEvent } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Report, IssueCategory, Coordinates } from '../types';
import { ISSUE_CATEGORIES } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface ReportIssueScreenProps {
  onAddReport: (report: Omit<Report, 'id' | 'status' | 'date' | 'upvotes'>) => void;
  onNavigate: (page: 'home' | 'neighborhood') => void;
}

const ReportIssueScreen: React.FC<ReportIssueScreenProps> = ({ onAddReport, onNavigate }) => {
  const [category, setCategory] = useState<IssueCategory | ''>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState('Detect your Location');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const base64 = await fileToBase64(file);
      // Always create a new GoogleGenAI instance right before the API call to ensure the latest API key is used.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType: file.type } },
            { text: `Analyze this image of a civic issue. Return a JSON object with: 
              "category": one of [${ISSUE_CATEGORIES.join(', ')}], 
              "description": a professional, concise summary of the problem (max 50 words).` }
          ]
        },
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      if (data.category && ISSUE_CATEGORIES.includes(data.category as IssueCategory)) {
        setCategory(data.category as IssueCategory);
      }
      if (data.description) {
        setDescription(data.description);
      }
    } catch (err) {
      console.error("AI Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      analyzeImage(file);
    }
  };
  
  const handleDetectLocation = () => {
    setLocationStatus('Pinpointing...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setLocationStatus('Exact Location Locked!');
        },
        () => {
          setLocationStatus('GPS Access Denied.');
        }
      );
    }
  };

  const handleReview = () => {
    if (!category || !image || !description || !location) {
      setError('Required: Photo, Category, Description, and Location.');
      return;
    }
    setError('');
    setShowConfirmation(true);
  };

  const handleFinalSubmit = () => {
    // Add safety checks and type assertions to fix TS error: Type '"" | IssueCategory' is not assignable to type 'IssueCategory'.
    if (!category || !location) {
      setError('Required: Category and Location.');
      return;
    }

    onAddReport({
      title: `${category} Report`,
      description,
      category: category as IssueCategory,
      location: location as Coordinates,
      imageUrl: imagePreview, 
      userName: name,
      phone,
    });
    setShowConfirmation(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <Header title="Report Issue" subtitle="AI will help categorize your report." />
      <main className="flex-grow p-5 space-y-6 overflow-y-auto pb-32">
        
        {/* Step 1: Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-800 uppercase tracking-wider">Step 1: Capture Evidence</label>
          <label htmlFor="image-upload" className="cursor-pointer group relative flex flex-col justify-center items-center w-full h-48 bg-white text-blue-600 rounded-3xl tracking-wide border-2 border-dashed border-blue-200 transition-all hover:bg-blue-50 hover:border-blue-400 overflow-hidden shadow-sm">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-blue-600">AI is analyzing...</span>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-white/90 p-1 rounded-full shadow-sm text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
              </>
            ) : (
              <>
                <div className="bg-blue-100 p-4 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-blue-800">Tap to Take Photo</span>
                <span className="text-[10px] text-blue-400 mt-1 uppercase font-bold">Max 5MB • JPG/PNG</span>
              </>
            )}
          </label>
          <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Step 2: Auto-filled Details */}
        <div className="space-y-4">
          <label className="text-sm font-black text-slate-800 uppercase tracking-wider block">Step 2: Issue Details</label>
          
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
              className="block w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            >
              <option value="" disabled>Select Category</option>
              {ISSUE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">What's wrong?</label>
             <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details..."
              rows={3}
              className="block w-full bg-white border border-slate-200 rounded-2xl p-4 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
             />
          </div>
        </div>

        {/* Step 3: Optional Contact Details */}
        <div className="space-y-4">
          <label className="text-sm font-black text-slate-800 uppercase tracking-wider block">Step 3: Contact (Optional)</label>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase ml-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eklavya Puri"
                className="block w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase ml-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 1234567890"
                className="block w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Precise Location */}
        <div className="space-y-2">
           <label className="text-sm font-black text-slate-800 uppercase tracking-wider">Step 4: Pin Location</label>
           <button onClick={handleDetectLocation} className={`flex items-center justify-between w-full rounded-2xl py-4 px-5 font-bold transition-all shadow-sm ${location ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-800 text-white hover:bg-slate-900'}`}>
            <span>{locationStatus}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        <div className="pt-4 space-y-4">
          <button
            onClick={handleReview}
            className="w-full bg-blue-600 text-white font-black py-4 px-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95"
            disabled={!category || !image || !description || !location || isAnalyzing}
          >
            {isAnalyzing ? 'Processing...' : 'Submit Report'}
          </button>
           <button
            onClick={() => onNavigate('home')}
            className="w-full text-center text-slate-400 font-bold py-2 text-sm uppercase tracking-tighter"
          >
            Cancel and Discard
          </button>
        </div>
      </main>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="absolute inset-0 z-[10000] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowConfirmation(false)}
          />
          <div className="bg-white w-full rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-5 text-white text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-black">Review Report</h3>
              <p className="text-blue-100 text-xs mt-1">Check your details before submitting</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl">
                <img src={imagePreview} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt="Preview" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                  <p className="text-sm font-bold text-slate-800">{category}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Description</p>
                <p className="text-sm text-slate-600 font-medium line-clamp-3 bg-slate-50 p-3 rounded-2xl">
                  {description}
                </p>
              </div>
              {name && (
                <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-400 font-bold uppercase">Reported By</span>
                   <span className="text-slate-800 font-bold">{name}</span>
                </div>
              )}
            </div>
            <div className="p-5 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-3 px-4 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={handleFinalSubmit}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReportIssueScreen;
