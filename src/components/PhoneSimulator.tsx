import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Milk,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  User,
  Star,
  MapPin,
  Calendar,
  Phone,
  BookOpen,
  Check,
  Plus,
  Minus,
  Trash2,
  TrendingUp,
  Award,
  Send,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Map,
  X,
  CreditCard,
  Grid,
  Bell,
  BellOff,
  Settings,
  Sliders,
  Apple
} from 'lucide-react';
import { NULAC_PRODUCTS } from '../data/products';
import { NULAC_BLOGS } from '../data/blogs';
import { Product, CartItem, Order, Subscription, ScreenId, Blog, ProductCategory, UserSession, RazorpayTransaction } from '../types';
import { nulacRepository, RepositoryStatus } from '../repositories/NulacRepository';

interface PhoneSimulatorProps {
  onNotify: (message: string) => void;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  fcmTrigger?: { title: string; body: string; type: string } | null;
  clearFcmTrigger?: () => void;
}

export default function PhoneSimulator({
  onNotify,
  walletBalance,
  setWalletBalance,
  fcmTrigger,
  clearFcmTrigger
}: PhoneSimulatorProps) {
  // Repository and Connectivity States
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>(NULAC_PRODUCTS);
  const [dynamicBlogs, setDynamicBlogs] = useState<Blog[]>(NULAC_BLOGS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [repoStatus, setRepoStatus] = useState<RepositoryStatus>(nulacRepository.getStatus());
  const [useWebViewFallback, setUseWebViewFallback] = useState(false);

  // Secure Session and Authentication states
  const [session, setSession] = useState<UserSession>(() => nulacRepository.getSession());
  const [loginPhone, setLoginPhone] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  // FCM Cloud Messaging States & Metrics
  const [fcmNotifications, setFcmNotifications] = useState<any[]>([
    {
      id: 'fcm-init-1',
      title: '🐮 Welcome to Nulac Gold Tier',
      body: 'Get raw glass-bottle A2 cow milk direct from local farms. Explore your customized gold benefits in settings.',
      type: 'membership_offers',
      timestamp: '2 hours ago',
      isRead: false
    },
    {
      id: 'fcm-init-2',
      title: '📦 Order #NL-2945 Dispatched',
      body: 'Your A2 Premium Desi Ghee is out with delivery partner S. Ramesh. OTP for handover is 4920.',
      type: 'order_updates',
      timestamp: '4 hours ago',
      isRead: true
    },
    {
      id: 'fcm-init-3',
      title: '🌿 Organic Paneer Lot Hand-Pressed',
      body: 'Our fresh organic paneer has just been handmade at the farm. Try custom orders this evening!',
      type: 'new_launches',
      timestamp: '1 day ago',
      isRead: true
    }
  ]);
  const [fcmToken, setFcmToken] = useState('fcm_nulac_9f88d277be95bb4a148d88e0a811cf3ce3a968a3563914a275');
  const [isTokenCopied, setIsTokenCopied] = useState(false);
  const [topicSubscriptions, setTopicSubscriptions] = useState<Record<string, boolean>>({
    order_updates: true,
    new_launches: true,
    membership_offers: true,
    delivery_updates: true,
  });
  const [activeFcmBanner, setActiveFcmBanner] = useState<any | null>(null);
  const [osSkin, setOsSkin] = useState<'iOS' | 'Android'>('iOS');

  // Mobile UI States
  const [currentScreen, _setCurrentScreen] = useState<ScreenId>('splash');
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const setCurrentScreen = (screen: ScreenId) => {
    if (screen === 'splash' || screen === 'auth') {
      _setCurrentScreen(screen);
      return;
    }
    setIsScreenLoading(true);
    _setCurrentScreen(screen);
    setTimeout(() => {
      setIsScreenLoading(false);
    }, 550);
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => nulacRepository.getCart());
  
  // Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  
  // Checkout & Subscription Forms
  const [userName, setUserName] = useState(() => {
    const s = nulacRepository.getSession();
    return s.isLoggedIn ? s.name : 'Rahul Kumar';
  });
  const [userPhone, setUserPhone] = useState(() => {
    const s = nulacRepository.getSession();
    return s.isLoggedIn ? s.phone : '9876543210';
  });
  const [userAddress, setUserAddress] = useState('Apartment 4B, Emerald Heights, Koramangala, Bangalore');
  const [deliverySlot, setDeliverySlot] = useState('Morning (5:30 AM - 7:30 AM)');
  const [deliveryFrequency, setDeliveryFrequency] = useState<'once' | 'daily' | 'alternate'>('once');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Sync Form values when Session state updates
  useEffect(() => {
    if (session.isLoggedIn) {
      setUserName(session.name);
      setUserPhone(session.phone);
    } else if (session.isGuest) {
      setUserName('Guest Customer');
      setUserPhone('');
    } else {
      setUserName('');
      setUserPhone('');
    }
  }, [session]);

  // Simulated OTP countdown loop
  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Trigger Simulated FCM Push Notification
  const triggerFcmNotification = (title: string, body: string, type: string) => {
    // Check if user is subscribed to topic
    if (!topicSubscriptions[type]) {
      onNotify(`FCM Push Blocked! Device is unsubscribed from "${type}" channels.`);
      return;
    }

    const newNotif = {
      id: `fcm-${Date.now()}`,
      title,
      body,
      type,
      timestamp: 'Just Now',
      isRead: false
    };

    setFcmNotifications(prev => [newNotif, ...prev]);
    setActiveFcmBanner(newNotif);

    // Auto dismiss active sliding notification banner after 5.5 seconds
    const bannerTimer = setTimeout(() => {
      setActiveFcmBanner(curr => curr?.id === newNotif.id ? null : curr);
    }, 5500);
  };

  // Listen for global FCM Push requests triggered from the Brand Dashboard
  useEffect(() => {
    if (fcmTrigger && clearFcmTrigger) {
      triggerFcmNotification(fcmTrigger.title, fcmTrigger.body, fcmTrigger.type);
      clearFcmTrigger();
    }
  }, [fcmTrigger, clearFcmTrigger]);
  
  // Subscriptions State
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 'sub_init_1',
      product: NULAC_PRODUCTS[0], // A2 Milk
      qtyPerDay: 2,
      frequency: 'daily',
      startDate: '2026-06-20',
      durationMonths: 3,
      status: 'active'
    }
  ]);
  
  // Subscription Form State
  const [subTab, setSubTab] = useState<'active' | 'new'>('active');
  const [subProduct, setSubProduct] = useState<Product>(NULAC_PRODUCTS[0]);
  const [subQty, setSubQty] = useState(2);
  const [subFreq, setSubFreq] = useState<'daily' | 'alternate' | 'custom'>('daily');
  const [subSelectedDays, setSubSelectedDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [subMonths, setSubMonths] = useState(3);
  const [subscriptionHistory, setSubscriptionHistory] = useState<any[]>([
    {
      id: 'hist_1',
      productName: 'Rich Creamy Buffalo Milk',
      frequency: 'Alternate Days',
      qtyPerDay: 1,
      dateRange: 'April 10, 2026 - May 15, 2026',
      status: 'Completed'
    }
  ]);

  // Active Order / Order Success Status
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [ordersHistory, setOrdersHistory] = useState<Order[]>(() => nulacRepository.getOrders());
  const [deliveryStep, setDeliveryStep] = useState(0); // 0: Milking, 1: Scanning, 2: Dispatch, 3: Arrived

  // Checkout Payment Method Selection (Wallet vs Direct Razorpay)
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'wallet' | 'razorpay'>('wallet');

  // Razorpay Gateway State & Transactions Storage
  const [razorpayTransactions, setRazorpayTransactions] = useState<RazorpayTransaction[]>(() => {
    try {
      const stored = localStorage.getItem('nulac_razorpay_txs');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Storage error:", e);
    }
    return [
      {
        id: 'pay_NLC102948291',
        amount: 500,
        paymentMethod: 'upi',
        methodDetail: 'UPI: raaahull2003@okaxis',
        status: 'captured',
        date: '17/06/2026, 06:12 PM',
        purpose: 'wallet_topup'
      }
    ];
  });

  const [rpayOverlayOpen, setRpayOverlayOpen] = useState(false);
  const [rpayAmount, setRpayAmount] = useState(0);
  const [rpayPurpose, setRpayPurpose] = useState<'wallet_topup' | 'direct_checkout'>('wallet_topup');
  const [rpayMethod, setRpayMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [rpayStep, setRpayStep] = useState<'select' | 'processing' | 'success' | 'failed'>('select');
  const [rpayErrorReason, setRpayErrorReason] = useState<string | null>(null);

  // Form fields inside Razorpay Overlay
  const [rpayUpiId, setRpayUpiId] = useState('raaahull2003@okaxis');
  const [rpayCardNo, setRpayCardNo] = useState('4111 1111 1111 1111');
  const [rpayCardExpiry, setRpayCardExpiry] = useState('12/28');
  const [rpayCardCvv, setRpayCardCvv] = useState('123');
  const [rpayCardName, setRpayCardName] = useState('Rahul');
  const [rpayBank, setRpayBank] = useState('State Bank of India');
  const [rpayWallet, setRpayWallet] = useState('Razorpay Wallet');

  useEffect(() => {
    try {
      localStorage.setItem('nulac_razorpay_txs', JSON.stringify(razorpayTransactions));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  }, [razorpayTransactions]);


  // Sync Cart state with the Repository
  useEffect(() => {
    nulacRepository.saveCart(cart);
  }, [cart]);

  // Sync Orders state with the Repository
  useEffect(() => {
    nulacRepository.saveOrders(ordersHistory);
  }, [ordersHistory]);

  // Load Products & Blogs from NulacRepository dynamically
  useEffect(() => {
    async function loadDynamicData() {
      setIsLoadingProducts(true);
      setIsLoadingBlogs(true);
      setConnectionError(null);

      try {
        // Fetch products through repository
        const { products, status: productStatus } = await nulacRepository.fetchProducts();
        setDynamicProducts(products);
        setRepoStatus(productStatus);

        if (!productStatus.isLive) {
          setConnectionError(productStatus.error);
          // Set WebView Fallback warning/toggle when Direct API is blocked or offline
          setUseWebViewFallback(true);
          onNotify("API retrieval warned: Direct connection filtered or CORS-blocked. Auto-activated WebView Fallback.");
        } else {
          onNotify("Successfully connected to https://nulac.in live catalog!");
        }

        // Fetch blogs through repository
        const { blogs } = await nulacRepository.fetchBlogs();
        setDynamicBlogs(blogs);

      } catch (err: any) {
        setConnectionError(err.message || "Failed to establish connection");
        setUseWebViewFallback(true);
        onNotify("Repository warning: Web socket / API unavailable. Running with Local High-Fidelity assets.");
      } finally {
        setIsLoadingProducts(false);
        setIsLoadingBlogs(false);
      }
    }

    loadDynamicData();
  }, [onNotify]);

  // Chat Support State
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    {
      sender: 'agent',
      text: 'Hello! I am Anand, the Nulac Dairy Farm coordinator. How can I help you today with your fresh milk orders?',
      time: '07:30 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Static banner index slider
  const [bannerIdx, setBannerIdx] = useState(0);
  const banners = [
    {
      title: 'A2 Gir Cow Milk',
      badge: 'FARM-DIRECT',
      desc: '100% Raw & Pasteurized in sterile glass bottles.',
      color: 'from-[#1B4D3E] to-[#143B2F]'
    },
    {
      title: 'Slow Simmered Vedic Ghee',
      badge: 'VEDIC COMPLIANT',
      desc: 'Handmade churn in earthen pots with firewood.',
      color: 'from-[#D4AF37]/90 to-[#B89025]'
    },
    {
      title: 'Melt-in-mouth Paneer',
      badge: 'FRESH ON ORDER',
      desc: 'Citrus coagulation ensures magical sponginess.',
      color: 'from-[#2E8B57] to-[#1F5F3B]'
    }
  ];

  // Auto transition Splash screen
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        if (session.isLoggedIn || session.isGuest) {
          setCurrentScreen('home');
        } else {
          setCurrentScreen('auth');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, session]);

  // Delivery simulation timer
  useEffect(() => {
    if (currentScreen === 'success') {
      const interval = setInterval(() => {
        setDeliveryStep((prev) => (prev < 3 ? prev + 1 : 0));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentScreen]);

  // Auto scroll banner preview container
  useEffect(() => {
    if (currentScreen === 'home') {
      const timer = setInterval(() => {
        setBannerIdx((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [currentScreen, banners.length]);

  // Helper calculation
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };
  const getDiscount = () => {
    if (promoApplied) {
      return getSubtotal() * 0.1; // 10%
    }
    return 0;
  };
  const getDeliveryFee = () => {
    const sub = getSubtotal();
    if (sub === 0 || sub > 300) return 0;
    return 30; // Rs 30 flat delivery for small orders
  };
  const getGrandTotal = () => {
    return getSubtotal() - getDiscount() + getDeliveryFee();
  };

  // Cart operations
  const addToCart = (product: Product, selectedOption?: string) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1, selectedOption }]);
    }
    onNotify(`Added ${product.name} to cart.`);
  };

  const decreaseQuantity = (productId: string) => {
    const existing = cart.find((item) => item.product.id === productId);
    if (existing) {
      if (existing.quantity === 1) {
        setCart(cart.filter((item) => item.product.id !== productId));
        onNotify('Item removed from cart.');
      } else {
        setCart(
          cart.map((item) =>
            item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
      }
    }
  };

  const increaseQuantity = (productId: string) => {
    setCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Checkout submission
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const finalPrice = getGrandTotal();

    if (walletBalance < finalPrice) {
      onNotify('Insufficient wallet balance. Please add money inside the Profile tab!');
      return;
    }

    // Deduct
    setWalletBalance((prev) => prev - finalPrice);

    const newOrder: Order = {
      id: 'NLC-' + Math.floor(100000 + Math.random() * 900000),
      items: [...cart],
      total: finalPrice,
      deliveryAddress: userAddress,
      deliverySlot: deliverySlot,
      deliveryFrequency: deliveryFrequency,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: 'pending'
    };

    setRecentOrder(newOrder);
    setOrdersHistory([newOrder, ...ordersHistory]);
    setCart([]);
    setPromoApplied(false);
    setDeliveryStep(0);
    setCurrentScreen('success');
    onNotify('Order placed successfully via Nulac Wallet!');

    // Simulate background Firebase Cloud Messaging deliveries
    setTimeout(() => {
      triggerFcmNotification(
        '📦 Order Successfully Scheduled!',
        `Your A2 Dairy fresh order (${newOrder.id}) has been locked for delivery slot: ${newOrder.deliverySlot}.`,
        'order_updates'
      );
    }, 4000);

    setTimeout(() => {
      triggerFcmNotification(
        '🚚 Dispatch Progress Locked',
        `Nulac delivery partner Ramesh S. has been mapped to your Koramangala route.`,
        'delivery_updates'
      );
    }, 11000);
  };

  // Handle subscription creation
  const handleAddSubscription = () => {
    const newSub: Subscription = {
      id: 'SUB-' + Math.floor(100000 + Math.random() * 900000),
      product: subProduct,
      qtyPerDay: subQty,
      frequency: subFreq,
      selectedDays: subFreq === 'custom' ? subSelectedDays : undefined,
      startDate: new Date().toLocaleDateString('en-IN'),
      durationMonths: subMonths,
      status: 'active'
    };

    setSubscriptions([newSub, ...subscriptions]);
    onNotify(`Subscribed to ${subProduct.name} successfully.`);
    setSubTab('active');

    // Simulate FCM background push subscription notification
    setTimeout(() => {
      triggerFcmNotification(
        '🔔 Subscription Lock Complete!',
        `Your recurring subscription for ${subProduct.name} (Qty: ${subQty}, Frequency: ${subFreq}) is active. First delivery starts tomorrow!`,
        'membership_offers'
      );
    }, 1500);
  };

  // Agent Smart Chat Responses
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I would be happy to coordinate this. Our raw glass bottle milk travels in cold insulated boxes directly from Ooty farms.";
      const cleanText = text.toLowerCase();

      if (cleanText.includes('pasteur') || cleanText.includes('warm') || cleanText.includes('boil')) {
        reply = "We offer both! Our Raw cow milk is cooled rapidly to 4°C immediately upon milking, which preserves live enzymes. We also offer standard Pasteurised Milk in sterile eco bottles.";
      } else if (cleanText.includes('where') || cleanText.includes('farm') || cleanText.includes('location')) {
        reply = "Our main organic farmland spans across 48 acres in Coorg and Pune. We utilize pesticide-free pasture soil where cows graze freely on Napier grass and natural legumes.";
      } else if (cleanText.includes('bottle') || cleanText.includes('plastic') || cleanText.includes('glass')) {
        reply = "We believe glass is pristine. Unlike single-use plastics, glass is 100% inert, preserves the sweet cream-layer scent and locks temperature. We wash the bottles at 120°C steam heat.";
      } else if (cleanText.includes('pause') || cleanText.includes('cancel') || cleanText.includes('vacation')) {
        reply = "Absolutely! You can pause or adjust daily milk quantities instantly via the app calendar inside the 'Subscriptions' page with zero penalties before 10 PM on the preceding night.";
      } else if (cleanText.includes('price') || cleanText.includes('cost') || cleanText.includes('offer')) {
        reply = "Our A2 Gir Cow milk is priced at ₹85/Litre, our Thick Buffalo milk is ₹110/Litre, and Vedic Bilona Ghee starts from ₹1250 for a 500ml jar. Check out the Products screen for offers!";
      } else if (cleanText.includes('subscription') || cleanText.includes('membership')) {
        reply = "If you subscribe, you join the Nulac Gold Club. This gives you recurring daily home delivery with absolute zero delivery charges plus a 10% discount on first-month bills.";
      }

      const agentMsg = {
        sender: 'agent' as const,
        text: reply,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1200);
  };

  // Filter products
  const filteredProducts = dynamicProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="phone-outer-frame" className="flex flex-col items-center justify-center p-4">
      {/* Premium iPhone Frame View */}
      <div className="relative w-[375px] h-[785px] bg-white rounded-[50px] shadow-2xl border-[12px] border-slate-900 overflow-hidden flex flex-col select-none">
        {/* Notch details */}
        <div className="absolute top-0 inset-x-0 h-7 bg-slate-900 z-50 flex justify-between items-center px-8 text-[11px] text-white">
          <span className="font-semibold text-xs py-1">9:41</span>
          {/* Dynamic Speaker notch */}
          <div className="w-[110px] h-4 bg-black rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="w-10 h-1 bg-neutral-800 rounded-full" />
          </div>
          <div className="flex items-center space-x-1.5 pt-0.5">
            <span className="text-[9px] text-[#2E8B57] font-semibold bg-white/10 px-1 rounded-sm">5G</span>
            <div className="w-4.5 h-2.5 border border-white/60 rounded-xs relative p-0.5 flex items-center">
              <div className="bg-white h-full w-3 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Dynamic Sliding Notification Overlay (FCM Push) */}
        <div 
          onClick={() => {
            if (activeFcmBanner) {
              setCurrentScreen('notifications');
              setFcmNotifications(prev => prev.map(n => n.id === activeFcmBanner.id ? { ...n, isRead: true } : n));
              setActiveFcmBanner(null);
              onNotify(`Routing device to Notification Center...`);
            }
          }}
          style={{ 
            transform: activeFcmBanner ? 'translateY(0)' : 'translateY(-150px)', 
            opacity: activeFcmBanner ? 1 : 0, 
            transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)' 
          }}
          className="absolute top-9 inset-x-2.5 z-[100] cursor-pointer select-none"
        >
          {activeFcmBanner && (
            osSkin === 'iOS' ? (
              /* PREMIUM iOS BANNER CARD */
              <div id="ios-fcm-push" className="bg-white/95 backdrop-blur-md rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-neutral-200/50 p-3 flex flex-col space-y-1.5 transition-all w-full text-left">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans px-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                    <div className="w-4 h-4 bg-[#1B4D3E] rounded-md flex items-center justify-center text-[8px] text-white">N</div>
                    <span>NULAC DAIRY</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-[7px] text-[#2E8B57] bg-[#E8F0EC] px-1.5 py-0.5 rounded font-black uppercase tracking-wide">
                      {activeFcmBanner.type.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400 font-medium ml-1">now</span>
                  </div>
                </div>
                <div className="px-1 text-left">
                  <h4 className="text-[11px] font-black text-slate-900 leading-tight tracking-tight">
                    {activeFcmBanner.title}
                  </h4>
                  <p className="text-[9.5px] text-slate-600 leading-normal font-medium mt-0.5 line-clamp-2">
                    {activeFcmBanner.body}
                  </p>
                </div>
                {/* Swipe signifier bar */}
                <div className="w-10 h-1 bg-slate-300/60 rounded-full mx-auto self-center mt-1" />
              </div>
            ) : (
              /* PREMIUM ANDROID STATUS DIALOG */
              <div id="android-fcm-push" className="bg-[#1C1C1E] text-white rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.25)] p-3.5 border-l-4 border-[#2E8B57] flex flex-col space-y-1 text-left w-full">
                <div className="flex justify-between items-center text-[9px] text-slate-350 tracking-wider font-semibold">
                  <span className="flex items-center">
                    <Smartphone className="w-3 h-3 text-[#2E8B57] mr-1" />
                    PUSH SERVICE • GOOGLE PLAY SERVICES
                  </span>
                  <span className="bg-[#2E8B57]/15 text-[#2E8B57] px-1.5 py-0.5 rounded text-[8px]">
                    FCM BANNER
                  </span>
                </div>
                <div className="text-left py-0.5">
                  <h4 className="text-[11.5px] font-bold text-white tracking-wide">
                    {activeFcmBanner.title}
                  </h4>
                  <p className="text-[10px] text-slate-300 leading-relaxed font-sans mt-0.5">
                    {activeFcmBanner.body}
                  </p>
                </div>
                <div className="flex justify-end pt-1 space-x-2">
                  <span className="text-[8px] text-slate-500 font-mono self-center">FCM TOKEN: 9F88D...</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFcmBanner(null);
                    }}
                    className="text-[9px] font-black uppercase tracking-wider text-[#2E8B57] hover:text-emerald-400 px-2 py-0.5"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Dynamic Screen Viewport Area */}
        <div className="flex-1 pt-7 pb-2 overflow-y-auto bg-slate-50 flex flex-col relative">

          {/* SECURE RAZORPAY INTUATIVE CUSTOM DIALOG */}
          {rpayOverlayOpen && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end font-sans">
              <div className="bg-white rounded-t-2xl shadow-2xl border-t border-slate-100 flex flex-col max-h-[92%] overflow-y-auto animate-in slide-in-from-bottom duration-250 select-none">
                
                {/* Razorpay Banner Header */}
                <div className="bg-[#1D2B44] text-white p-3.5 flex items-center justify-between shrink-0">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6.5 h-6.5 bg-[#3399cc] rounded-lg flex items-center justify-center font-black text-white text-sm shadow-sm select-none">
                      R
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-100">Nulac Secure checkout</h3>
                        <span className="bg-[#3399cc]/20 text-[#3399cc] text-[7px] px-1 py-0.2 rounded font-black uppercase border border-[#3399cc]/30">TEST</span>
                      </div>
                      <p className="text-[8px] text-slate-400 tracking-tight">Secured by Razorpay • UPI, Card, Netbanking, Wallets</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setRpayOverlayOpen(false);
                      onNotify('Razorpay payment cancelled by user.');
                    }}
                    className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Razorpay active details summary */}
                <div className="bg-[#F4F6F9] px-4 py-2.5 border-b border-slate-200 flex justify-between items-center text-[10px] shrink-0 font-sans">
                  <div>
                    <span className="block text-[7px] text-slate-400 uppercase font-bold tracking-wide">Purpose</span>
                    <span className="font-extrabold text-slate-800 truncate max-w-[170px] inline-block mt-0.5">
                      {rpayPurpose === 'wallet_topup' ? 'Refill Nulac Secure Wallet' : 'Direct Checkout Order Payment'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[7px] text-slate-400 uppercase font-bold tracking-wide">Amount Due</span>
                    <span className="text-xs font-black text-[#1D2B44] inline-block mt-0.5">₹{rpayAmount}.00</span>
                  </div>
                </div>

                {/* Razorpay Step 1: Selector View */}
                {rpayStep === 'select' && (
                  <div className="p-4 flex-1 space-y-4">
                    
                    {/* Method Navigation tabs */}
                    <div className="grid grid-cols-4 gap-1 bg-slate-150/60 p-1 rounded-xl border border-slate-200 shrink-0">
                      {[
                        { id: 'upi', label: 'UPI / APPS' },
                        { id: 'card', label: 'CARDS' },
                        { id: 'netbanking', label: 'NET BANK' },
                        { id: 'wallet', label: 'WALLETS' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setRpayMethod(m.id as any)}
                          className={`py-1 rounded-lg text-[7.5px] font-black tracking-wide text-center uppercase transition-all ${
                            rpayMethod === m.id 
                              ? 'bg-[#3399cc] text-white shadow-xs' 
                              : 'text-slate-500 hover:text-slate-800 cursor-pointer'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    {/* Method 1: UPI selection details */}
                    {rpayMethod === 'upi' && (
                      <div className="space-y-3 font-sans animate-in fade-in duration-200">
                        <span className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400">Choose Popular UPI App</span>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'gpay', label: 'Google Pay', icon: 'raaahull2003@okaxis', badge: 'GPay' },
                            { id: 'phonepe', label: 'PhonePe', icon: 'raaahull2003@ybl', badge: 'PPe' },
                            { id: 'paytm', label: 'Paytm UPI', icon: '9845329821@paytm', badge: 'Paytm' }
                          ].map((u) => (
                            <button
                              key={u.id}
                              onClick={() => setRpayUpiId(u.icon)}
                              className={`p-2 rounded-xl text-left border flex items-center space-x-2 text-[9.5px] font-bold transition-colors ${
                                rpayUpiId === u.icon 
                                  ? 'border-[#3399cc] bg-blue-50/40 text-blue-900' 
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer'
                              }`}
                            >
                              <div className="w-5 h-5 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center font-black text-[#3399cc] text-[7.5px] shrink-0 uppercase">
                                {u.badge}
                              </div>
                              <div className="min-w-0 pr-1">
                                <div className="leading-none text-[9px] font-black truncate">{u.label}</div>
                                <div className="text-[7.5px] text-slate-400 truncate mt-1">{u.icon}</div>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div>
                          <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                            Or Enter manual UPI VPA Address
                          </label>
                          <input
                            type="text"
                            className="bg-neutral-50/50 border border-neutral-200 rounded-lg py-1.8 px-3 text-xs w-full focus:outline-none focus:border-[#3399cc]"
                            value={rpayUpiId}
                            onChange={(e) => setRpayUpiId(e.target.value)}
                            placeholder="raaahull2003@okaxis"
                          />
                        </div>
                      </div>
                    )}

                    {/* Method 2: Cards payment details */}
                    {rpayMethod === 'card' && (
                      <div className="space-y-3 font-sans animate-in fade-in duration-200">
                        <div>
                          <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                            Credit / Debit Card Number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="bg-neutral-50/50 border border-neutral-200 rounded-lg py-1.8 pl-3 pr-8 text-xs w-full focus:outline-none focus:border-[#3399cc] font-mono"
                              value={rpayCardNo}
                              onChange={(e) => setRpayCardNo(e.target.value)}
                              placeholder="4111 1111 1111 1111"
                            />
                            <CreditCard className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                              Expiration (MM/YY)
                            </label>
                            <input
                              type="text"
                              className="bg-neutral-50/50 border border-neutral-200 rounded-lg py-1.8 px-3 text-xs w-full focus:outline-none focus:border-[#3399cc] font-mono"
                              value={rpayCardExpiry}
                              onChange={(e) => setRpayCardExpiry(e.target.value)}
                              placeholder="12/28"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                              CVC / CVV Code
                            </label>
                            <input
                              type="password"
                              maxLength={3}
                              className="bg-neutral-50/50 border border-neutral-200 rounded-lg py-1.8 px-3 text-xs w-full focus:outline-none focus:border-[#3399cc] font-mono"
                              value={rpayCardCvv}
                              onChange={(e) => setRpayCardCvv(e.target.value)}
                              placeholder="***"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                            Cardholder Complete Name
                          </label>
                          <input
                            type="text"
                            className="bg-neutral-50/50 border border-neutral-200 rounded-lg py-1.8 px-3 text-xs w-full focus:outline-none focus:border-[#3399cc]"
                            value={rpayCardName}
                            onChange={(e) => setRpayCardName(e.target.value)}
                            placeholder="Rahul"
                          />
                        </div>
                      </div>
                    )}

                    {/* Method 3: Net Banking selection */}
                    {rpayMethod === 'netbanking' && (
                      <div className="space-y-3 font-sans animate-in fade-in duration-200">
                        <span className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400">Choose Popular Bank</span>
                        <div className="grid grid-cols-3 gap-1.5 min-h-[96px]">
                          {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                            <button
                              key={b}
                              onClick={() => setRpayBank(b)}
                              className={`py-2 px-1 text-center border rounded-lg text-[7.5px] font-black leading-tight transition-all select-none ${
                                rpayBank === b 
                                  ? 'border-[#3399cc] bg-blue-50/40 text-[#1D2B44] font-extrabold shadow-3xs' 
                                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Method 4: Wallets selection */}
                    {rpayMethod === 'wallet' && (
                      <div className="space-y-3 font-sans animate-in fade-in duration-200">
                        <span className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400">Choose Digital Wallet</span>
                        <div className="grid grid-cols-2 gap-2">
                          {['Razorpay Wallet', 'PhonePe Wallet', 'Paytm Wallet', 'Amazon Pay Wallet'].map((w) => (
                            <button
                              key={w}
                              onClick={() => setRpayWallet(w)}
                              className={`p-2 border rounded-xl flex items-center space-x-2 text-[9px] font-extrabold transition-colors select-none ${
                                rpayWallet === w 
                                  ? 'border-[#3399cc] bg-blue-50/40 text-[#1D2B44] shadow-3xs' 
                                  : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50 cursor-pointer'
                              }`}
                            >
                              <div className="w-5 h-5 rounded-md bg-sky-50 border border-sky-100 flex items-center justify-center font-black text-[#3399cc] text-[7.5px] uppercase shrink-0">WL</div>
                              <span className="truncate">{w}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PCI Secure Connection Badge */}
                    <div className="bg-[#E8F0EC]/50 rounded-xl p-2.5 flex items-center justify-between text-[7.5px] text-[#1B4D3E] font-bold border border-[#1B4D3E]/10 shrink-0 select-none">
                      <span className="flex items-center text-[7.5px]">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#2E8B57]" />
                        100% Secure Encrypted Connection
                      </span>
                      <span className="font-mono text-slate-400">Razorpay Safeguard®</span>
                    </div>

                    {/* Simulation Outcome Controls Toggle (Crucial!) */}
                    <div className="bg-amber-500/10 rounded-xl p-2.5 border border-amber-500/15 text-[8px] text-amber-900 leading-normal font-bold">
                      <span className="font-black block uppercase tracking-widest text-amber-800 text-[8.5px] mb-1">Gateway testing toggle</span>
                      Toggle the simulation outcome below to inspect both success flow callback routines and custom transaction error logs:
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRpayErrorReason(null);
                            onNotify("Razorpay Simulation set to: IMMEDIATE SUCCESS");
                          }}
                          className={`py-1 rounded-lg text-[7px] font-black uppercase border transition-colors select-none cursor-pointer ${
                            rpayErrorReason === null 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          Simulate Success ✅
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRpayErrorReason("Signature validation failed or invalid OTP verified");
                            onNotify("Razorpay Simulation set to: BANK TRANSACTION REJECTION");
                          }}
                          className={`py-1 rounded-lg text-[7px] font-black uppercase border transition-colors select-none cursor-pointer ${
                            rpayErrorReason !== null 
                              ? 'bg-red-600 text-white border-red-600' 
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          Simulate Failure ❌
                        </button>
                      </div>
                    </div>

                    {/* Bottom main proceed check CTA */}
                    <button
                      onClick={() => {
                        setRpayStep('processing');
                        
                        // Simulate network transmission delay
                        setTimeout(() => {
                          const isSuccess = rpayErrorReason === null;
                          const dateStr = new Date().toLocaleString('en-IN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          });

                          const txId = 'pay_NLC' + Math.floor(100000000 + Math.random() * 900000000);
                          const detailStr = 
                            rpayMethod === 'upi' ? `UPI: ${rpayUpiId}` :
                            rpayMethod === 'card' ? `Card ending **${rpayCardNo.slice(-4) || '1111'}` :
                            rpayMethod === 'netbanking' ? `NetBanking: ${rpayBank}` :
                            `Wallet: ${rpayWallet}`;

                          const newTx: RazorpayTransaction = {
                            id: txId,
                            amount: rpayAmount,
                            paymentMethod: rpayMethod,
                            methodDetail: detailStr,
                            status: isSuccess ? 'captured' : 'failed',
                            date: dateStr,
                            purpose: rpayPurpose
                          };

                          // Append to transactions array
                          setRazorpayTransactions(prev => [newTx, ...prev]);

                          if (isSuccess) {
                            if (rpayPurpose === 'wallet_topup') {
                              setWalletBalance(prev => prev + rpayAmount);
                              onNotify(`₹${rpayAmount} wallet refill successfully processed via Razorpay!`);
                            } else {
                              // direct_checkout order placement
                              const finalPrice = getGrandTotal();
                              const directOrder: Order = {
                                id: 'NLC-' + Math.floor(100000 + Math.random() * 900000),
                                items: [...cart],
                                total: finalPrice,
                                deliveryAddress: userAddress,
                                deliverySlot: deliverySlot,
                                deliveryFrequency: deliveryFrequency,
                                date: new Date().toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                }),
                                status: 'pending'
                              };

                              setRecentOrder(directOrder);
                              setOrdersHistory([directOrder, ...ordersHistory]);
                              setCart([]);
                              setPromoApplied(false);
                              setDeliveryStep(0);
                              setCurrentScreen('success');
                              onNotify(`Order placed successfully using direct Razorpay payment!`);

                              // FCM dispatch triggers
                              setTimeout(() => {
                                triggerFcmNotification(
                                  '🌱 Razorpay Payment Sourced!',
                                  `Your A2 product catalog (${directOrder.id}) has been placed and locked for slot: ${directOrder.deliverySlot}.`,
                                  'order_updates'
                                );
                              }, 1500);
                            }
                            
                            setRpayStep('success');

                            // Close dialog overlay smoothly after showing success
                            setTimeout(() => {
                              setRpayOverlayOpen(false);
                            }, 2200);

                          } else {
                            // Failure state processing
                            setRpayStep('failed');
                            onNotify("Razorpay transaction rejected. Logs saved to ledger.");
                          }

                        }, 1800);
                      }}
                      className="w-full bg-[#1D2B44] hover:bg-[#152033] text-white text-[11px] font-black py-4 rounded-xl leading-none uppercase shadow-md flex items-center justify-center space-x-1.5 transition-colors select-none cursor-pointer"
                    >
                      <span>Pay Securely ₹{rpayAmount}.00</span>
                    </button>

                  </div>
                )}

                {/* Razorpay Step 2: Processing state spinner */}
                {rpayStep === 'processing' && (
                  <div className="p-8 text-center flex flex-col items-center justify-center space-y-4 font-sans select-none">
                    <div className="relative flex items-center justify-center">
                      <div className="w-11 h-11 border-4 border-slate-100 border-t-[#3399cc] rounded-full animate-spin" />
                      <span className="absolute font-black text-xs text-[#3399cc] animate-pulse">R</span>
                    </div>
                    <div>
                      <h4 className="text-[10.5px] font-black text-slate-800 uppercase tracking-widest">Processing Transaction</h4>
                      <p className="text-[9px] text-slate-400 mt-1 max-w-[200px] leading-normal font-semibold">
                        Validating payment credentials with issuer bank via secure routing logic. Please do not reload.
                      </p>
                    </div>
                  </div>
                )}

                {/* Razorpay Step 3: Captured Success state details */}
                {rpayStep === 'success' && (
                  <div className="p-8 text-center flex flex-col items-center justify-center space-y-4 font-sans animate-in fade-in duration-200 select-none">
                    <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-500 text-emerald-600 shadow-inner">
                      <Check className="w-5.5 h-5.5 stroke-[3.5]" />
                    </div>
                    <div>
                      <h4 className="text-[10.5px] font-black text-emerald-800 uppercase tracking-widest">Payment Captured!</h4>
                      <p className="text-[9px] text-slate-400 mt-1 max-w-[200px] leading-normal font-semibold">
                        Funds transferred successfully. Authorised sequence logged inside Razorpay.
                      </p>
                    </div>
                  </div>
                )}

                {/* Razorpay Step 4: Refund/declined failure state details */}
                {rpayStep === 'failed' && (
                  <div className="p-8 text-center flex flex-col items-center justify-center space-y-4 font-sans animate-in fade-in duration-200 select-none">
                    <div className="w-11 h-11 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-500 text-red-600 shadow-inner">
                      <X className="w-5.5 h-5.5 stroke-[3.5]" />
                    </div>
                    <div>
                      <h4 className="text-[10.5px] font-black text-red-800 uppercase tracking-widest">Transaction Declined!</h4>
                      <div className="text-[9px] text-red-700 bg-red-50/50 hover:bg-red-50 font-bold px-2 py-1 border border-red-100 rounded-lg mt-1 leading-relaxed max-w-[210px] mx-auto">
                        Reason: {rpayErrorReason}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4 max-w-[210px] mx-auto">
                        <button
                          onClick={() => setRpayStep('select')}
                          className="bg-[#1D2B44] hover:bg-[#152033] text-white text-[8px] font-black py-2 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Re-attempt
                        </button>
                        <button
                          onClick={() => setRpayOverlayOpen(false)}
                          className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-[8px] font-bold py-2 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Repository Connectivity & WebView Fallback controls */}
          {currentScreen !== 'splash' && currentScreen !== 'auth' && (
            <div className="bg-slate-900 border-b border-white/15 px-3 py-1.5 flex items-center justify-between text-[8px] text-slate-100 z-40 relative tracking-wide shrink-0 font-mono">
              <div className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${repoStatus.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
                <span className="text-slate-350">
                  {repoStatus.isLive 
                    ? 'API: LIVE (https://nulac.in)' 
                    : 'API: CORS BLOCKED (Seeded Fallback)'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {connectionError && (
                  <span className="bg-amber-950/40 text-amber-300 font-bold px-1 rounded hover:scale-95 transition-transform cursor-help mr-0.5" title={connectionError}>
                    CORS
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setUseWebViewFallback(!useWebViewFallback)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer font-bold transition-all text-[7.5px] uppercase ${
                    useWebViewFallback 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white/10 hover:bg-white/20 text-slate-300'
                  }`}
                >
                  {useWebViewFallback ? '✓ WEBVIEW' : 'WebView Fallback'}
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Loading Overlay for Products and Blogs */}
          {(isLoadingProducts || isLoadingBlogs) && currentScreen !== 'splash' && currentScreen !== 'auth' && (
            <div className="absolute inset-x-0 top-18 bottom-0 bg-white/95 backdrop-blur-xs z-35 flex flex-col items-center justify-center text-center p-6 transition-all">
              <div className="relative mb-3 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <Milk className="w-4.5 h-4.5 text-emerald-700 absolute animate-pulse" />
              </div>
              <p className="text-xs font-bold text-slate-800">Connecting nulac.in Dynamic Database...</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] font-sans font-medium">Resolving certified products & blogs via secure repository client.</p>
            </div>
          )}

          {/* HIGH-FIDELITY PREMIUM SKELETON SCREEN TRANSITIONS */}
          {isScreenLoading && currentScreen !== 'splash' && currentScreen !== 'auth' && (
            <div className="absolute inset-x-0 top-0 bottom-0 bg-white z-40 p-4 space-y-4 animate-pulse select-none flex flex-col">
              
              {/* Premium Top Navigation Dummy Header */}
              <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <div className="space-y-1">
                    <div className="h-3 w-28 bg-slate-200 rounded-md" />
                    <div className="h-2 w-16 bg-slate-200 rounded-md" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200" />
                  <div className="w-7 h-7 rounded-full bg-slate-200" />
                </div>
              </div>

              {currentScreen === 'home' ? (
                <div className="space-y-5 flex-1 flex flex-col">
                  {/* Banner skeleton */}
                  <div className="h-36 bg-slate-200 rounded-2xl relative overflow-hidden flex flex-col justify-end p-4">
                    <div className="h-3 w-16 bg-slate-300 rounded mb-1.5" />
                    <div className="h-5 w-40 bg-slate-300 rounded mb-1.5" />
                    <div className="h-3.5 w-24 bg-slate-300 rounded-full" />
                  </div>

                  {/* Gold Member club skeleton */}
                  <div className="h-14 bg-slate-100 border border-slate-200/50 rounded-xl flex items-center justify-between p-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 bg-slate-200 rounded" />
                        <div className="h-2 w-32 bg-slate-200 rounded" />
                      </div>
                    </div>
                    <div className="h-6 w-16 bg-slate-200 rounded-lg" />
                  </div>

                  {/* Categories Row */}
                  <div className="space-y-2">
                    <div className="h-3.5 w-28 bg-slate-200 rounded font-bold" />
                    <div className="grid grid-cols-4 gap-2.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center space-y-1.5">
                          <div className="w-10 h-10 bg-slate-200 rounded-2xl" />
                          <div className="h-2.5 w-10 bg-slate-200 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured List heading */}
                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center">
                      <div className="h-3.5 w-24 bg-slate-200 rounded" />
                      <div className="h-3 w-12 bg-slate-200 rounded-full" />
                    </div>
                    <div className="flex space-x-3 overflow-hidden">
                      {[1, 2].map((i) => (
                        <div key={i} className="w-36 bg-slate-100 border border-slate-150/40 p-3 rounded-2xl flex flex-col justify-between space-y-3 shrink-0">
                          <div className="h-24 bg-slate-200 rounded-xl" />
                          <div className="space-y-1.5">
                            <div className="h-2.5 w-20 bg-slate-200 rounded" />
                            <div className="h-2 w-10 bg-slate-200 rounded" />
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="h-3.5 w-8 bg-slate-200 rounded" />
                            <div className="w-6 h-6 bg-slate-200 rounded-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : currentScreen === 'products' ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Search bar placeholder */}
                  <div className="h-9 bg-slate-200 rounded-xl" />
                  
                  {/* Category Filter Pills */}
                  <div className="flex space-x-1.5 overflow-hidden shrink-0">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-7 w-16 bg-slate-200 rounded-full shrink-0" />
                    ))}
                  </div>

                  {/* Food Products Catalog Grid */}
                  <div className="grid grid-cols-2 gap-3 flex-1 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-slate-100 p-2.5 rounded-2xl flex flex-col justify-between space-y-2">
                        <div className="h-24 bg-slate-200 rounded-xl" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-3/4 bg-slate-200 rounded" />
                          <div className="h-2 w-1/2 bg-slate-200 rounded" />
                        </div>
                        <div className="flex justify-between items-center pt-1.5">
                          <div className="h-3 w-8 bg-slate-200 rounded" />
                          <div className="h-6 w-14 bg-slate-300 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 flex-1">
                  <div className="h-5 w-1/3 bg-slate-200 rounded-md" />
                  <div className="h-44 bg-slate-100 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-3.5 w-1/4 bg-slate-200 rounded" />
                      <div className="h-3 w-1/2 bg-slate-250 rounded" />
                    </div>
                    <div className="h-8 w-full bg-slate-200 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-100 rounded" />
                    <div className="h-3 w-full bg-slate-100 rounded" />
                    <div className="h-3 w-2/3 bg-slate-100 rounded" />
                  </div>
                  <div className="h-10 bg-slate-200 rounded-xl mt-6" />
                </div>
              )}

              {/* Secure Footprint Tracker */}
              <div className="text-center pt-2 border-t border-slate-100">
                <span className="text-[7.5px] uppercase tracking-widest text-slate-400 font-extrabold flex items-center justify-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                  SECURED COLD-CHAIN INTEGRITY CHECK • BANGALORE EAST
                </span>
              </div>
            </div>
          )}

          {/* MOCK WEBVIEW FALLBACK INTERFACE */}
          {useWebViewFallback && currentScreen !== 'splash' && currentScreen !== 'auth' && (
            <div className="absolute inset-x-0 top-18 bottom-12 bg-white flex flex-col z-30 transition-all font-sans">
              {/* Browser navigation and toolbar */}
              <div className="bg-slate-100 px-3 py-2 flex items-center space-x-1.5 border-b border-slate-200 select-none">
                <div className="flex space-x-1">
                  <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                </div>
                {/* Search / URL input bar */}
                <div className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[8.5px] text-slate-600 flex items-center justify-between font-mono truncate">
                  <span className="truncate">https://nulac.in/collections/all</span>
                  <span className="text-[7.5px] bg-emerald-50 text-emerald-700 font-extrabold px-1 rounded border border-emerald-100">SECURE</span>
                </div>
                <button 
                  onClick={() => {
                    onNotify("Refreshing dynamic WebView framework!");
                    const iframe = document.getElementById('nulac-iframe') as HTMLIFrameElement;
                    if (iframe) iframe.src = iframe.src;
                  }}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                  title="Reload"
                >
                  <RefreshCw className="w-3 h-3 text-slate-500 hover:text-slate-800 cursor-pointer" />
                </button>
              </div>

              {/* WebView notification alert */}
              <div className="bg-slate-50 border-b border-slate-200 p-3.5 text-[9.5px] text-slate-600 font-medium leading-normal shrink-0">
                <p className="text-slate-800 font-bold mb-0.5 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 inline-block"></span>
                  Active Frame Webview Proxy
                </p>
                The dynamic REST fetch failed because direct external requests are CORS-blocked in standard browsers. We have automatically fallback loaded the official responsive website below:
                <div className="mt-2 flex gap-2">
                  <a 
                    href="https://nulac.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded text-[8px] uppercase tracking-wider hover:bg-emerald-750 inline-block"
                  >
                    Open Live Site ↗
                  </a>
                  <button 
                    onClick={() => {
                      setUseWebViewFallback(false);
                      onNotify("Swapped to offline high-fidelity simulator.");
                    }}
                    className="border border-slate-300 text-slate-700 bg-white font-semibold px-2.5 py-1 rounded text-[8px] hover:bg-slate-100 cursor-pointer"
                  >
                    Use High-Fi Sandbox
                  </button>
                </div>
              </div>

              {/* HTML IFrame displaying original website */}
              <div className="flex-1 w-full bg-slate-50 relative">
                <iframe 
                  id="nulac-iframe"
                  src="https://nulac.in" 
                  className="absolute inset-0 w-full h-full border-none bg-white"
                  title="Nulac Live Website"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>

              {/* Back to App trigger footer */}
              <div className="p-3 bg-white border-t border-slate-200 text-center shrink-0">
                <button
                  type="button"
                  onClick={() => setUseWebViewFallback(false)}
                  className="bg-emerald-600 text-white font-bold text-[10px] py-2 w-full rounded-lg hover:bg-emerald-700 tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  ← Return to Local Native Mobile App
                </button>
              </div>
            </div>
          )}

          {/* SPLASH SCREEN */}
          {currentScreen === 'splash' && (
            <div id="screen-splash" className="flex-1 bg-[#1B4D3E] flex flex-col items-center justify-between py-16 px-6 text-white text-center">
              <div className="flex-1 flex flex-col items-center justify-center">
                {/* Custom Vector Badge styling */}
                <div className="w-24 h-24 bg-white/15 backdrop-blur-md border border-white/30 rounded-3xl flex items-center justify-center mb-6 shadow-inner animate-pulse">
                  <Milk className="w-12 h-12 text-[#D4AF37]" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-widest font-mono text-white mb-2">
                  NULAC
                </h1>
                <div className="h-0.5 w-16 bg-[#D4AF37] my-3" />
                <p className="text-xs text-[#E8F0EC]/80 uppercase tracking-widest leading-loose font-medium">
                  Pure • Fresh • Farm Direct
                </p>
              </div>
              <div className="w-full max-w-[200px]">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#D4AF37] animate-[shimmer_2s_infinite_linear]" style={{ width: '80%' }} />
                </div>
                <p className="text-[10px] text-emerald-100/75">Gathering farm testing scores...</p>
              </div>
            </div>
          )}

          {/* AUTHENTICATION PATHWAYS GATEWAY */}
          {currentScreen === 'auth' && (
            <div id="screen-auth" className="flex-1 bg-white flex flex-col justify-between p-6 relative">
              {/* Main Auth Container */}
              <div className="flex-1 flex flex-col justify-center my-auto">
                {/* Brand Visual Signifier */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#E8F0EC] rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <Milk className="w-8 h-8 text-[#1B4D3E]" />
                  </div>
                  <h2 className="text-2xl font-black text-[#1B4D3E] tracking-tight font-sans">
                    Welcome to Nulac
                  </h2>
                  <p className="text-[10px] text-slate-500 font-sans tracking-wide mt-1 max-w-[250px] mx-auto leading-normal">
                    Farm-to-glass raw A2 milk, slow-cooked Vedic ghee, and organic dairy direct to your doorstep.
                  </p>
                </div>

                {!isVerifyingOtp ? (
                  /* Standard Login Panel: Enter Mobile or Google Sign-In */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                        Mobile Number (India)
                      </label>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-[#2E8B57] focus-within:bg-white transition-all">
                        <span className="text-xs font-bold text-slate-500 mr-2 flex items-center">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          pattern="[0-9]*"
                          maxLength={10}
                          placeholder="98765 43210"
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                          className="bg-transparent text-xs text-slate-800 font-bold focus:outline-none w-full"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (loginPhone.length !== 10) {
                          onNotify('Invalid Mobile Number. Please specify a 10-digit primary contact phone.');
                          return;
                        }
                        const otp = Math.floor(1000 + Math.random() * 9000).toString();
                        setGeneratedOtp(otp);
                        setIsVerifyingOtp(true);
                        setOtpTimer(30);
                        setEnteredOtp('');
                        onNotify(`Verification code dispatched! Secure Nulac OTP is [ ${otp} ]. Please enter it below.`);
                      }}
                      className="w-full bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-black py-3 rounded-xl tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                    >
                      Verify with Mobile OTP
                    </button>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-1 border-t border-slate-200"></div>
                      <span className="flex-none mx-3 text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">
                        OR SECURE PORTALS
                      </span>
                      <div className="flex-1 border-t border-slate-200"></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowGoogleChooser(true)}
                      className="w-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-3 px-4 rounded-xl border border-slate-200 transition-all flex items-center justify-center space-x-2.5 shadow-3xs cursor-pointer"
                    >
                      {/* Google G visual emblem structure */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const guestSession: UserSession = {
                          isLoggedIn: false,
                          isGuest: true,
                          name: 'Guest Customer',
                          phone: '',
                          createdAt: new Date().toISOString()
                        };
                        nulacRepository.saveSession(guestSession);
                        setSession(guestSession);
                        setCurrentScreen('home');
                        onNotify('Continuing as Guest. Registration bypassed.');
                      }}
                      className="w-full text-center bg-[#E8F0EC] hover:bg-[#dbe7e1] text-[#1B4D3E] text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Bypass to Guest Checkout
                    </button>
                  </div>
                ) : (
                  /* OTP Verification Form */
                  <div className="space-y-4">
                    <div className="text-center mb-2">
                      <span className="text-[10px] text-emerald-700 bg-[#E8F0EC] font-bold px-3 py-1 rounded-full mb-1 inline-block">
                        OTP DISPATCHED
                      </span>
                      <p className="text-[11px] text-slate-500 font-sans">
                        Digit code delivered to <strong className="text-slate-800 font-extrabold">+91 {loginPhone}</strong>
                      </p>
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 text-center">
                        Input Verification Code
                      </label>
                      
                      <div className="flex justify-center space-x-2.5">
                        {[0, 1, 2, 3].map((idx) => {
                          const val = enteredOtp[idx] || '';
                          return (
                            <input
                              key={idx}
                              id={`otp-box-${idx}`}
                              type="tel"
                              maxLength={1}
                              value={val}
                              onChange={(e) => {
                                const char = e.target.value.replace(/\D/g, '');
                                if (char) {
                                  let nextOtp = enteredOtp;
                                  if (idx >= nextOtp.length) {
                                    nextOtp += char;
                                  } else {
                                    const arr = nextOtp.split('');
                                    arr[idx] = char;
                                    nextOtp = arr.join('');
                                  }
                                  setEnteredOtp(nextOtp.slice(0, 4));
                                  // Auto focus next box
                                  if (idx < 3) {
                                    const nextInput = document.getElementById(`otp-box-${idx + 1}`);
                                    if (nextInput) nextInput.focus();
                                  }
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace') {
                                  // Clear current or predecessor box
                                  if (enteredOtp[idx]) {
                                    setEnteredOtp(enteredOtp.slice(0, idx));
                                  } else if (idx > 0) {
                                    setEnteredOtp(enteredOtp.slice(0, idx - 1));
                                    const prevInput = document.getElementById(`otp-box-${idx - 1}`);
                                    if (prevInput) prevInput.focus();
                                  }
                                }
                              }}
                              className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-extrabold text-slate-800 focus:outline-none focus:border-[#2E8B57] focus:bg-white transition-all shadow-inner"
                            />
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (enteredOtp.length !== 4) {
                          onNotify('Please specify the full 4-digit verification code.');
                          return;
                        }
                        if (enteredOtp !== generatedOtp) {
                          onNotify('OTP Verification Mismatch! Please verify or check the notification code.');
                          return;
                        }

                        const userSession: UserSession = {
                          isLoggedIn: true,
                          isGuest: false,
                          name: 'Rahul Kumar',
                          phone: loginPhone,
                          createdAt: new Date().toISOString()
                        };
                        nulacRepository.saveSession(userSession);
                        setSession(userSession);
                        setCurrentScreen('home');
                        onNotify('Mobile number registered and verified successfully!');
                      }}
                      className="w-full bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-black py-3 rounded-xl tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                    >
                      Verify & Log In
                    </button>

                    <div className="flex justify-between items-center text-[10px] px-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsVerifyingOtp(false);
                          setEnteredOtp('');
                        }}
                        className="text-slate-500 hover:text-slate-800 font-semibold"
                      >
                        ← Edit Phone Number
                      </button>

                      {otpTimer > 0 ? (
                        <span className="text-slate-400">Resend in {otpTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const otp = Math.floor(1000 + Math.random() * 9000).toString();
                            setGeneratedOtp(otp);
                            setOtpTimer(30);
                            setEnteredOtp('');
                            onNotify(`New code dispatched! Use secure OTP: [ ${otp} ]`);
                          }}
                          className="text-[#2E8B57] hover:underline font-extrabold"
                        >
                          Resend OTP Code
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Secure certification seal */}
              <div className="text-center text-[8.5px] text-slate-400 mt-6 font-mono tracking-wider flex items-center justify-center space-x-1.5 select-none shrink-0 border-t border-slate-100 pt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>NULAC SECURE TRANSACTION SHIELD • 256-BIT SSL</span>
              </div>

              {/* GOOGLE ACCOUNTS CHOOSER OVERLAY DIALOG */}
              {showGoogleChooser && (
                <div className="absolute inset-0 bg-[#000000]/65 flex flex-col justify-end z-50 transition-all font-sans">
                  <div className="bg-white rounded-t-3xl p-5 shadow-2xl animate-[slideUp_0.25s_ease-out] flex flex-col space-y-4">
                    {/* Header and dismiss */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1.5">
                        {/* Custom Google Visual G */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span className="text-[11.5px] font-bold text-slate-800">Sign in with Google</span>
                      </div>
                      <button
                        onClick={() => setShowGoogleChooser(false)}
                        className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
                      >
                        <X className="w-4 h-4 cursor-pointer" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-slate-900 leading-tight">Choose an account</h4>
                      <p className="text-[10px] text-slate-400">to continue to <strong className="text-slate-600 font-semibold">Nulac Dairy</strong></p>
                    </div>

                    {/* Google accounts selectors list */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {[
                        { name: 'Rahul Kumar', email: 'raaahull2003@gmail.com', avatar: 'RK', color: 'bg-emerald-600', phone: '9876543210' },
                        { name: 'Deepika Sen', email: 'deepika.sen@gmail.com', avatar: 'DS', color: 'bg-indigo-600', phone: '9988776655' },
                        { name: 'Siddharth Roy', email: 'sidd.roy@gmail.com', avatar: 'SR', color: 'bg-amber-600', phone: '9123456789' }
                      ].map((acc, key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            const newSession: UserSession = {
                              isLoggedIn: true,
                              isGuest: false,
                              name: acc.name,
                              phone: acc.phone,
                              email: acc.email,
                              avatarUrl: acc.avatar,
                              createdAt: new Date().toISOString()
                            };
                            nulacRepository.saveSession(newSession);
                            setSession(newSession);
                            setShowGoogleChooser(false);
                            setCurrentScreen('home');
                            onNotify(`Signed in securely via Google Account: ${acc.email}!`);
                          }}
                          className="w-full flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                        >
                          <div className={`w-8 h-8 rounded-full ${acc.color} text-white font-extrabold text-xs flex items-center justify-center shrink-0`}>
                            {acc.avatar}
                          </div>
                          <div className="flex-1 truncate">
                            <span className="block text-[11px] font-bold text-slate-800 leading-tight">{acc.name}</span>
                            <span className="block text-[9px] text-slate-400 leading-normal truncate">{acc.email}</span>
                          </div>
                        </button>
                      ))}

                      {/* Custom input node option */}
                      <button
                        type="button"
                        onClick={() => {
                          const customEmail = window.prompt("Enter your Google Account email address:", "engineer@google.com");
                          if (customEmail) {
                            const parsedName = customEmail.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                            const customSession: UserSession = {
                              isLoggedIn: true,
                              isGuest: false,
                              name: parsedName || 'Custom User',
                              phone: '9000010000',
                              email: customEmail,
                              avatarUrl: 'CU',
                              createdAt: new Date().toISOString()
                            };
                            nulacRepository.saveSession(customSession);
                            setSession(customSession);
                            setShowGoogleChooser(false);
                            setCurrentScreen('home');
                            onNotify(`Signed in securely via custom Google portal account: ${customEmail}!`);
                          }
                        }}
                        className="w-full flex items-center space-x-3 p-2.5 rounded-xl border border-dashed border-slate-200 hover:bg-slate-50 text-left transition-all text-xs font-semibold text-slate-650 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                          +
                        </div>
                        <span>Use another account</span>
                      </button>
                    </div>

                    <p className="text-[8.5px] leading-relaxed text-slate-400 font-sans mt-1">
                      To continue, Google will share your name, email address, language preference, and profile picture with Nulac Dairy. See Nulac's <strong className="font-semibold text-slate-500">Privacy Policy</strong> and <strong className="font-semibold text-slate-500">Terms of Service</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HOME SCREEN */}
          {currentScreen === 'home' && (
            <motion.div
              id="screen-home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col pb-16"
            >
              {/* Premium Top App Bar */}
              <div className="bg-white px-5 py-4 flex justify-between items-center shadow-xs border-b border-neutral-100 sticky top-0 z-30">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#1B4D3E] flex items-center justify-center text-white text-xs font-bold font-mono">
                    N
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-800 tracking-wider">NULAC DAIRY</h2>
                    <span className="text-[9px] text-[#2E8B57] flex items-center">
                      <MapPin className="w-2.5 h-2.5 mr-0.5" /> Bangalore East
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentScreen('cart')}
                    className="p-1.5 relative bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#1B4D3E]" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#2E8B57] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {cart.reduce((s, i) => s + i.quantity, 0)}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setCurrentScreen('profile')}
                    className="p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                  >
                    <User className="w-4 h-4 text-[#1B4D3E]" />
                  </button>
                </div>
              </div>

              {/* Banner Slider Section */}
              <div className="px-4 mt-3">
                <div className={`relative h-40 bg-gradient-to-br ${banners[bannerIdx].color} rounded-2xl overflow-hidden p-5 flex flex-col justify-between shadow-md`}>
                  <div className="absolute right-[-10px] bottom-[-20px] opacity-25">
                    <Milk className="w-32 h-32 text-white" />
                  </div>
                  <div>
                    <span className="text-[8px] font-bold tracking-widest text-[#D4AF37] bg-white/10 px-2 py-0.5 rounded-full uppercase">
                      {banners[bannerIdx].badge}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">
                      {banners[bannerIdx].title}
                    </h3>
                    <p className="text-[10px] text-slate-100/80 mt-1 max-w-[200px]">
                      {banners[bannerIdx].desc}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-2 z-10">
                    <button
                      onClick={() => setCurrentScreen('products')}
                      className="bg-white text-[#1B4D3E] text-[10px] font-bold px-3 py-1 rounded-full shadow-xs hover:bg-slate-50 transition-colors"
                    >
                      Shop Collection
                    </button>
                    <div className="flex space-x-1">
                      {banners.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            idx === bannerIdx ? 'bg-white w-3' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Gold Club Promotion Banner */}
              <div className="mx-4 mt-4 bg-[#FDFBF2] border border-[#D4AF37]/40 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-[#F6ECC0] rounded-lg">
                    <Award className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-[#1B4D3E] tracking-tight">NULAC GOLD CLUB</h4>
                    <p className="text-[9px] text-slate-500 max-w-[170px]">
                      Daily schedules & free shipping on luxury dairy.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentScreen('subscription')}
                  className="bg-[#1B4D3E] text-white text-[9px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#143B2F] transition-colors whitespace-nowrap"
                >
                  Join Club
                </button>
              </div>

              {/* Category Quick Navigation */}
              <div className="mt-4 px-4">
                <div className="flex justify-between items-center mb-2.5">
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Premium Categories</h3>
                  <button onClick={() => { setActiveCategory('all'); setCurrentScreen('products'); }} className="text-xs text-[#2E8B57] font-semibold hover:underline">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'milk', label: 'Cow Milk', icon: Milk },
                    { id: 'ghee', label: 'Vedic Ghee', icon: Sparkles },
                    { id: 'paneer', label: 'Paneer', icon: BoxGridShape },
                    { id: 'dahi', label: 'Set Dahi', icon: TrendingUp }
                  ].map((category) => {
                    const CatIcon = category.icon || Milk;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id as any);
                          setCurrentScreen('products');
                        }}
                        className="bg-white p-2.5 rounded-xl border border-neutral-100 flex flex-col items-center justify-center hover:bg-neutral-50 shadow-2xs group transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#E8F0EC] group-hover:bg-[#1B4D3E] transition-colors flex items-center justify-center mb-1.5">
                          <CatIcon className="w-5 h-5 text-[#1B4D3E] group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-700 whitespace-nowrap">{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Featured Products Mini Slider */}
              <div className="mt-5 px-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Featured Fresh</h3>
                  <span className="text-[10px] text-[#2E8B57] font-medium bg-[#E8F0EC] px-2 py-0.5 rounded-full">Organic Only</span>
                </div>
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                  {dynamicProducts.slice(0, 3).map((prod) => (
                    <div
                      key={prod.id}
                      className="w-44 bg-white rounded-xl border border-neutral-100 p-2.5 flex-none flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      <div
                        onClick={() => {
                          setSelectedProduct(prod);
                          setCurrentScreen('productDetails');
                        }}
                        className="cursor-pointer"
                      >
                        <div className="relative rounded-lg overflow-hidden h-28 bg-slate-100 mb-2">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-300 referrer-no-referrer" referrerPolicy="no-referrer" />
                          <span className="absolute top-1 left-1.5 bg-[#1B4D3E] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                            ★ {prod.rating}
                          </span>
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-800 line-clamp-1">{prod.name}</h4>
                        <span className="text-[9px] text-slate-400">{prod.unit}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="text-xs font-bold text-[#1B4D3E]">₹{prod.price}</span>
                        {(() => {
                          const isItemInCart = cart.find((item) => item.product.id === prod.id);
                          return isItemInCart ? (
                            <div className="flex items-center space-x-1.5 bg-[#E8F0EC] p-0.5 rounded-lg border border-[#2E8B57]/20 select-none">
                              <button
                                onClick={() => decreaseQuantity(prod.id)}
                                className="w-5 h-5 bg-white text-[#1B4D3E] rounded-md flex items-center justify-center shadow-3xs hover:bg-neutral-50 cursor-pointer"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-[10px] font-bold text-[#1B4D3E] px-0.5">{isItemInCart.quantity}</span>
                              <button
                                onClick={() => increaseQuantity(prod.id)}
                                className="w-5 h-5 bg-white text-[#1B4D3E] rounded-md flex items-center justify-center shadow-3xs hover:bg-neutral-50 cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(prod)}
                              className="bg-[#2E8B57] hover:bg-[#1F5F3B] text-white p-1 rounded-lg transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us Section */}
              <div className="mt-5 bg-[#F2F7F4] p-5 border-y border-emerald-100">
                <h3 className="text-xs font-extrabold text-center text-[#1B4D3E] uppercase tracking-widest mb-4">
                  The Nulac Premium Standard
                </h3>
                <div className="space-y-3.5">
                  {[
                    {
                      icon: ShieldCheck,
                      title: 'Certified A2 Pure Herd',
                      desc: 'Our Gir cows graze on pesticide-free organic grasses.'
                    },
                    {
                      icon: Clock,
                      title: '12-Hour Farm to Counter',
                      desc: 'Milked, scanned, packed, and delivered before dawn.'
                    },
                    {
                      icon: Milk,
                      title: 'Sterilized Glass Bottles',
                      desc: 'Zero chemical leaching. Refreshes tastes naturally.'
                    }
                  ].map((item, idx) => {
                    const StepIcon = item.icon;
                    return (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="p-1.5 bg-white rounded-lg shadow-2xs">
                          <StepIcon className="w-4 h-4 text-[#2E8B57]" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-[#1B4D3E]">{item.title}</h4>
                          <p className="text-[9px] text-slate-500 leading-normal">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-5 px-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Direct Customer Stories</h3>
                  <div className="flex items-center text-amber-500 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-amber-500 mr-0.5" /> 4.9 (1.2k reviews)
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-neutral-100 p-4 shadow-3xs">
                  <div className="flex items-center space-x-2.5 mb-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold flex items-center justify-center">
                      AR
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-800">Aarti Ranganathan</h4>
                      <span className="text-[8px] text-slate-400">Verified Gold Customer</span>
                    </div>
                  </div>
                  <p className="text-[9.5px] italic text-slate-600 leading-normal">
                    &ldquo;My infant has struggled with standard milk for months, but this organic A2 milk flows easily with zero tummy bloat. True quality, sterile farm standards.&rdquo;
                  </p>
                </div>
              </div>

              {/* Blog and Contact Quick Rails */}
              <div className="mt-5 px-4 grid grid-cols-2 gap-3.5">
                <div
                  onClick={() => setCurrentScreen('blog')}
                  className="bg-[#1B4D3E] text-white p-3.5 rounded-xl cursor-pointer flex flex-col justify-between h-20 hover:opacity-90 transition-opacity"
                >
                  <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[10px] font-bold tracking-tight">Dairy Education Blog</span>
                </div>
                <div
                  onClick={() => setCurrentScreen('contact')}
                  className="bg-white border border-[#2E8B57]/30 text-slate-800 p-3.5 rounded-xl cursor-pointer flex flex-col justify-between h-20 hover:bg-neutral-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#2E8B57]" />
                  <span className="text-[10px] font-extrabold text-[#1B4D3E] tracking-tight">Support Coordinator</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* PRODUCTS LIST SCREEN */}
          {currentScreen === 'products' && (
            <motion.div
              id="screen-products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col pb-16"
            >
              {/* Back Nav Header */}
              <div className="bg-white px-4 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-30 border-b border-neutral-100">
                <button onClick={() => setCurrentScreen('home')} className="flex items-center text-slate-600 text-xs font-semibold">
                  <ChevronLeft className="w-4 h-4 mr-0.5 text-slate-500" /> Back
                </button>
                <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">Our Farm Marketplace</h2>
                <div className="w-5" />
              </div>

              {/* Interactive Search Grid */}
              <div className="p-3.5">
                <div className="relative flex items-center bg-white rounded-xl border border-neutral-200 px-3 py-1.5 focus-within:border-[#2E8B57]">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search glass milk, raw white ghee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-slate-800 focus:outline-none w-full"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-3 h-3 text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Subcategory selectors */}
                <div className="flex items-center space-x-1.5 overflow-x-auto mt-3 scrollbar-none pb-1">
                  {(['all', 'milk', 'ghee', 'paneer', 'dahi'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-[10px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap capitalize transition-colors ${
                        activeCategory === cat
                          ? 'bg-[#1B4D3E] text-white shadow-3xs'
                          : 'bg-white border border-neutral-200 text-slate-600 hover:bg-neutral-50'
                      }`}
                    >
                      {cat === 'all' ? 'All Products' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed Grid */}
              <div className="px-3.5 pb-4 flex-1">
                {filteredProducts.length === 0 ? (
                  <div className="py-12 text-center">
                    <Milk className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No pristine products matches your filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredProducts.map((prod) => {
                      const isItemInCart = cart.find((item) => item.product.id === prod.id);
                      return (
                        <div
                          key={prod.id}
                          className="bg-white border border-neutral-100 rounded-xl p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
                        >
                          <div
                            onClick={() => {
                              setSelectedProduct(prod);
                              setCurrentScreen('productDetails');
                            }}
                            className="cursor-pointer"
                          >
                            <div className="rounded-lg overflow-hidden h-24 bg-neutral-100 relative mb-2">
                              <img src={prod.image} className="w-full h-full object-cover referrer-no-referrer" alt={prod.name} referrerPolicy="no-referrer" />
                              <div className="absolute top-1 right-1 bg-white/95 px-1.5 py-0.5 rounded-md flex items-center text-[#D4AF37] text-[8px] font-bold shadow-2xs">
                                <span>★ {prod.rating}</span>
                              </div>
                            </div>
                            <h4 className="text-[10.5px] font-bold text-slate-800 line-clamp-1">{prod.name}</h4>
                            <p className="text-[9px] text-slate-400 mt-0.5">{prod.unit}</p>
                          </div>

                          <div className="mt-2.5">
                            <div className="flex items-baseline space-x-1 mb-1.5">
                              <span className="text-xs font-bold text-[#1B4D3E]">₹{prod.price}</span>
                              {prod.originalPrice && (
                                <span className="text-[9px] text-slate-300 line-through">₹{prod.originalPrice}</span>
                              )}
                            </div>

                            {isItemInCart ? (
                              <div className="flex items-center justify-between bg-[#E8F0EC] p-0.5 rounded-lg border border-[#2E8B57]/20">
                                <button
                                  onClick={() => decreaseQuantity(prod.id)}
                                  className="w-5 h-5 bg-white text-[#1B4D3E] rounded-md flex items-center justify-center shadow-3xs"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold text-[#1B4D3E]">{isItemInCart.quantity}</span>
                                <button
                                  onClick={() => increaseQuantity(prod.id)}
                                  className="w-5 h-5 bg-white text-[#1B4D3E] rounded-md flex items-center justify-center shadow-3xs"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(prod)}
                                className="w-full bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-[10px] font-extrabold py-1.5 rounded-lg tracking-wide shadow-3xs flex items-center justify-center space-x-1 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add to Cart</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PRODUCT DETAILS SCREEN */}
          {currentScreen === 'productDetails' && selectedProduct && (
            <div id="screen-details" className="flex-1 flex flex-col pb-16 bg-white">
              {/* Image banner with floating relative elements */}
              <div className="relative h-60 bg-neutral-100">
                <img
                  src={selectedProduct.image}
                  className="w-full h-full object-cover referrer-no-referrer"
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setCurrentScreen('products')}
                  className="absolute top-4 left-4 p-2 bg-white/90 rounded-full shadow-md text-slate-700 hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="absolute top-4 right-4 bg-[#1B4D3E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-white" />
                  <span>{selectedProduct.rating} / 5</span>
                </div>
              </div>

              {/* Symmetrical Body Grid */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#2E8B57] font-bold">
                    {selectedProduct.category} • {selectedProduct.origin}
                  </span>
                  <h1 className="text-lg font-bold text-slate-900 mt-1 leading-normal">
                    {selectedProduct.name}
                  </h1>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">{selectedProduct.unit} package</p>

                  <div className="flex items-center space-x-3 my-3">
                    <span className="text-lg font-bold text-[#1B4D3E]">₹{selectedProduct.price}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-[11px] text-slate-300 line-through">₹{selectedProduct.originalPrice}</span>
                    )}
                    <span className="text-[9px] font-bold bg-[#E8F0EC] text-[#2E8B57] px-2 py-0.5 rounded-md">
                      Free cold-chain delivery
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-600 leading-relaxed font-normal">
                    {selectedProduct.description}
                  </p>

                  {/* Certified Nutritional Fact Sheet */}
                  <div className="mt-4 border border-neutral-150 rounded-xl p-3 bg-neutral-50">
                    <h3 className="text-[9.5px] font-extrabold text-[#1B4D3E] uppercase tracking-widest mb-2 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-1" />
                      100% Certified Nutrition (per {selectedProduct.unit})
                    </h3>
                    <div className="grid grid-cols-5 gap-1.5 text-center text-slate-700">
                      {[
                        { label: 'Energy', val: selectedProduct.nutrition.energy },
                        { label: 'Fats', val: selectedProduct.nutrition.fat },
                        { label: 'Prot.', val: selectedProduct.nutrition.protein },
                        { label: 'Carbs', val: selectedProduct.nutrition.carbohydrates },
                        { label: 'Calc.', val: selectedProduct.nutrition.calcium }
                      ].map((nut, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-1.5 border border-neutral-100 shadow-3xs">
                          <span className="block text-[8px] text-slate-400 font-medium">{nut.label}</span>
                          <span className="block text-[9.5px] font-bold text-[#1B4D3E] mt-0.5">{nut.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlighted Benefits Grid */}
                  <div className="mt-4">
                    <h3 className="text-[10.5px] font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                      Quality Guarantees
                    </h3>
                    <div className="space-y-2">
                      {selectedProduct.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-[#E8F0EC] flex items-center justify-center flex-none">
                            <Check className="w-2.5 h-2.5 text-[#2E8B57]" />
                          </div>
                          <span className="text-[9.5s] text-slate-600 font-medium leading-tight">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA controls */}
                <div className="mt-6 pt-3.5 border-t border-neutral-100 flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setSubProduct(selectedProduct);
                      setCurrentScreen('subscription');
                    }}
                    className="w-1/3 bg-white border border-[#1B4D3E] hover:bg-[#E8F0EC] text-[#1B4D3E] text-[10.5px] font-black py-3 rounded-xl transition-colors tracking-wide text-center"
                  >
                    Subscribe
                  </button>
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="w-2/3 bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-[10.5px] font-black py-3 rounded-xl shadow-md transition-colors tracking-wide flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Shopping Cart</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CART SCREEN */}
          {currentScreen === 'cart' && (
            <div id="screen-cart" className="flex-1 flex flex-col pb-16">
              {/* Header */}
              <div className="bg-white px-4 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-30 border-b border-neutral-100">
                <button onClick={() => setCurrentScreen('home')} className="flex items-center text-slate-600 text-xs font-semibold">
                  <ChevronLeft className="w-4 h-4 mr-0.5 text-slate-500" /> Back
                </button>
                <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">Shopping Bag</h2>
                <div className="w-5" />
              </div>

              {/* Free Shipping Alert Banner */}
              {getSubtotal() > 0 && (
                <div className="bg-[#E8F0EC] text-[#1B4D3E] text-[10px] py-2 px-4 font-bold text-center border-b border-emerald-100">
                  {getSubtotal() >= 300 ? (
                    <span>🎉 Your order qualifies for <strong>FREE Cold-Chain Delivery</strong>!</span>
                  ) : (
                    <span>Add ₹{300 - getSubtotal()} more to unlock <strong>FREE Delivery</strong> (ideal for ghee jars)</span>
                  )}
                </div>
              )}

              {/* Scrollable list items */}
              <div className="p-4 flex-1">
                {cart.length === 0 ? (
                  <div className="py-16 text-center">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-xs text-slate-500 font-medium">Your shopping bag is completely empty.</p>
                    <button
                      onClick={() => setCurrentScreen('products')}
                      className="mt-4 bg-[#1B4D3E] text-white text-[10px] font-bold px-4 py-2 rounded-lg"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="bg-white p-3 rounded-xl border border-neutral-100 shadow-3xs flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden flex-none">
                            <img src={item.product.image} className="w-full h-full object-cover referrer-no-referrer" alt={item.product.name} referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-800 line-clamp-1">{item.product.name}</h4>
                            <span className="text-[9px] text-slate-400 block">{item.product.unit} • ₹{item.product.price}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2.5">
                          {/* Item action controls */}
                          <div className="flex items-center space-x-1.5 bg-neutral-100 p-0.5 rounded-lg">
                            <button
                              onClick={() => decreaseQuantity(item.product.id)}
                              className="w-4.5 h-4.5 bg-white rounded-md text-slate-600 flex items-center justify-center shadow-3xs"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-[11px] font-bold text-slate-800 px-1">{item.quantity}</span>
                            <button
                              onClick={() => increaseQuantity(item.product.id)}
                              className="w-4.5 h-4.5 bg-white rounded-md text-slate-600 flex items-center justify-center shadow-3xs"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <span className="text-[11px] font-black text-[#1B4D3E] whitespace-nowrap min-w-[40px] text-right">
                            ₹{item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Quick Promo Promo Codes Row */}
                    <div className="bg-white rounded-xl border border-neutral-100 p-3 shadow-3xs mt-4">
                      <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                        Apply Voucher Code
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="e.g. NULACNEW (10% off)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={promoApplied}
                          className="bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs w-full focus:outline-none"
                        />
                        {promoApplied ? (
                          <button
                            onClick={() => { setPromoApplied(false); setPromoCode(''); }}
                            className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-3 py-1.5 rounded-lg"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (promoCode.toUpperCase() === 'NULACNEW') {
                                setPromoApplied(true);
                                onNotify('Promo NULACNEW applied successfully!');
                              } else {
                                onNotify('Invalid coupon code. Try NULACNEW');
                              }
                            }}
                            className="bg-[#2E8B57] text-white text-[10px] font-bold px-4 py-1.5 rounded-lg"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Summary list */}
                    <div className="bg-white rounded-xl border border-neutral-100 p-4 shadow-3xs space-y-2">
                      <div className="flex justify-between items-center text-xs text-slate-600">
                        <span>Items Subtotal</span>
                        <span>₹{getSubtotal()}</span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between items-center text-xs text-[#2E8B57] font-semibold">
                          <span>Special Promo Discount (10%)</span>
                          <span>-₹{getDiscount()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xs text-slate-600">
                        <span>Thermal-insulated Shipping</span>
                        <span>{getDeliveryFee() === 0 ? 'FREE' : `₹${getDeliveryFee()}`}</span>
                      </div>
                      <div className="h-px bg-slate-100 my-2" />
                      <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
                        <span>Grand Bill Total</span>
                        <span className="text-[#1B4D3E]">₹{getGrandTotal()}</span>
                      </div>
                    </div>

                    {/* CTA Proceed Checkout */}
                    <div className="pt-4">
                      <button
                        onClick={() => setCurrentScreen('checkout')}
                        className="w-full bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-black py-3.5 rounded-xl shadow-md transition-colors tracking-wide uppercase"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CHECKOUT SCREEN */}
          {currentScreen === 'checkout' && (
            <div id="screen-checkout" className="flex-1 flex flex-col pb-16">
              {/* Header */}
              <div className="bg-white px-4 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-30 border-b border-neutral-100">
                <button onClick={() => setCurrentScreen('cart')} className="flex items-center text-slate-600 text-xs font-semibold">
                  <ChevronLeft className="w-4 h-4 mr-0.5 text-slate-500" /> Back
                </button>
                <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">Secure Order</h2>
                <div className="w-5" />
              </div>

              {/* Multi-step indicator */}
              <div className="bg-white border-b border-neutral-100 py-3.5 px-6 flex justify-between">
                {[
                  { label: 'Cart', active: true },
                  { label: 'Details', active: true },
                  { label: 'Confirm', active: false }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      step.active ? 'bg-[#2E8B57] text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`text-[10px] font-bold ${step.active ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Main checkout input grid */}
              <div className="p-4 space-y-4 flex-1">
                <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-3xs space-y-3.5">
                  {session.isGuest && (
                    <div className="bg-amber-55/10 border border-amber-500/20 rounded-xl p-3 text-[10px] text-amber-800 leading-normal">
                      <span className="font-extrabold flex items-center mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 inline-block"></span>
                        Anonymous Guest Checkout
                      </span>
                      Bypass active registration. Note: Guest sessions are transient. To automate orders or accumulate Gold rewards, register with standard OTP or Google credentials.
                      <div className="mt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentScreen('auth');
                            onNotify('Navigating to secure authorization page.');
                          }}
                          className="bg-white hover:bg-slate-50 border border-amber-300 text-amber-905 font-bold px-2 py-0.5 rounded text-[8px] cursor-pointer inline-block"
                        >
                          Register / Sign In Now
                        </button>
                      </div>
                    </div>
                  )}

                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1B4D3E]">
                    Delivery Information
                  </h3>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                      Account Registered Name
                    </label>
                    <input
                      type="text"
                      className="bg-neutral-50 border border-neutral-200 rounded-lg py-2 px-3 text-xs w-full focus:outline-none"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                      Phone Number (For OTP Verification)
                    </label>
                    <input
                      type="text"
                      className="bg-neutral-50 border border-neutral-200 rounded-lg py-2 px-3 text-xs w-full focus:outline-none"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      rows={2}
                      className="bg-neutral-50 border border-neutral-200 rounded-lg py-2 px-3 text-xs w-full focus:outline-none resize-none"
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                    />
                  </div>
                </div>

                {/* Delivery schedule selectors */}
                <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-3xs space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1B4D3E]">
                    Schedule Logistics
                  </h3>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1.5">
                      Choose Delivery Hour Slot
                    </label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-2 px-2.5 text-xs text-slate-700"
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value)}
                    >
                      <option>Morning (5:30 AM - 7:30 AM)</option>
                      <option>Daytime (9:00 AM - 12:00 PM)</option>
                      <option>Evening (5:00 PM - 7:00 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 mb-1.5">
                      Delivery Interval Frequency
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['once', 'daily', 'alternate'] as const).map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setDeliveryFrequency(freq)}
                          className={`text-[9.5px] font-semibold py-2 rounded-lg border capitalize ${
                            deliveryFrequency === freq
                              ? 'bg-[#E8F0EC] border-[#2E8B57] text-[#1B4D3E] font-bold shadow-3xs'
                              : 'bg-white border-neutral-200 text-slate-600'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector block */}
                <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-3xs space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-[#1B4D3E]">
                    Select Payment Method
                  </h3>

                  <div className="space-y-2">
                    {/* Method 1: Nulac Secure Wallet */}
                    <div 
                      onClick={() => setCheckoutPaymentMethod('wallet')}
                      className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${
                        checkoutPaymentMethod === 'wallet'
                          ? 'border-[#1B4D3E] bg-[#E8F0EC]/50'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                          checkoutPaymentMethod === 'wallet' ? 'border-[#1B4D3E]' : 'border-slate-350'
                        }`}>
                          {checkoutPaymentMethod === 'wallet' && <div className="w-1.5 h-1.5 rounded-full bg-[#1B4D3E]" />}
                        </div>
                        <div className="text-left">
                          <span className="block text-xs font-black text-slate-850 leading-none">Nulac Secure Wallet</span>
                          <span className="text-[8px] text-slate-400 mt-1 block">Deduct balance instantly upon order locking</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-[8px] text-slate-400 uppercase font-medium">Available</span>
                        <span className={`text-[10px] font-extrabold ${walletBalance >= getGrandTotal() ? 'text-[#2E8B57]' : 'text-red-500'}`}>
                          ₹{walletBalance}
                        </span>
                      </div>
                    </div>

                    {/* Method 2: Razorpay Gateway */}
                    <div 
                      onClick={() => setCheckoutPaymentMethod('razorpay')}
                      className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${
                        checkoutPaymentMethod === 'razorpay'
                          ? 'border-[#3399cc] bg-blue-50/25'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                          checkoutPaymentMethod === 'razorpay' ? 'border-[#3399cc]' : 'border-slate-355'
                        }`}>
                          {checkoutPaymentMethod === 'razorpay' && <div className="w-1.5 h-1.5 rounded-full bg-[#3399cc]" />}
                        </div>
                        <div className="text-left">
                          <span className="block text-xs font-black text-[#1D2B44] leading-none flex items-center">
                            Razorpay Payment Gateway
                            <span className="bg-[#3399cc]/15 text-[#3399cc] text-[6.5px] px-1 rounded ml-1 font-extrabold uppercase leading-none">SECURE</span>
                          </span>
                          <span className="text-[8px] text-slate-400 mt-1 block font-medium">UPI, CC/DC Card, Netbanking, Wallets supported</span>
                        </div>
                      </div>
                      <div className="bg-[#3399cc]/10 p-1.5 rounded-lg">
                        <CreditCard className="w-4 h-4 text-[#3399cc]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price review summary */}
                <div className="bg-[#1B4D3E] rounded-xl p-4 text-white space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-200">
                    <span>Subtotal</span>
                    <span>₹{getSubtotal()}</span>
                  </div>
                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-[11px] text-amber-300">
                      <span>Voucher Applied</span>
                      <span>-₹{getDiscount()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] text-slate-200">
                    <span>Shipping</span>
                    <span>{getDeliveryFee() === 0 ? 'FREE' : `₹${getDeliveryFee()}`}</span>
                  </div>
                  <div className="h-px bg-white/20 my-2" />
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                    <span>Order Price</span>
                    <span className="text-[#D4AF37]">₹{getGrandTotal()}</span>
                  </div>
                </div>

                {/* Confirm order CTA */}
                <div className="pt-2">
                  {checkoutPaymentMethod === 'wallet' ? (
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full bg-[#2E8B57] hover:bg-[#1F5F3B] text-white text-xs font-black py-3.5 rounded-xl shadow-md transition-all uppercase tracking-widest flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>Authorize Wallet Charge</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setRpayAmount(getGrandTotal());
                        setRpayPurpose('direct_checkout');
                        setRpayStep('select');
                        setRpayOverlayOpen(true);
                        onNotify('Proceeding to Razorpay checkout...');
                      }}
                      className="w-full bg-[#3399cc] hover:bg-[#2b85b2] text-white text-xs font-black py-3.5 rounded-xl shadow-md transition-all uppercase tracking-widest flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed with Razorpay</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ORDER SUCCESS SCREEN */}
          {currentScreen === 'success' && recentOrder && (
            <div id="screen-success" className="flex-1 bg-white flex flex-col justify-between py-8 px-6 text-center">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-[#E8F0EC] border-2 border-[#2E8B57] rounded-full flex items-center justify-center mb-4 shadow-inner text-[#2E8B57]">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order Sourced!</h1>
                <p className="text-[11px] text-slate-400 mt-1">Order receipt {recentOrder.id} generated</p>

                {/* Slabs summary list item */}
                <div className="mt-4 bg-slate-50 border border-neutral-100 rounded-xl p-3 w-full text-left">
                  <h4 className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold mb-1">Shipping Details</h4>
                  <p className="text-[10px] text-slate-800 leading-normal font-bold line-clamp-1">{recentOrder.deliveryAddress}</p>
                  <p className="text-[9px] text-[#2E8B57] mt-0.5 font-bold">Delivery Slot: {recentOrder.deliverySlot}</p>
                </div>

                {/* Logistics Route Map Tracker */}
                <div className="w-full bg-[#F2F7F4] border border-emerald-100 rounded-2xl p-4 mt-4 text-left">
                  <h3 className="text-[10px] font-extrabold text-[#1B4D3E] uppercase tracking-widest mb-3 flex items-center justify-between">
                    <span>Cold-Chain Tracker</span>
                    <span className="text-[8px] bg-[#2E8B57] text-white px-2 py-0.5 rounded-md animate-pulse">LIVE Log</span>
                  </h3>

                  {/* Delivery step progress */}
                  <div className="space-y-4 relative">
                    {/* Vertical guideline line */}
                    <div className="absolute top-2.5 bottom-1 left-2 h-[82%] w-0.5 bg-neutral-200" />

                    {[
                      {
                        title: 'Cow Milking & Lab Scans',
                        desc: 'Certified Gir herd raw milking + antibiotic scan completed.',
                        stepNum: 0
                      },
                      {
                        title: '120°C Steam Bottle Packing',
                        desc: 'Uncompromised glass sanitizing & thermal shock seal.',
                        stepNum: 1
                      },
                      {
                        title: 'Insulated Cold Dispatch',
                        desc: 'Transit boxes loaded at steady 4°C cooling blocks.',
                        stepNum: 2
                      },
                      {
                        title: 'Apartment Gate Drop-off',
                        desc: 'Fresh morning delivery secured for your family breakfast.',
                        stepNum: 3
                      }
                    ].map((step, idx) => (
                      <div key={idx} className="flex space-x-3.5 relative">
                        <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] text-white font-extrabold z-10 ${
                          deliveryStep >= step.stepNum ? 'bg-[#2E8B57]' : 'bg-neutral-300'
                        }`}>
                          {step.stepNum + 1}
                        </div>
                        <div>
                          <h4 className={`text-[10px] font-bold leading-tight ${deliveryStep >= step.stepNum ? 'text-[#1B4D3E]' : 'text-slate-400'}`}>
                            {step.title}
                          </h4>
                          <p className="text-[8.5px] text-slate-400 leading-normal mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-full bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-black py-3.5 rounded-xl shadow-md transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* SUBSCRIPTION CALENDAR CONTAINER VIEW */}
          {currentScreen === 'subscription' && (
            <div id="screen-sub" className="flex-1 flex flex-col pb-16 bg-[#F8F9FA]">
              {/* Header */}
              <div className="bg-white px-4 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-30 border-b border-neutral-100">
                <button onClick={() => setCurrentScreen('home')} className="flex items-center text-slate-600 text-xs font-semibold">
                  <ChevronLeft className="w-4 h-4 mr-0.5 text-slate-500" /> Back
                </button>
                <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">Milk Subscriptions</h2>
                <div className="w-5" />
              </div>

              {/* Top Selector Tabs */}
              <div className="grid grid-cols-2 bg-white border-b border-slate-100 sticky top-[41px] z-20">
                <button
                  onClick={() => setSubTab('active')}
                  className={`py-3 text-xs font-black text-center border-b-2 transition-colors ${
                    subTab === 'active'
                      ? 'border-[#1B4D3E] text-[#1B4D3E]'
                      : 'border-transparent text-slate-400'
                  }`}
                >
                  Active & Calendar
                </button>
                <button
                  onClick={() => setSubTab('new')}
                  className={`py-3 text-xs font-black text-center border-b-2 transition-colors ${
                    subTab === 'new'
                      ? 'border-[#1B4D3E] text-[#1B4D3E]'
                      : 'border-transparent text-slate-400'
                  }`}
                >
                  Establish Routine
                </button>
              </div>

              {subTab === 'active' ? (
                // TAB 1: ACTIVE RU OUTINES & CALENDAR
                <div className="p-4 space-y-4 overflow-y-auto flex-1">
                  
                  {/* Pasture-to-fridge card */}
                  <div className="bg-white border border-neutral-100 rounded-xl p-3 shadow-3xs flex items-center space-x-3">
                    <div className="bg-[#E8F0EC] p-2.5 rounded-full text-[#1B4D3E]">
                      <Milk className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Pasture-to-Fridge Calendar</h4>
                      <p className="text-[9px] text-slate-400 leading-tight">Daily morning & evening cold-chain delivery simulator rhythms.</p>
                    </div>
                  </div>

                  {/* Delivery Calendar Title */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Interactive Log Calendar</span>
                      <span className="text-[9px] font-bold text-slate-500">June 2026</span>
                    </div>

                    {/* Integrated Interactive Calendar Card */}
                    <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-3xs">
                      {/* Weekday indicator row */}
                      <div className="grid grid-cols-7 text-center mb-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                          <span key={idx} className="text-[8px] font-black text-slate-400">{day}</span>
                        ))}
                      </div>

                      {/* June 2026 (Starts on a Monday, 30 days) */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {Array.from({ length: 30 }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const weekdaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                          const currentDayOfWeek = weekdaysNames[idx % 7]; // June 1 = Mon (index 0)

                          // Calculate if any active subscription delivers today
                          const hasDelivery = subscriptions.some((sub) => {
                            if (sub.status !== 'active') return false;
                            if (sub.frequency === 'daily') return true;
                            if (sub.frequency === 'alternate') return dayNum % 2 === 0;
                            if (sub.frequency === 'custom') return sub.selectedDays?.includes(currentDayOfWeek);
                            return false;
                          });

                          const isToday = dayNum === 18; // Lock-mock today to June 18

                          return (
                            <div
                              key={idx}
                              className={`py-1.5 rounded-lg flex flex-col items-center justify-center relative transition-all ${
                                hasDelivery 
                                  ? 'bg-[#E8F0EC] text-[#1B4D3E]' 
                                  : isToday 
                                    ? 'bg-slate-100 text-slate-800 ring-1 ring-[#1B4D3E]' 
                                    : 'bg-white'
                              }`}
                            >
                              <span className={`text-[10px] ${hasDelivery || isToday ? 'font-black' : 'text-slate-700'}`}>
                                {dayNum}
                              </span>
                              {hasDelivery && (
                                <span className="absolute bottom-0 w-1 h-1 bg-[#2E8B57] rounded-full" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-slate-50 text-[8.5px] text-slate-400 font-bold">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-2.5 h-2.5 rounded bg-[#E8F0EC] border border-[#2E8B57]/20 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-[#2E8B57]" />
                          </div>
                          <span>Sub Delivery Today</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <div className="w-2.5 h-2.5 rounded bg-slate-100 ring-1 ring-[#1B4D3E]/30" />
                          <span>Today (June 18)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE SUBSCRIPTIONS */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block">Active Routines ({subscriptions.length})</span>
                    
                    {subscriptions.length === 0 ? (
                      <div className="bg-white border border-dashed border-slate-200 rounded-xl p-5 text-center">
                        <p className="text-[10px] text-slate-400 font-medium">No active milk routines registered.</p>
                        <button 
                          onClick={() => setSubTab('new')} 
                          className="mt-2 text-[9px] text-[#1B4D3E] font-black uppercase hover:underline"
                        >
                          + Establish first routine
                        </button>
                      </div>
                    ) : (
                      subscriptions.map((sub) => (
                        <div key={sub.id} className="bg-white border border-neutral-100 rounded-xl p-3 shadow-3xs flex flex-col space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`p-1.5 rounded-lg ${sub.product.id === '2' ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'}`}>
                                <Milk className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-[10.5px] font-black text-slate-800 leading-normal line-clamp-1">{sub.product.name}</h4>
                                <p className="text-[9px] text-slate-400">
                                  {sub.qtyPerDay} Litre{sub.qtyPerDay > 1 ? 's' : ''} • {sub.frequency === 'daily' ? 'Morning 5:00 AM Delivery' : 'Alternate Days'}
                                </p>
                              </div>
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                              sub.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {sub.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                            <button
                              onClick={() => {
                                setSubscriptions(subscriptions.filter((s) => s.id !== sub.id));
                                setSubscriptionHistory([
                                  {
                                    id: 'hist_' + Date.now(),
                                    productName: sub.product.name,
                                    frequency: sub.frequency === 'daily' ? 'Daily' : 'Alternate Days',
                                    qtyPerDay: sub.qtyPerDay,
                                    dateRange: `Started ${sub.startDate}`,
                                    status: 'Cancelled'
                                  },
                                  ...subscriptionHistory
                                ]);
                                onNotify(`Subscription cancelled.`);
                              }}
                              className="text-[9px] font-black text-red-500 uppercase flex items-center hover:bg-red-50 px-1.5 py-1 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3 mr-0.5" />
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                setSubscriptions(
                                  subscriptions.map((s) =>
                                    s.id === sub.id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
                                  )
                                );
                                onNotify(`Subscription ${sub.status === 'active' ? 'PAUSED' : 'RESUMED'} instantly!`);
                              }}
                              className={`text-[9.5px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                                sub.status === 'active'
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {sub.status === 'active' ? 'Pause' : 'Resume'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* UPCOMING SHIPMENTS (Calculated dynamically) */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block">Upcoming Deliveries (Next 3)</span>
                    
                    {(() => {
                      // Generate tomorrow (June 19), June 20, June 21
                      const nextDeliveries: { dayNum: number; dateStr: string; product: string; qty: number }[] = [];
                      const daysMap = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

                      for (let i = 1; i <= 6; i++) {
                        const dayNum = 18 + i; // Current mocked date is June 18
                        if (dayNum > 30) break;

                        const currentDayOfWeek = daysMap[(dayNum - 1) % 7];

                        // Find matching active ones
                        subscriptions.forEach((sub) => {
                          if (sub.status !== 'active') return;
                          let slated = false;
                          if (sub.frequency === 'daily') slated = true;
                          else if (sub.frequency === 'alternate') slated = (dayNum % 2 === 0);
                          else if (sub.frequency === 'custom') slated = sub.selectedDays?.includes(currentDayOfWeek) || false;

                          if (slated && nextDeliveries.length < 3) {
                            nextDeliveries.push({
                              dayNum,
                              dateStr: `Thursday, June ${dayNum}`,
                              product: sub.product.name,
                              qty: sub.qtyPerDay
                            });
                          }
                        });
                      }

                      if (nextDeliveries.length === 0) {
                        return <p className="text-[9.5px] text-slate-400 pl-1">No upcoming deliveries scheduled.</p>;
                      }

                      return (
                        <div className="bg-white border border-neutral-100 rounded-xl p-3.5 shadow-3xs divide-y divide-slate-100 space-y-2.5">
                          {nextDeliveries.slice(0, 3).map((delivery, index) => (
                            <div key={index} className={`flex items-center justify-between ${index > 0 ? 'pt-2.5' : ''}`}>
                              <div className="flex items-center space-x-2.5">
                                <div className="bg-slate-50 text-center rounded-lg border border-slate-100 py-1 px-1.5 w-10">
                                  <span className="block text-[8px] font-black text-slate-400 uppercase">June</span>
                                  <span className="block text-[11px] font-black text-slate-700 leading-none">{delivery.dayNum}</span>
                                </div>
                                <div>
                                  <h4 className="text-[9.5px] font-bold text-slate-800 line-clamp-1">{delivery.product}</h4>
                                  <p className="text-[8.5px] text-slate-400">{delivery.qty} Litre{delivery.qty > 1 ? 's' : ''} slated to arrive</p>
                                </div>
                              </div>
                              <span className="text-[8px] font-black uppercase text-[#2E8B57] bg-emerald-50 px-1 py-0.5 rounded leading-none">
                                Slated
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* SUBSCRIPTION HISTORY */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block">Routine History</span>
                    {subscriptionHistory.map((h, idx) => (
                      <div key={idx} className="bg-white border border-neutral-100 rounded-xl p-3.5 shadow-3xs flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-full bg-slate-50 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-[9.5px] font-bold text-slate-700 line-clamp-1">{h.productName}</h4>
                            <p className="text-[8.5px] text-slate-400">{h.qtyPerDay}L • {h.frequency} • {h.dateRange}</p>
                          </div>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                          h.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {h.status}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              ) : (
                // TAB 2: ESTABLISH NEW ROUTINE FORM
                <div className="p-4 space-y-4 overflow-y-auto flex-1">
                  
                  {/* Select Milk Type */}
                  <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-3xs space-y-2.5">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Select Milk Type
                    </h3>

                    <div className="grid grid-cols-2 gap-2.5">
                      {dynamicProducts.filter((p) => p.category === 'milk').map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => setSubProduct(prod)}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                            subProduct.id === prod.id
                              ? 'bg-[#E8F0EC] border-[#1B4D3E] ring-1 ring-[#1B4D3E]/30'
                              : 'bg-white border-neutral-100 hover:bg-neutral-50'
                          }`}
                        >
                          <div className="h-14 w-full overflow-hidden rounded-lg mb-2">
                            <img src={prod.image} className="w-full h-full object-cover referrer-no-referrer" alt={prod.name} referrerPolicy="no-referrer" />
                          </div>
                          <span className="block text-[9.5px] font-black text-slate-800 line-clamp-1">{prod.name}</span>
                          <span className="block text-[8px] text-[#2E8B57] font-bold mt-1">₹{prod.price} / L</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Volume Selector */}
                  <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-3xs space-y-2.5">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Select Daily Milk Volume
                    </h3>
                    <div className="flex items-center justify-between bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-100">
                      <span className="text-[10px] font-bold text-slate-600">Daily Litre Volume</span>
                      <div className="flex items-center space-x-3 bg-white border border-neutral-200 rounded-lg p-1">
                        <button
                          onClick={() => setSubQty((q) => (q > 1 ? q - 1 : 1))}
                          className="bg-slate-50 text-slate-800 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-[#1B4D3E] px-1">{subQty} Litres</span>
                        <button
                          onClick={() => setSubQty((q) => q + 1)}
                          className="bg-slate-50 text-slate-800 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Logistics Frequency config */}
                  <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-3xs space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Delivery Frequency Choice
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'daily', label: 'Deliver Daily' },
                        { id: 'alternate', label: 'Alternate Days' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setSubFreq(opt.id as any)}
                          className={`text-[9.5px] font-black py-2.5 rounded-lg border capitalize transition-all ${
                            subFreq === opt.id
                              ? 'bg-[#E8F0EC] border-[#1B4D3E] text-[#1B4D3E]'
                              : 'bg-white border-neutral-200 text-slate-500'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub Period Choice */}
                  <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-3xs space-y-3AndCalendar pt-3 border-t border-neutral-100">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                      Subscription Plan Duration
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 3, 6, 12].map((m) => (
                        <button
                          key={m}
                          onClick={() => setSubMonths(m)}
                          className={`text-[9.5px] font-bold py-1.5 rounded-lg border transition-colors ${
                            subMonths === m
                              ? 'bg-[#E8F0EC] border-[#1B4D3E] text-[#1B4D3E] font-black'
                              : 'bg-white border-neutral-200 text-slate-500'
                          }`}
                        >
                          {m} {m === 1 ? 'Month' : 'Mths'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleAddSubscription}
                      className="w-full bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-black py-4 rounded-xl leading-none uppercase shadow-md flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Establish Routine Delivery</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* BLOG BOARD SCREEN */}
          {currentScreen === 'blog' && (
            <div id="screen-blog" className="flex-1 flex flex-col pb-16">
              {/* Header */}
              <div className="bg-white px-4 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-30 border-b border-neutral-100">
                <button onClick={() => setCurrentScreen('home')} className="flex items-center text-slate-600 text-xs font-semibold">
                  <ChevronLeft className="w-4 h-4 mr-0.5 text-slate-500" /> Back
                </button>
                <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">Lactation & Soil Science</h2>
                <div className="w-5" />
              </div>

              {/* Feed items list */}
              <div className="p-4 space-y-4">
                {dynamicBlogs.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      setSelectedBlog(post);
                      setCurrentScreen('blogDetail');
                    }}
                    className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition-shadow cursor-pointer"
                  >
                    <div className="h-36 bg-slate-100 relative">
                      <img src={post.image} className="w-full h-full object-cover referrer-no-referrer" alt={post.title} referrerPolicy="no-referrer" />
                      <span className="absolute bottom-2.5 left-3 bg-[#1B4D3E] text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-4.5">
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold uppercase mb-1">
                        <span>By {post.author.split(' ')[0]}</span>
                        <span>• {post.readTime}</span>
                      </div>
                      <h3 className="text-xs font-extrabold text-[#1B4D3E] leading-normal line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 leading-normal mt-1.5 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOG DETAIL VIEW SCREEN */}
          {currentScreen === 'blogDetail' && selectedBlog && (
            <div id="screen-blog-detail" className="flex-1 bg-white flex flex-col pb-16">
              <div className="relative h-44 bg-neutral-100">
                <img src={selectedBlog.image} className="w-full h-full object-cover referrer-no-referrer" alt={selectedBlog.title} referrerPolicy="no-referrer" />
                <button
                  onClick={() => setCurrentScreen('blog')}
                  className="absolute top-4 left-4 p-2 bg-white/95 rounded-full shadow-md text-slate-700 hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex-1 select-text">
                <span className="text-[9px] bg-[#E8F0EC] text-[#2E8B57] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {selectedBlog.category}
                </span>
                <h1 className="text-base font-extrabold text-[#1B4D3E] tracking-tight mt-2.5 leading-snug">
                  {selectedBlog.title}
                </h1>
                <div className="flex justify-between items-center text-[9.5px] border-b border-neutral-100 pb-3 mt-2 text-slate-400">
                  <span>Written by {selectedBlog.author}</span>
                  <span>{selectedBlog.date}</span>
                </div>

                <div className="mt-4 text-[10px] text-slate-600 leading-relaxed space-y-3 font-normal whitespace-pre-line">
                  {selectedBlog.content}
                </div>
              </div>
            </div>
          )}

          {/* CONTACT & CHAT SCREEN */}
          {currentScreen === 'contact' && (
            <div id="screen-contact" className="flex-1 flex flex-col pb-16 bg-white">
              {/* Header */}
              <div className="bg-white px-4 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-30 border-b border-slate-100 flex-none">
                <button onClick={() => setCurrentScreen('home')} className="flex items-center text-slate-600 text-xs font-semibold">
                  <ChevronLeft className="w-4 h-4 mr-0.5 text-slate-500" /> Back
                </button>
                <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">Farm Coordinator Chat</h2>
                <div className="w-5" />
              </div>

              {/* Chat view area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 flex flex-col bg-slate-50">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[80%] ${
                      msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl text-[10.5px] leading-relaxed shadow-3xs ${
                      msg.sender === 'user'
                        ? 'bg-[#1B4D3E] text-white rounded-br-none'
                        : 'bg-white border border-neutral-250 text-slate-800 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-slate-400 mt-1 px-1 font-mono tracking-wider">{msg.time}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="self-start bg-neutral-200 text-neutral-600 px-3 py-2 rounded-xl text-[10px] animate-pulse flex items-center space-x-1 shadow-3xs">
                    <Milk className="w-3.5 h-3.5 text-[#1B4D3E] animate-bounce" />
                    <span>Anand is preparing a coordinates log...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Starters */}
              <div className="bg-slate-50 border-t border-neutral-100 p-2 flex space-x-1.5 overflow-x-auto scrollbar-none flex-none">
                {[
                  'Is the milk pasteurized?',
                  'Can I pause my subscription?',
                  'Why glass bottles instead of plastic?'
                ].map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(st)}
                    className="bg-white hover:bg-neutral-50 whitespace-nowrap text-[8.5px] border border-neutral-200 rounded-full px-2.5 py-1 text-slate-600 font-semibold"
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Chat inputs */}
              <div className="p-3 border-t border-neutral-100 flex items-center bg-white flex-none">
                <input
                  type="text"
                  placeholder="Ask Anand about pasture feeds, raw ghee..."
                  className="bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-200 text-xs w-full focus:outline-none focus:border-[#2E8B57]"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage(chatInput);
                  }}
                />
                <button
                  onClick={() => handleSendMessage(chatInput)}
                  className="ml-2 bg-[#1B4D3E] hover:bg-[#143B2F] text-white p-2.5 rounded-xl text-center flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* PROFILE SCREEN */}
          {currentScreen === 'profile' && (
            <div id="screen-profile" className="flex-1 flex flex-col pb-16">
              {/* Header */}
              <div className="bg-white px-4 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-30 border-b border-neutral-100">
                <button onClick={() => setCurrentScreen('home')} className="flex items-center text-slate-600 text-xs font-semibold">
                  <ChevronLeft className="w-4 h-4 mr-0.5 text-slate-500" /> Back
                </button>
                <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">My Nulac Account</h2>
                <div className="w-5" />
              </div>

              {/* Gold status container */}
              <div className="p-4 bg-gradient-to-br from-[#1B4D3E] to-[#143B2F] text-white m-4 rounded-2xl shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    {session.avatarUrl ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-extrabold flex items-center justify-center border-2 border-[#D4AF37] text-sm">
                        {session.avatarUrl}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100/10 text-white font-black flex items-center justify-center border border-white/20 text-xs">
                        {session.isGuest ? 'G' : 'U'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-black mb-0.5 leading-tight">{userName || 'Guest Customer'}</h3>
                      <p className="text-[9px] text-slate-200 truncate tracking-wide max-w-[130px]">
                        {userPhone || (session.email ? session.email : 'No verified phone link')}
                      </p>
                      <span className="inline-block bg-[#D4AF37] text-[#1B4D3E] text-[8px] font-black uppercase px-2 py-0.5 rounded-md mt-1 tracking-wide">
                        {session.isGuest ? 'Guest Trial Account' : 'Nulac Gold Member'}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-center border border-white/20">
                    <span className="block text-[7.5px] text-[#D4AF37] font-black uppercase">Wallet</span>
                    <span className="text-sm font-extrabold text-white">₹{walletBalance}</span>
                  </div>
                </div>

                <div className="h-px bg-white/10 my-3" />

                {/* Razorpay Wallet Refill Selector Block */}
                <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-350 font-bold uppercase tracking-wider">Refill Wallet (via Razorpay Gateway)</span>
                    <span className="bg-[#3399cc] text-[7.5px] text-white px-1.5 py-0.2 rounded font-black tracking-widest uppercase">DEMO GATEWAY</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[250, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => {
                          setRpayAmount(amt);
                          setRpayPurpose('wallet_topup');
                          setRpayStep('select');
                          setRpayOverlayOpen(true);
                          onNotify(`Configuring Razorpay gateway for ₹${amt} top-up...`);
                        }}
                        className="bg-white/10 hover:bg-white/20 border border-white/10 text-[#D4AF37] hover:text-white py-1.5 px-2 text-[10px] font-black rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>₹{amt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secure Session Portal detail */}
              <div className="mx-4 mb-4 bg-white border border-neutral-100 rounded-xl p-3.5 shadow-3xs space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider">Access Method</span>
                  <span className="font-bold text-slate-705">
                    {session.isLoggedIn 
                      ? (session.email ? 'Google Authentication' : 'Mobile OTP Authentication') 
                      : 'Anonymous Guest Account'
                    }
                  </span>
                </div>
                {session.isLoggedIn && (
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider">Session Token</span>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 font-extrabold px-2 py-0.5 rounded text-[8px]">
                      SECURE & STORED
                    </span>
                  </div>
                )}
                <div className="h-px bg-slate-100" />
                <button
                  type="button"
                  onClick={() => {
                    nulacRepository.clearSession();
                    setSession({ isLoggedIn: false, isGuest: false, name: '', phone: '', createdAt: '' });
                    setUserName('');
                    setUserPhone('');
                    setCurrentScreen('auth');
                    onNotify('Session closed securely. All secure tokens cleared.');
                  }}
                  className="w-full text-center bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {session.isGuest ? 'Sign In / Register with OTP' : 'Secure Log Out'}
                </button>
              </div>

              {/* Active subscription lists */}
              <div className="px-4 pb-4 space-y-4">
                <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-3xs">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-[#2E8B57]" />
                    Scheduled Subscriptions ({subscriptions.length})
                  </h3>

                  {subscriptions.length === 0 ? (
                    <p className="text-[10px] text-slate-400">You do not have any active daily subscription setup.</p>
                  ) : (
                    <div className="space-y-3">
                      {subscriptions.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-[#F2F7F4] border border-emerald-100 p-3 rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <span className="block text-[10px] font-bold text-slate-850 line-clamp-1">{sub.product.name}</span>
                            <span className="block text-[8.5px] text-slate-400 mt-1 capitalize">
                              Qty: {sub.qtyPerDay} • Interval: {sub.frequency}
                            </span>
                            {sub.selectedDays && (
                              <span className="block text-[8px] bg-white text-[#2E8B57] font-semibold border px-1.5 py-0.5 rounded-full mt-1 w-max">
                                {sub.selectedDays.join(', ')}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] bg-[#2E8B57] text-white px-2 py-0.5 rounded-full font-bold">
                              {sub.status}
                            </span>
                            <button
                              onClick={() => {
                                setSubscriptions(subscriptions.map((s) => s.id === sub.id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s));
                                onNotify(`Subscription ${sub.id} status modified!`);
                              }}
                              className="block text-[9px] text-[#1B4D3E] font-bold underline mt-1.5 cursor-pointer ml-auto"
                            >
                              {sub.status === 'active' ? 'Pause' : 'Resume'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Historic orders list */}
                <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-3xs flex flex-col">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-1 text-[#2E8B57]" />
                    Past Orders Surchages ({ordersHistory.length})
                  </h3>

                  {ordersHistory.length === 0 ? (
                    <p className="text-[10px] text-slate-400">No previous orders logged on this sandbox trace.</p>
                  ) : (
                    <div className="space-y-3">
                      {ordersHistory.map((ord) => (
                        <div
                          key={ord.id}
                          className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0"
                        >
                          <div className="flex justify-between text-[10px] font-bold text-slate-800">
                            <span>Receipt {ord.id}</span>
                            <span className="text-[#1B4D3E]">₹{ord.total}</span>
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-400 mt-1">
                            <span>{ord.date}</span>
                            <span className="capitalize text-[#2E8B57]">{ord.status}</span>
                          </div>
                          <div className="text-[9px] text-slate-650 bg-neutral-100/60 p-1.5 rounded-lg mt-1 line-clamp-2">
                            {ord.items.map((item) => `${item.quantity}x ${item.product.name}`).join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Razorpay transaction history ledger */}
                <div className="bg-white border border-neutral-100 rounded-xl p-4 shadow-3xs flex flex-col">
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-xs font-extrabold text-slate-850 uppercase tracking-wider flex items-center">
                      <CreditCard className="w-3.5 h-3.5 mr-1 text-[#3399cc]" />
                      Razorpay Trx Ledger ({razorpayTransactions.length})
                    </h3>
                    {razorpayTransactions.length > 0 && (
                      <button 
                        onClick={() => {
                          setRazorpayTransactions([]);
                          onNotify("Razorpay transaction ledger audit logs cleared.");
                        }}
                        className="text-[7.5px] font-black text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-2 py-0.5 rounded transition-colors uppercase cursor-pointer"
                      >
                        Clear Ledger
                      </button>
                    )}
                  </div>

                  {razorpayTransactions.length === 0 ? (
                    <p className="text-[10px] text-slate-400 tracking-tight leading-normal">
                      No payment transaction history found. Top up your wallet or do direct checkout payments using the Razorpay gateway!
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[185px] overflow-y-auto pr-1">
                      {razorpayTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0"
                        >
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-[#1D2B44] font-mono">{tx.id}</span>
                            <span className={tx.status === 'captured' ? 'text-emerald-700 font-extrabold' : 'text-red-650 font-extrabold'}>
                              {tx.status === 'captured' ? '+' : ''}₹{tx.amount}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-[8px] text-slate-400 mt-1">
                            <span>{tx.date}</span>
                            <span className={`px-1.5 py-0.2 rounded-md text-[7px] font-extrabold uppercase border ${
                              tx.status === 'captured' 
                                ? 'bg-emerald-50 text-[#1B4D3E] border-emerald-150' 
                                : 'bg-red-50 text-red-750 border-red-150'
                            }`}>
                              {tx.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[8.5px] text-slate-600 bg-slate-50/70 p-1.5 rounded-lg mt-1.5 border border-slate-100">
                            <span className="font-semibold truncate max-w-[150px]">{tx.methodDetail}</span>
                            <span className="text-[7.5px] uppercase font-black text-slate-400 shrink-0">
                              {tx.purpose === 'wallet_topup' ? 'Refill Wallet' : 'Direct Pay'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION CENTER SCREEN */}
          {currentScreen === 'notifications' && (
            <div id="screen-notifications" className="flex-1 flex flex-col pb-16">
              {/* Header */}
              <div className="bg-white px-4 py-3 flex items-center justify-between shadow-3xs sticky top-0 z-30 border-b border-slate-100">
                <button onClick={() => setCurrentScreen('home')} className="flex items-center text-slate-600 text-xs font-semibold select-none">
                  <ChevronLeft className="w-4 h-4 mr-0.5 text-slate-500" /> Back
                </button>
                <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">Notification Hub</h2>
                <button 
                  onClick={() => {
                    setFcmNotifications([]);
                    onNotify('Simulated inbox cleared.');
                  }}
                  className="text-[9px] font-black text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded transition-colors uppercase"
                >
                  Clear
                </button>
              </div>

              {/* Developer Configuration Overlay */}
              <div className="p-4 bg-slate-900 text-slate-100 m-3 rounded-2xl shadow-md flex flex-col space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center">
                    <Sliders className="w-3.5 h-3.5 mr-1 text-[#2E8B57]" />
                    FCM Device Configuration
                  </span>
                  <div className="flex bg-white/10 p-0.5 rounded-lg text-[8px]">
                    <button 
                      onClick={() => setOsSkin('iOS')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-all ${osSkin === 'iOS' ? 'bg-[#1B4D3E] text-white' : 'text-slate-400'}`}
                    >
                      iOS
                    </button>
                    <button 
                      onClick={() => setOsSkin('Android')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-all ${osSkin === 'Android' ? 'bg-[#2E8B57] text-white' : 'text-slate-400'}`}
                    >
                      Android
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-medium font-semibold">FCM Registration Token:</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(fcmToken);
                        setIsTokenCopied(true);
                        onNotify('Simulated registration status copied to clipboard.');
                        setTimeout(() => setIsTokenCopied(false), 2000);
                      }}
                      className="text-[9px] text-emerald-400 hover:underline hover:text-emerald-300 transition-colors"
                    >
                      {isTokenCopied ? 'Copied' : 'Copy Token'}
                    </button>
                  </div>
                  <div className="bg-black/55 p-2 rounded-lg text-[8px] font-mono text-slate-300 break-all leading-relaxed select-text select-all">
                    {fcmToken}
                  </div>
                </div>

                {/* Topic subscription settings inside app */}
                <div className="flex flex-col space-y-2 mt-1">
                  <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase">FCM Topic Subscriptions</span>
                  <div className="grid grid-cols-2 gap-2 text-[9.5px]">
                    {[
                      { key: 'order_updates', label: '📦 Order Updates' },
                      { key: 'new_launches', label: '🌿 Launches' },
                      { key: 'membership_offers', label: '⭐ Member Offers' },
                      { key: 'delivery_updates', label: '🚚 Delivery status' }
                    ].map((topic) => (
                      <button 
                        key={topic.key}
                        onClick={() => {
                          const state = !topicSubscriptions[topic.key];
                          setTopicSubscriptions(prev => ({ ...prev, [topic.key]: state }));
                          onNotify(`FCM subscription "${topic.key}" mutated: ${state ? 'ENABLED' : 'UNSUBSCRIBED'}`);
                        }}
                        className={`p-1.5 rounded-lg text-left flex justify-between items-center border transition-all ${
                          topicSubscriptions[topic.key] 
                            ? 'bg-[#1B4D3E]/20 border-[#1B4D3E] text-white font-bold' 
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        <span>{topic.label}</span>
                        <div className={`w-2 h-2 rounded-full ${topicSubscriptions[topic.key] ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notification feed */}
              <div className="flex-1 px-4 overflow-y-auto max-h-[350px]">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-1">
                  Alert Streams
                </h3>

                {fcmNotifications.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-white border border-slate-100 rounded-2xl">
                    <BellOff className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-[11px] text-slate-850 font-bold">Pure Pasture Tranquility</p>
                    <p className="text-[9.5px] text-slate-400 mt-0.5">No push notifications have been enqueued on this device.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {fcmNotifications.map((notif) => {
                      // Get corresponding graphic or badge
                      const isReadItem = notif.isRead;
                      return (
                        <div 
                          key={notif.id}
                          onClick={() => {
                            setFcmNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                          }}
                          className={`relative border rounded-[15px] p-3 transition-all text-left flex space-x-2.5 cursor-pointer ${
                            isReadItem 
                              ? 'bg-white border-neutral-150/70 opacity-80' 
                              : 'bg-emerald-50/45 border-emerald-100 shadow-xs'
                          }`}
                        >
                          {/* Unread indicator bulb */}
                          {!isReadItem && (
                            <span className="absolute top-3.5 right-3 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          )}

                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            notif.type === 'order_updates' ? 'bg-blue-50 text-blue-700' :
                            notif.type === 'new_launches' ? 'bg-emerald-100 text-[#1B4D3E]' :
                            notif.type === 'membership_offers' ? 'bg-amber-100 text-[#D4AF37]' : 'bg-purple-50 text-purple-700'
                          }`}>
                            {notif.type === 'order_updates' ? <ShoppingBag className="w-4 h-4" /> :
                             notif.type === 'new_launches' ? <Sparkles className="w-4 h-4" /> :
                             notif.type === 'membership_offers' ? <Award className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                          </div>

                          <div className="flex-1 min-w-0 pr-3">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                {notif.type.replace('_', ' ')}
                              </span>
                              <span className="text-[8.5px] text-slate-400 font-mono">
                                {notif.timestamp}
                              </span>
                            </div>
                            <h4 className={`text-[10.5px] font-black leading-snug tracking-tight ${isReadItem ? 'text-slate-700' : 'text-slate-900'}`}>
                              {notif.title}
                            </h4>
                            <p className="text-[9.5px] text-slate-650 leading-normal font-medium mt-0.5">
                              {notif.body}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Blinkit & Country Delight style Floating Cart/Basket Quick Bar */}
        {cart.length > 0 && (currentScreen === 'home' || currentScreen === 'products') && (
          <div className="absolute bottom-15 inset-x-3 bg-[#1B4D3E] text-white p-2.5 rounded-2xl shadow-xl flex items-center justify-between z-45 border border-emerald-700/30 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs text-[#D4AF37]">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <div>
                <span className="block text-[8px] uppercase tracking-widest text-[#D4AF37] font-black leading-none">Your Cold-Chain Basket</span>
                <span className="text-xs font-black">₹{getSubtotal()} <span className="text-[9px] text-slate-300 font-normal">({cart.length} item{cart.length > 1 ? 's' : ''})</span></span>
              </div>
            </div>
            <button 
              onClick={() => setCurrentScreen('cart')}
              className="bg-[#D4AF37] hover:bg-[#F3D060] active:scale-95 text-[#1B4D3E] font-black text-[9px] px-3.5 py-2 rounded-xl transition-all uppercase tracking-widest flex items-center space-x-1 cursor-pointer shadow-sm"
            >
              <span>View Basket</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Bottom Tab Navigation Bar (Material 3 Adaptive Pill Styling) */}
        {currentScreen !== 'splash' && currentScreen !== 'auth' && (
          <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-xs border-t border-slate-100 py-1.5 px-2 flex justify-between items-center z-50 shadow-md">
            <button
              onClick={() => setCurrentScreen('home')}
              className="flex flex-col items-center flex-1 cursor-pointer group"
            >
              <div className={`px-4 py-1 rounded-full transition-all duration-200 ${
                currentScreen === 'home' 
                  ? 'bg-emerald-100/70 text-[#1B4D3E]' 
                  : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                <Milk className="w-4 h-4" />
              </div>
              <span className={`text-[7.5px] font-black uppercase tracking-wider mt-0.5 ${
                currentScreen === 'home' ? 'text-[#1B4D3E]' : 'text-slate-400 font-medium'
              }`}>
                Home
              </span>
            </button>

            <button
              onClick={() => setCurrentScreen('products')}
              className="flex flex-col items-center flex-1 cursor-pointer group"
            >
              <div className={`px-4 py-1 rounded-full transition-all duration-200 ${
                currentScreen === 'products' 
                  ? 'bg-emerald-100/70 text-[#1B4D3E]' 
                  : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                <Grid className="w-4 h-4" />
              </div>
              <span className={`text-[7.5px] font-black uppercase tracking-wider mt-0.5 ${
                currentScreen === 'products' ? 'text-[#1B4D3E]' : 'text-slate-400 font-medium'
              }`}>
                Market
              </span>
            </button>

            <button
              onClick={() => setCurrentScreen('subscription')}
              className="flex flex-col items-center flex-1 cursor-pointer group"
            >
              <div className={`px-4 py-1 rounded-full transition-all duration-200 ${
                currentScreen === 'subscription' 
                  ? 'bg-emerald-100/70 text-[#1B4D3E]' 
                  : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                <Calendar className="w-4 h-4" />
              </div>
              <span className={`text-[7.5px] font-black uppercase tracking-wider mt-0.5 ${
                currentScreen === 'subscription' ? 'text-[#1B4D3E]' : 'text-slate-400 font-medium'
              }`}>
                Schedule
              </span>
            </button>

            <button
              onClick={() => setCurrentScreen('contact')}
              className="flex flex-col items-center flex-1 cursor-pointer group"
            >
              <div className={`px-4 py-1 rounded-full transition-all duration-200 ${
                currentScreen === 'contact' 
                  ? 'bg-emerald-100/70 text-[#1B4D3E]' 
                  : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className={`text-[7.5px] font-black uppercase tracking-wider mt-0.5 ${
                currentScreen === 'contact' ? 'text-[#1B4D3E]' : 'text-slate-400 font-medium'
              }`}>
                Chat
              </span>
            </button>

            <button
              onClick={() => setCurrentScreen('profile')}
              className="flex flex-col items-center flex-1 cursor-pointer group"
            >
              <div className={`px-4 py-1 rounded-full transition-all duration-200 ${
                currentScreen === 'profile' 
                  ? 'bg-emerald-100/70 text-[#1B4D3E]' 
                  : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                <User className="w-4 h-4" />
              </div>
              <span className={`text-[7.5px] font-black uppercase tracking-wider mt-0.5 ${
                currentScreen === 'profile' ? 'text-[#1B4D3E]' : 'text-slate-400 font-medium'
              }`}>
                Account
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Temporary leaf icon wrapper shape for local React fallback
function BoxGridShape(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={props.className}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
