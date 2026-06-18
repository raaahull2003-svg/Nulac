import React, { useState, useCallback } from 'react';
import PhoneSimulator from './components/PhoneSimulator';
import CodeExplorer from './components/CodeExplorer';
import BrandDashboard from './components/BrandDashboard';
import {
  Milk,
  Cpu,
  Smartphone,
  Sparkles,
  ArrowRight,
  Bell,
  Code2,
  ExternalLink,
  Lock,
  Globe,
  Info
} from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  time: string;
}

export default function App() {
  const [walletBalance, setWalletBalance] = useState<number>(500); // INR Balances
  const [activeTab, setActiveTab] = useState<'all' | 'phone' | 'code'>('all');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Cross-viewport FCM state bridge
  const [fcmTrigger, setFcmTrigger] = useState<{ title: string; body: string; type: string } | null>(null);

  // Function to drop toast alerts
  const handleNotify = useCallback((message: string) => {
    const id = Math.random().toString();
    const newToast: Toast = {
      id,
      message,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-50">
      
      {/* Top Banner Accent strip */}
      <div className="bg-emerald-800 text-white text-[11px] font-bold tracking-widest text-center py-2 relative overflow-hidden flex items-center justify-center space-x-1.5 px-4">
        <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
        <span>Nulac Dairy Premium Brand Workspace • Sourced Direct from Ooty certified organic farms</span>
        <span className="hidden sm:inline bg-white/15 px-2 py-0.5 rounded text-[9px] uppercase">100% Raw Glass Bottles</span>
      </div>

      {/* Main Header navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-12 h-16 flex items-center justify-between z-10 shrink-0">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
              <Milk className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-emerald-950 tracking-tight">Nulac<span className="text-emerald-500">Dairy</span></span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-100">
                  Active Demo
                </span>
              </div>
            </div>
          </div>

          {/* Symmetrical tab filters */}
          <div className="flex items-center space-x-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {[
              { id: 'all', label: '📱 Consolidated View', icon: Globe },
              { id: 'phone', label: 'Interactive App', icon: Smartphone },
              { id: 'code', label: 'Flutter Code Center', icon: Code2 }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-4.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 focus:outline-none'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick link brand metrics */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="https://nulac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-emerald-700 font-semibold border-b border-dashed border-slate-300"
            >
              <span>nulac.in</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

        </div>
      </header>

      {/* Main Core Grid Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Intro branding bento block */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6.5 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-y-1/4 translate-x-1/10">
            <Milk className="w-96 h-96 text-emerald-700" />
          </div>
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold uppercase px-3 py-1 rounded-full tracking-widest border border-emerald-100">
                PREMIUM ACCENTS
              </span>
              <span className="text-[10px] text-slate-400 italic font-medium">Original website: nulac.in</span>
            </div>
            <h2 className="text-2xl font-bold text-emerald-950 leading-tight">
              Pure • Fresh • Farm Direct Dairy Experience
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Experience the mobile application designed for Nulac Dairy. We provide two core tracks below: a live interactive touch-screen simulation where you can run transactional test flights (adding Cow and Buffalo milk packages to your cart, selecting delivery morning slots, subscribing with a recurring planner, or chatting with Anand), alongside a modular Flutter Clean Architecture directory structure mapped directly to Dart repository entities and state managers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto font-sans">
            <button
              onClick={() => {
                setActiveTab('phone');
                handleNotify('Switched layout to focus on physical phone simulator.');
              }}
              className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-all shadow-sm text-center cursor-pointer"
            >
              Simulate Phone App
            </button>
            <button
              onClick={() => {
                setActiveTab('code');
                handleNotify('Switched layout to review Flutter Clean Architecture.');
              }}
              className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold text-xs px-5 py-2.5 rounded-lg transition-all text-center cursor-pointer"
            >
              Get Flutter Codebase
            </button>
          </div>
        </section>

        {/* Dynamic Grid Layout conditional triggers */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Smartphone mockup + Dashboard */}
            <div className="lg:col-span-5 flex flex-col space-y-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                <span className="text-[10px] font-bold tracking-widest text-emerald-750 uppercase block mb-4">
                  📱 Live Smartphone Mockup
                </span>
                <PhoneSimulator
                  onNotify={handleNotify}
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                  fcmTrigger={fcmTrigger}
                  clearFcmTrigger={() => setFcmTrigger(null)}
                />
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <BrandDashboard
                  onNotify={handleNotify}
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                  onSendFcm={(title, body, type) => setFcmTrigger({ title, body, type })}
                />
              </div>
            </div>

            {/* Right side: Developer Codebase Explorer */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-extrabold text-emerald-900 uppercase tracking-wider flex items-center">
                    <Code2 className="w-4.5 h-4.5 mr-1.5 text-emerald-600" />
                    Flutter Clean Architecture Viewport
                  </h3>
                  <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                    Production Grade
                  </span>
                </div>
                <CodeExplorer onNotify={handleNotify} />
              </div>
            </div>
          </div>
        )}

        {/* Solo Phone View */}
        {activeTab === 'phone' && (
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase block mb-6">
              📱 Interactive Phone Simulation (11 Screens Setup)
            </span>
            <PhoneSimulator
              onNotify={handleNotify}
              walletBalance={walletBalance}
              setWalletBalance={setWalletBalance}
              fcmTrigger={fcmTrigger}
              clearFcmTrigger={() => setFcmTrigger(null)}
            />
            <div className="mt-8 w-full border-t border-slate-100 pt-6">
              <BrandDashboard
                onNotify={handleNotify}
                walletBalance={walletBalance}
                setWalletBalance={setWalletBalance}
                onSendFcm={(title, body, type) => setFcmTrigger({ title, body, type })}
              />
            </div>
          </div>
        )}

        {/* Solo Code View */}
        {activeTab === 'code' && (
          <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-emerald-950 uppercase tracking-wider flex items-center">
                  <Cpu className="w-5 h-5 mr-2 text-emerald-600" />
                  Flutter Clean Architecture Source Codebase
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Review domain entities, models converters, abstract repositories, and bloc presentations files.
                </p>
              </div>
              <span className="text-[9.5px] bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                Model-View-Intent (BLoC)
              </span>
            </div>
            <CodeExplorer onNotify={handleNotify} />
          </div>
        )}

      </main>

      {/* Aesthetic pairing Quality Seal footer */}
      <footer className="w-full bg-white border-t border-slate-200 mt-16 px-12 py-6 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 justify-between">
          <div className="flex gap-16">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Visual Language</p>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-emerald-700 rounded"></div>
                <div className="w-6 h-6 bg-emerald-500 rounded"></div>
                <div className="w-6 h-6 bg-emerald-50 rounded border border-emerald-100"></div>
                <div className="w-6 h-6 bg-white rounded border border-slate-200"></div>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Typography</p>
              <p className="text-sm text-slate-700 font-medium">Inter / SF Pro Display</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Key UX Principle</p>
              <p className="text-sm text-slate-700 font-medium">One-Tap Subscription Flow</p>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-slate-500 font-semibold text-emerald-900">Nulac Dairy Premium Brand Workspace</p>
            <p className="text-[10px] text-slate-400 mt-1">&copy; 2024 Nulac Dairy Mobile Design Guidelines. Proprietary Confidential.</p>
          </div>
        </div>
      </footer>

      {/* Floating dynamic SMS & Action Toasts */}
      <div id="toast-rail" className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm pointer-events-none font-sans">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-slate-900/95 backdrop-blur-sm hover:opacity-100 text-white rounded-xl py-3.5 px-4 shadow-xl border border-white/10 flex items-start space-x-3 transition-all duration-300 transform translate-y-0 opacity-100 pointer-events-auto"
          >
            <Bell className="w-4 h-4 text-emerald-400 mt-0.5 flex-none animate-bounce" />
            <div className="flex-1">
              <p className="text-[10.5px] font-sans font-medium leading-normal">{toast.message}</p>
              <span className="text-[8px] font-mono text-slate-400 mt-1 block tracking-wider">{toast.time}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

