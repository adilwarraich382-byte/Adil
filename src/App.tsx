/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

// User App Contexts & Components
import { AuthProvider, useAuth } from './context/AuthContext';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { TournamentsView } from './components/TournamentsView';
import { MyMatchesView } from './components/MyMatchesView';
import { WinnersView } from './components/WinnersView';
import { ProfileView } from './components/ProfileView';
import { PaymentModal } from './components/PaymentModal';
import { TournamentDetailsModal } from './components/TournamentDetailsModal';
import { AuthModal } from './components/AuthModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SupportModal } from './components/SupportModal';
import { PolicyModal } from './components/PolicyModal';
import { DownloadModal } from './components/DownloadModal';

// Admin App Contexts & Components
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminDataProvider, useAdminData } from './context/AdminDataContext';
import { AdminSplashScreen } from './components/admin/AdminSplashScreen';
import { AdminNavbar } from './components/admin/AdminNavbar';
import { AdminBottomNav } from './components/admin/AdminBottomNav';
import { AdminLoginScreen } from './components/admin/AdminLoginScreen';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminTournamentsView } from './components/admin/AdminTournamentsView';
import { AdminPaymentsView } from './components/admin/AdminPaymentsView';
import { AdminUsersView } from './components/admin/AdminUsersView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';
import { AdminWinnersModal } from './components/admin/AdminWinnersModal';
import { AdminAnnounceModal } from './components/admin/AdminAnnounceModal';
import { AdminApkModal } from './components/admin/AdminApkModal';

// Database initial seeding
import { ensureInitialDatabaseData } from './firebase/seed';
import { testFirestoreConnection } from './firebase/config';
import { Tournament } from './types';
import { Shield, Smartphone } from 'lucide-react';

/* =========================================================================
   USER MAIN APP (DEFAULT PUBLIC TOURNAMENT EXPERIENCE)
   ========================================================================= */
