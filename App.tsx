
import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import ReportIssueScreen from './components/ReportIssueScreen';
import NeighborhoodScreen from './components/NeighborhoodScreen';
import AIChatAssistant from './components/AIChatAssistant';
import { Report, IssueCategory, ReportStatus } from './types';
import { MOCK_REPORTS } from './constants';

type Page = 'home' | 'report' | 'neighborhood';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);

  const addReport = (newReportData: Omit<Report, 'id' | 'status' | 'date' | 'upvotes'>) => {
    const newReport: Report = {
      ...newReportData,
      id: Math.random().toString(36).substr(2, 9),
      status: ReportStatus.Pending,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      upvotes: 0,
    };
    setReports(prevReports => [newReport, ...prevReports]);
    setCurrentPage('neighborhood');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentPage} recentReports={reports.slice(0, 4)} />;
      case 'report':
        return <ReportIssueScreen onAddReport={addReport} onNavigate={setCurrentPage} />;
      case 'neighborhood':
        return <NeighborhoodScreen reports={reports} onNavigate={setCurrentPage} />;
      default:
        return <HomeScreen onNavigate={setCurrentPage} recentReports={reports.slice(0, 4)} />;
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen font-sans antialiased text-slate-900">
      <div className="container mx-auto max-w-md p-0 h-full">
        <div className="bg-white shadow-2xl min-h-screen relative overflow-hidden flex flex-col">
          {renderPage()}
          <AIChatAssistant />
        </div>
      </div>
    </div>
  );
};

export default App;
