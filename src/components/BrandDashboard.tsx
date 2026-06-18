import React, { useState } from 'react';
import {
  Heart,
  TrendingUp,
  ShieldAlert,
  BellRing,
  Wallet,
  Coins,
  Compass,
  FileCheck
} from 'lucide-react';

interface BrandDashboardProps {
  onNotify: (message: string) => void;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  onSendFcm?: (title: string, body: string, topic: string) => void;
}

export default function BrandDashboard({
  onNotify,
  walletBalance,
  setWalletBalance,
  onSendFcm
}: BrandDashboardProps) {
  const [lastNotification, setLastNotification] = useState<string>('');
  
  // FCM Broadcaster States
  const [fcmTab, setFcmTab] = useState<'presets' | 'composer'>('presets');
  const [fcmTitle, setFcmTitle] = useState('');
  const [fcmBody, setFcmBody] = useState('');
  const [fcmTopic, setFcmTopic] = useState('order_updates');

  const broadcastFcmCampaign = (title: string, body: string, topic: string) => {
    if (onSendFcm) {
      onSendFcm(title, body, topic);
      setLastNotification(`FCM Broadcaster [Topic: ${topic}]: "${title} - ${body}"`);
      onNotify(`FCM Broadcast fired on channel subscription: ${topic}`);
    } else {
      onNotify('FCM device client did not bind. Test triggering via Phone settings simulator.');
    }
  };

  const sendMockSMS = (text: string) => {
    setLastNotification(text);
    onNotify(`Simulated SMS Alert: "${text}"`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 pb-3.5 border-b border-slate-200 mb-4">
          <Compass className="w-5 h-5 text-emerald-800" />
          <h3 className="font-extrabold text-emerald-800 text-xs uppercase tracking-widest font-sans">
            Diagnostic Dashboard
          </h3>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4.5">
          {[
            { label: 'Pasture Temperature', val: '21°C', status: 'Optimal' },
            { label: 'Bottling Cold Chain', val: '3.8°C', status: 'Compliant' },
            { label: 'Antibiotic Scan Check', val: '0.00%', status: 'Pristine' },
            { label: 'Gir Cattle Mood Index', val: '98%', status: 'Cheerful' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
              <span className="block text-[8px] text-slate-400 font-extrabold uppercase">{stat.label}</span>
              <span className="block text-sm font-black text-emerald-800 mt-0.5">{stat.val}</span>
              <span className="inline-block px-1.5 py-0.5 text-[8px] bg-emerald-50 text-emerald-700 font-bold rounded-md mt-1 capitalize leading-none border border-emerald-100/50">
                {stat.status}
              </span>
            </div>
          ))}
        </div>

        {/* Firebase Cloud Messaging & Marketing Broadcaster */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center">
              <BellRing className="w-3.5 h-3.5 mr-1 text-[#2E8B57]" />
              FCM Campaign Console
            </h4>
            
            {/* Tab selector */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-[8px] font-bold">
              <button
                type="button"
                onClick={() => setFcmTab('presets')}
                className={`px-2 py-0.5 rounded ${fcmTab === 'presets' ? 'bg-[#1B4D3E] text-white' : 'text-slate-400'}`}
              >
                Presets
              </button>
              <button
                type="button"
                onClick={() => setFcmTab('composer')}
                className={`px-2 py-0.5 rounded ${fcmTab === 'composer' ? 'bg-[#1B4D3E] text-white' : 'text-slate-400'}`}
              >
                Composer
              </button>
            </div>
          </div>

          {fcmTab === 'presets' ? (
            <div className="space-y-2 text-left">
              {[
                { 
                  title: '📦 Order #NL-4820 On The Move!', 
                  body: 'Your fresh A2 Buffalo Milk milk slice has left our Koramangala cold facility.', 
                  topic: 'order_updates', 
                  badge: 'Order Update',
                  color: 'bg-blue-50 border-blue-150 text-blue-700'
                },
                { 
                  title: '🌿 New Live Product: Handrolled Ghee', 
                  body: 'Vedic-churned organic cow ghee back in stock in limited hand-labeled lots.', 
                  topic: 'new_launches', 
                  badge: 'Product Launch',
                  color: 'bg-emerald-50 border-emerald-150 text-emerald-800'
                },
                { 
                  title: '👑 Gold Member Reward Approved!', 
                  body: 'Claim ₹150 instant cash back on checking out custom weekly milk calendars.', 
                  topic: 'membership_offers', 
                  badge: 'Membership Offer',
                  color: 'bg-amber-50 border-amber-150 text-amber-800'
                },
                { 
                  title: '🚚 Delivery Drop: Gate Security Check', 
                  body: 'Delivery executive Ramesh S. has placed your insulated bottles at Block D security.', 
                  topic: 'delivery_updates', 
                  badge: 'Delivery Update',
                  color: 'bg-purple-50 border-purple-150 text-purple-800'
                }
              ].map((campaign, idx) => (
                <button
                  key={idx}
                  onClick={() => broadcastFcmCampaign(campaign.title, campaign.body, campaign.topic)}
                  className={`w-full text-left p-2.5 rounded-xl border flex flex-col items-start transition-all cursor-pointer hover:shadow-xs hover:border-slate-300 ${campaign.color}`}
                >
                  <div className="flex justify-between w-full items-center mb-0.5">
                    <span className="text-[7.5px] font-black uppercase tracking-wider">{campaign.badge}</span>
                    <span className="text-[8px] font-mono opacity-80 uppercase font-black">fcm topic</span>
                  </div>
                  <h5 className="text-[10px] font-bold leading-tight">{campaign.title}</h5>
                  <p className="text-[8.5px] opacity-90 mt-0.5 line-clamp-1 leading-normal">{campaign.body}</p>
                </button>
              ))}
            </div>
          ) : (
            /* FCM COMPOSER FORM */
            <div className="space-y-2.5 bg-slate-50 border border-slate-250 p-3 rounded-xl text-left">
              <div className="flex flex-col space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-400">Recipient FCM Topic Segment</label>
                <select
                  value={fcmTopic}
                  onChange={(e) => setFcmTopic(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-medium outline-none text-slate-800 focus:border-[#1B4D3E]"
                >
                  <option value="order_updates">📦 Order Updates Category</option>
                  <option value="new_launches">🌿 New Product Launches</option>
                  <option value="membership_offers">⭐ Membership/Loyalty Offers</option>
                  <option value="delivery_updates">🚚 Delivery Status Updates</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-400">Push Title</label>
                <input
                  type="text"
                  placeholder="e.g. Buffalo Dahi Pack Out"
                  value={fcmTitle}
                  onChange={(e) => setFcmTitle(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] outline-none text-slate-800 focus:border-[#1B4D3E]"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-400">Push message details</label>
                <textarea
                  rows={2}
                  placeholder="Body content of the Firebase Cloud notification..."
                  value={fcmBody}
                  onChange={(e) => setFcmBody(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] outline-none resize-none text-slate-800 focus:border-[#1B4D3E]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!fcmTitle.trim() || !fcmBody.trim()) {
                    onNotify('FCM Publisher Error: Title and details are both required!');
                    return;
                  }
                  broadcastFcmCampaign(fcmTitle, fcmBody, fcmTopic);
                  setFcmTitle('');
                  setFcmBody('');
                }}
                className="w-full bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-[9px] font-black py-2 rounded-lg transition-colors shadow-xs uppercase tracking-wider cursor-pointer text-center"
              >
                Broadcast FCM Push
              </button>
            </div>
          )}

          {lastNotification && (
            <div className="bg-emerald-50 text-emerald-800 text-[10px] p-2.5 rounded-lg border border-emerald-100 flex flex-col space-y-0.5 text-left">
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#2E8B57]">Last Sandbox Action Indicator</span>
              <p className="text-[9px] font-medium leading-normal italic text-slate-750">
                {lastNotification}
              </p>
            </div>
          )}
        </div>

        {/* Quick Sandboxed Wallet Topup */}
        <div className="mt-5 pt-4.5 border-t border-slate-200">
          <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center">
            <Wallet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Simulator Wallet Controls
          </h4>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
            <div>
              <span className="block text-[8px] text-slate-400 uppercase font-bold">Nulac Secure Balances</span>
              <span className="text-sm font-black text-emerald-800">₹{walletBalance}</span>
            </div>
            <div className="flex space-x-1.5">
              <button
                onClick={() => {
                  setWalletBalance((b) => b + 250);
                  onNotify('Added ₹250 to Simulator Wallet!');
                }}
                className="bg-emerald-600 text-white hover:bg-emerald-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer"
              >
                +₹250
              </button>
              <button
                onClick={() => {
                  setWalletBalance(100);
                  onNotify('Reset simulator wallet to ₹100.');
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable Cattle Farm Standard Footer Tag */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center space-x-1">
          <Heart className="w-3.5 h-3.5 text-rose-550 fill-rose-550" />
          <span className="font-sans font-medium">Bovine Wellness Standard</span>
        </div>
        <span className="font-mono text-[9px] text-emerald-600 font-semibold">100% Traceable</span>
      </div>
    </div>
  );
}

function ChevronRightShape(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