function UserMainApp({ onSwitchToAdmin }: { onSwitchToAdmin: () => void }) {
  const { user, profile } = useAuth();
  const { tournaments, userRegistrations } = useTournament();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Modals state
  const [selectedTournamentForDetails, setSelectedTournamentForDetails] = useState<Tournament | null>(null);
  const [selectedTournamentForPayment, setSelectedTournamentForPayment] = useState<Tournament | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [policyModalConfig, setPolicyModalConfig] = useState<{
    isOpen: boolean;
    tab: 'rules' | 'terms' | 'privacy' | 'refund' | 'apk';
  }>({
    isOpen: false,
    tab: 'rules'
  });

  const handleOpenAuth = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleJoinTournament = (tournament: Tournament) => {
    if (!user) {
      handleOpenAuth('signup');
      return;
    }
    setSelectedTournamentForPayment(tournament);
  };

  const handleSelectTournament = (tournament: Tournament) => {
    setSelectedTournamentForDetails(tournament);
  };

  const handleSelectTournamentById = (tournamentId: string) => {
    const match = tournaments.find((t) => t.id === tournamentId);
    if (match) {
      setSelectedTournamentForDetails(match);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Main Container - Android Mobile First Frame */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col min-h-screen border-x border-white/5 bg-[#0a0a0c] shadow-2xl relative">
        {/* Quick App Switcher Top Strip */}
        <div className="bg-gradient-to-r from-red-950/80 via-black to-zinc-950 px-3 py-1 border-b border-red-500/20 flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-heading font-bold text-amber-400">USER TOURNAMENT APP</span>
          </div>
          <button
            onClick={onSwitchToAdmin}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-red-600/30 border border-red-500/40 text-red-300 font-bold hover:bg-red-600/50 active:scale-95 transition-all"
          >
            <Shield className="w-3 h-3 text-red-400" />
            <span>SWITCH TO ADMIN APP</span>
          </button>
        </div>

        {/* Top Navbar */}
        <Navbar
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSupport={() => setIsSupportOpen(true)}
          onOpenAuth={() => handleOpenAuth('login')}
          onOpenDownload={() => setIsDownloadOpen(true)}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenAdmin={onSwitchToAdmin}
        />

        {/* Tab Content */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <HomeView
              onSelectTournament={handleSelectTournament}
              onJoinTournament={handleJoinTournament}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAuth={() => handleOpenAuth('login')}
              onOpenDownload={() => setIsDownloadOpen(true)}
            />
          )}

          {activeTab === 'tournaments' && (
            <TournamentsView
              onSelectTournament={handleSelectTournament}
              onJoinTournament={handleJoinTournament}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'my-matches' && (
            <MyMatchesView
              onJoinMore={() => setActiveTab('tournaments')}
              onOpenAuth={() => handleOpenAuth('login')}
              onSelectTournamentById={handleSelectTournamentById}
            />
          )}

          {activeTab === 'winners' && <WinnersView />}

          {activeTab === 'profile' && (
            <ProfileView
              onOpenAuth={() => handleOpenAuth('login')}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenSupport={() => setIsSupportOpen(true)}
              onOpenPolicies={(tab) => setPolicyModalConfig({ isOpen: true, tab })}
              onOpenDownload={() => setIsDownloadOpen(true)}
              onOpenAdmin={onSwitchToAdmin}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
      </div>

      {/* USER APP MODALS */}
      <TournamentDetailsModal
        tournament={selectedTournamentForDetails}
        isOpen={Boolean(selectedTournamentForDetails)}
        onClose={() => setSelectedTournamentForDetails(null)}
        onJoin={(t) => {
          setSelectedTournamentForDetails(null);
          handleJoinTournament(t);
        }}
        isRegistered={
          selectedTournamentForDetails
            ? userRegistrations.some(
                (r) =>
                  r.tournamentId === selectedTournamentForDetails.id &&
                  (r.status === 'PENDING' || r.status === 'APPROVED')
              )
            : false
        }
      />

      <PaymentModal
        tournament={selectedTournamentForPayment}
        isOpen={Boolean(selectedTournamentForPayment)}
        onClose={() => setSelectedTournamentForPayment(null)}
        onSuccess={() => {
          setSelectedTournamentForPayment(null);
          setActiveTab('my-matches');
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={(tab) => {
          setIsNotificationsOpen(false);
          setActiveTab(tab);
        }}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <PolicyModal
        isOpen={policyModalConfig.isOpen}
        onClose={() => setPolicyModalConfig((prev) => ({ ...prev, isOpen: false }))}
        initialTab={policyModalConfig.tab}
      />

      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </div>
  );
}

/* =========================================================================
   ADMIN MAIN APP (EXECUTIVE CONTROLLER EXPERIENCE)
   ========================================================================= */
function AdminMainApp({ onSwitchToUser }: { onSwitchToUser: () => void }) {
  const { adminUser, loading, isAdminAuthorized } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Modals
  const [isCreateTournamentOpen, setIsCreateTournamentOpen] = useState(false);
  const [isWinnersModalOpen, setIsWinnersModalOpen] = useState(false);
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080b] flex flex-col items-center justify-center space-y-3 text-zinc-400">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-widest font-heading font-bold text-zinc-300">
          INITIALIZING ADIL ESPORTS ADMIN GATEWAY...
        </span>
      </div>
    );
  }

  // If not authenticated as admin, show secure Admin Login ONLY
  if (!adminUser || !isAdminAuthorized) {
    return <AdminLoginScreen onSwitchToUserApp={onSwitchToUser} />;
  }

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Splash Screen */}
      {showSplash && <AdminSplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Main Admin App Frame */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col min-h-screen border-x border-red-500/10 bg-[#090b10] shadow-2xl relative">
        {/* Quick App Switcher Top Strip */}
        <div className="bg-gradient-to-r from-red-950 via-black to-zinc-950 px-3 py-1 border-b border-red-500/30 flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-heading font-bold text-red-400">ADMIN CONTROL PANEL</span>
          </div>
          <button
            onClick={onSwitchToUser}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-500/30 active:scale-95 transition-all"
          >
            <Smartphone className="w-3 h-3 text-amber-400" />
            <span>SWITCH TO USER APP</span>
          </button>
        </div>

        {/* Top Navbar */}
        <AdminNavbar
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenApkModal={() => setIsApkModalOpen(true)}
          onOpenAnnounceModal={() => setIsAnnounceModalOpen(true)}
          onSwitchToUserApp={onSwitchToUser}
        />

        {/* Tab Content */}
        <main className="flex-1 pt-3">
          {activeTab === 'dashboard' && (
            <AdminDashboardView
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenCreateTournament={() => setIsCreateTournamentOpen(true)}
            />
          )}

          {activeTab === 'tournaments' && (
            <AdminTournamentsView
              onOpenCreate={() => setIsCreateTournamentOpen(true)}
              isCreateModalOpen={isCreateTournamentOpen}
              onCloseCreate={() => setIsCreateTournamentOpen(false)}
            />
          )}

          {activeTab === 'payments' && <AdminPaymentsView />}

          {activeTab === 'users' && <AdminUsersView />}

          {activeTab === 'settings' && (
            <AdminSettingsView
              onOpenWinnersModal={() => setIsWinnersModalOpen(true)}
              onOpenAnnounceModal={() => setIsAnnounceModalOpen(true)}
              onOpenApkModal={() => setIsApkModalOpen(true)}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <AdminBottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
      </div>

      {/* Modals */}
      <AdminWinnersModal
        isOpen={isWinnersModalOpen}
        onClose={() => setIsWinnersModalOpen(false)}
      />

      <AdminAnnounceModal
        isOpen={isAnnounceModalOpen}
        onClose={() => setIsAnnounceModalOpen(false)}
      />

      <AdminApkModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}

/* =========================================================================
   ROOT APPLICATION (DEFAULT: USER APP; SWITCHABLE TO ADMIN APP)
   ========================================================================= */
export default function App() {
  const [currentApp, setCurrentApp] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    // Validate connection to Firestore and seed defaults if needed
    testFirestoreConnection();
    ensureInitialDatabaseData();
  }, []);

  if (currentApp === 'admin') {
    return (
      <AdminAuthProvider>
        <AdminDataProvider>
          <AdminMainApp onSwitchToUser={() => setCurrentApp('user')} />
        </AdminDataProvider>
      </AdminAuthProvider>
    );
  }

  // DEFAULT: ADIL ESPORTS USER APP
  return (
    <AuthProvider>
      <TournamentProvider>
        <UserMainApp onSwitchToAdmin={() => setCurrentApp('admin')} />
      </TournamentProvider>
    </AuthProvider>
  );
}
