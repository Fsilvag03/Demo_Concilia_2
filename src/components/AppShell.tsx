import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ViewType } from '../App';

interface AppShellProps {
  children: React.ReactNode;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export function AppShell({ children, currentView, onNavigate }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        currentView={currentView}
        onNavigate={onNavigate}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
