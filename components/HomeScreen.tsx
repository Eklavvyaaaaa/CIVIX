
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Map from './Map';
import { Report, ReportStatus } from '../types';

interface HomeScreenProps {
  onNavigate: (page: 'home' | 'report' | 'neighborhood') => void;
  recentReports: Report[];
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, recentReports }) => {
  const resolvedCount = recentReports.filter(r => r.status === ReportStatus.Resolved).length;
  const pendingCount = recentReports.filter(r => r.status === ReportStatus.Pending).length;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <Header title="CIVIX" subtitle="Empower your community with AI-backed reporting."/>
      
      <main className="flex-grow p-4 space-y-5 overflow-y-auto">
        {/* Impact Stats Card */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white shadow-lg">
            <p className="text-xs opacity-80 uppercase font-bold tracking-wider">Reports Made</p>
            <p className="text-3xl font-black mt-1">{recentReports.length + 124}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl text-white shadow-lg">
            <p className="text-xs opacity-80 uppercase font-bold tracking-wider">Resolved</p>
            <p className="text-3xl font-black mt-1">{resolvedCount + 98}</p>
          </div>
        </div>

        {/* Map Section */}
        <div className="h-56 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white relative">
            <Map reports={recentReports} center={[40.7128, -74.0060]} zoom={13} />
            <div className="absolute top-2 right-2 z-[1000] bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold text-gray-600 shadow-sm border border-gray-100">
              Live Feed
            </div>
        </div>

        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-black text-slate-800">Recent Reports</h2>
          <button onClick={() => onNavigate('neighborhood')} className="text-blue-600 text-sm font-bold hover:underline">See All</button>
        </div>

        <div className="space-y-4">
          {recentReports.map(report => (
            <div key={report.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform active:scale-95">
              <div className="relative">
                <img src={report.imageUrl} alt={report.title} className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-50 shadow-inner" />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${report.status === ReportStatus.Resolved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">{report.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold uppercase tracking-tight">{report.category}</span>
                  <span className="text-xs text-slate-400 font-medium">• {report.upvotes} votes</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase">{report.date}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="p-6 bg-white border-t border-gray-100 space-y-4 sticky bottom-0 z-50">
          <button
              onClick={() => onNavigate('report')}
              className="w-full bg-blue-600 text-white font-black py-4 px-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              Register Complaint
          </button>
      </div>

       <Footer />
    </div>
  );
};

export default HomeScreen;
