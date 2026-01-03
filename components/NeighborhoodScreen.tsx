
import React, { useState, useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';
import Map from './Map';
import { Report, ReportStatus } from '../types';

interface NeighborhoodScreenProps {
  reports: Report[];
  onNavigate: (page: 'home' | 'report') => void;
}

const NeighborhoodScreen: React.FC<NeighborhoodScreenProps> = ({ reports, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return reports;
    return reports.filter(report => 
      report.title.toLowerCase().includes(term) || 
      report.description.toLowerCase().includes(term) ||
      report.category.toLowerCase().includes(term)
    );
  }, [reports, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <Header title="Neighborhood" subtitle="Track local progress in real-time." />
      
      <div className="h-64 w-full shadow-inner border-b border-slate-100">
        <Map reports={filteredReports} center={[40.7128, -74.0060]} zoom={13} />
      </div>

      <main className="flex-grow p-4 space-y-4 overflow-y-auto">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by keyword, category, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-sm py-2 z-10 px-1">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Community Feed</h2>
          <span className="text-[10px] font-bold bg-slate-200 px-2 py-1 rounded text-slate-600">
            {searchTerm ? `${filteredReports.length} results` : `${reports.length} Reports`}
          </span>
        </div>

        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <div key={report.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3 group transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start gap-4">
                <img src={report.imageUrl} alt={report.title} className="w-20 h-20 rounded-2xl object-cover shadow-sm ring-1 ring-slate-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                     <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                      report.status === ReportStatus.Resolved ? 'bg-emerald-100 text-emerald-700' : 
                      report.status === ReportStatus.InProgress ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                     }`}>
                      {report.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">{report.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight mb-1">{report.title}</h3>
                  <p className="text-xs font-medium text-slate-500 line-clamp-2">{report.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-1">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-full text-xs font-bold text-slate-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    {report.upvotes}
                  </button>
                  <button className="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedReport(report)}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:text-blue-800 transition-colors"
                >
                  Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3">
            <div className="bg-slate-100 p-4 rounded-full text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-500 font-bold">No reports matching your search</p>
            <p className="text-slate-400 text-xs max-w-[200px]">Try using different keywords or clearing the search bar.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="text-blue-600 text-xs font-black uppercase tracking-widest mt-2"
            >
              Clear Search
            </button>
          </div>
        )}

        <div className="py-4">
          <button
              onClick={() => onNavigate('home')}
              className="w-full bg-slate-900 text-white font-black py-4 px-4 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
          >
              Back to Home
          </button>
        </div>
      </main>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="absolute inset-0 z-[10000] flex flex-col justify-end">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedReport(null)}
          />
          <div className="bg-white rounded-t-[40px] shadow-2xl w-full max-h-[90%] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-500">
            <div className="sticky top-0 bg-white/80 backdrop-blur p-4 flex justify-between items-center z-20">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2" />
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">Issue Details</h4>
              <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="p-6 space-y-6 pb-12">
              <img 
                src={selectedReport.imageUrl} 
                alt={selectedReport.title} 
                className="w-full h-64 object-cover rounded-[32px] shadow-lg ring-1 ring-slate-100" 
              />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg ${
                    selectedReport.status === ReportStatus.Resolved ? 'bg-emerald-100 text-emerald-700' : 
                    selectedReport.status === ReportStatus.InProgress ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedReport.status}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">{selectedReport.date}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {selectedReport.title}
                  </h3>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest">
                    {selectedReport.category}
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-3xl space-y-2 border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</p>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {selectedReport.description}
                  </p>
                </div>

                {/* Optional Contact Section */}
                {(selectedReport.userName || selectedReport.phone) && (
                  <div className="bg-blue-50/50 p-5 rounded-3xl space-y-3 border border-blue-100/50">
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Reporter Contact</p>
                    <div className="space-y-2">
                      {selectedReport.userName && (
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-blue-300 uppercase leading-none mb-0.5">Name</p>
                            <p className="text-sm font-bold text-slate-800">{selectedReport.userName}</p>
                          </div>
                        </div>
                      )}
                      {selectedReport.phone && (
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.47 5.47l.772-1.547a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-blue-300 uppercase leading-none mb-0.5">Phone</p>
                            <p className="text-sm font-bold text-slate-800">{selectedReport.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    Upvote ({selectedReport.upvotes})
                  </button>
                  <button className="p-4 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default NeighborhoodScreen;
