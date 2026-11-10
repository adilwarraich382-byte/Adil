import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { useAdminAuth } from './AdminAuthContext';
import {
  Tournament,
  Registration,
  Payment,
  UserProfile,
  AppSettings,
  Announcement,
  TournamentResult,
  PrizeDistribution,
  NotificationItem,
  RoomCredential
} from '../types';
import { ADMIN_BRAND } from '../assets/branding';

interface AdminDataContextType {
  tournaments: Tournament[];
  payments: Payment[];
  registrations: Registration[];
  users: UserProfile[];
  appSettings: AppSettings;
  announcements: Announcement[];
  tournamentResults: TournamentResult[];
  prizeDistributions: PrizeDistribution[];
  loading: boolean;

  // Tournament controls
  createTournament: (data: Omit<Tournament, 'id' | 'createdAt' | 'filledSlots'>) => Promise<string>;
  updateTournament: (id: string, data: Partial<Tournament>) => Promise<void>;
  deleteTournament: (id: string) => Promise<void>;
  publishRoomCredentials: (
    tournamentId: string,
    roomId: string,
    roomPassword: string,
    instructions: string,
    matchTime: string
  ) => Promise<void>;
  getTournamentRoomCredentials: (tournamentId: string) => Promise<RoomCredential | null>;

  // Payment verification controls
  approvePayment: (payment: Payment) => Promise<void>;
  rejectPayment: (payment: Payment, reason: string) => Promise<void>;
  checkDuplicateTrx: (trxId: string, currentPaymentId?: string) => Payment[];

  // User management
  toggleBlockUser: (userId: string, currentBlockedStatus: boolean) => Promise<void>;

  // App settings & dynamic pricing
  updateAppSettings: (newSettings: Partial<AppSettings>) => Promise<void>;

  // Announcements & notifications
  publishAnnouncement: (title: string, content: string, type: 'BANNER' | 'GENERAL' | 'URGENT') => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  sendNotificationToUser: (
    userId: string,
    title: string,
    message: string,
    type?: NotificationItem['type']
  ) => Promise<void>;
  broadcastNotificationToAll: (title: string, message: string) => Promise<void>;

  // Winners & Leaderboard
  publishTournamentResult: (data: Omit<TournamentResult, 'id' | 'publishedAt'>) => Promise<void>;
  markPrizePaid: (params: {
    tournamentId: string;
    winnerUid: string;
    playerName: string;
    ffUid: string;
    prizeAmount: number;
    transactionRef: string;
  }) => Promise<void>;
}

const defaultSettings: AppSettings = {
  id: 'general',
  easyPaisaNumber: ADMIN_BRAND.defaultEasyPaisaNumber,
  easyPaisaName: ADMIN_BRAND.defaultEasyPaisaName,
  whatsappSupportNumber: ADMIN_BRAND.defaultWhatsappSupport,
  minDeposit: 200,
  defaultSoloFee: 100,
  defaultSoloPrize: 500,
  defaultDuoFee: 200,
  defaultDuoPrize: 1000,
  defaultSquadFee: 400,
  defaultSquadPrize: 2000,
  rulesUrl: 'https://adilesports.pk/rules'
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminUser, isAdminAuthorized } = useAdminAuth();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultSettings);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tournamentResults, setTournamentResults] = useState<TournamentResult[]>([]);
  const [prizeDistributions, setPrizeDistributions] = useState<PrizeDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminAuthorized) {
      setTournaments([]);
      setPayments([]);
      setRegistrations([]);
      setUsers([]);
      setAnnouncements([]);
      setTournamentResults([]);
      setPrizeDistributions([]);
      setLoading(false);
      return;
    }

    // 1. Tournaments
    const unsubTourneys = onSnapshot(
      collection(db, 'tournaments'),
      (snap) => {
        const list: Tournament[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Tournament, 'id'>) }));
        setTournaments(list);
      },
      (err) => console.error('Tournaments snap error:', err)
    );

    // 2. Payments (Sorted newest first)
    const unsubPayments = onSnapshot(
      collection(db, 'payments'),
      (snap) => {
        const list: Payment[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Payment, 'id'>) }));
        list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setPayments(list);
      },
      (err) => console.error('Payments snap error:', err)
    );

    // 3. Registrations
    const unsubRegs = onSnapshot(
      collection(db, 'registrations'),
      (snap) => {
        const list: Registration[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Registration, 'id'>) }));
        list.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
        setRegistrations(list);
      },
      (err) => console.error('Registrations snap error:', err)
    );

    // 4. Users
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const list: UserProfile[] = [];
        snap.forEach((d) => list.push({ uid: d.id, ...(d.data() as Omit<UserProfile, 'uid'>) }));
        setUsers(list);
      },
      (err) => console.error('Users snap error:', err)
    );

    // 5. App Settings
    const unsubSettings = onSnapshot(
      doc(db, 'app_settings', 'general'),
      (snap) => {
        if (snap.exists()) {
          setAppSettings({ id: snap.id, ...(snap.data() as Omit<AppSettings, 'id'>) });
        }
      },
      (err) => console.error('Settings snap error:', err)
    );

    // 6. Announcements
    const unsubAnnounce = onSnapshot(
      collection(db, 'announcements'),
      (snap) => {
        const list: Announcement[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Announcement, 'id'>) }));
        setAnnouncements(list);
      },
      (err) => console.error('Announcements snap error:', err)
    );

    // 7. Results
    const unsubResults = onSnapshot(
      collection(db, 'tournament_results'),
      (snap) => {
        const list: TournamentResult[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<TournamentResult, 'id'>) }));
        setTournamentResults(list);
      },
      (err) => console.error('Results snap error:', err)
    );

    // 8. Prize Distributions
    const unsubPrizes = onSnapshot(
      collection(db, 'prize_distributions'),
      (snap) => {
        const list: PrizeDistribution[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<PrizeDistribution, 'id'>) }));
        setPrizeDistributions(list);
        setLoading(false);
      },
      (err) => console.error('Prizes snap error:', err)
    );

    return () => {
      unsubTourneys();
      unsubPayments();
      unsubRegs();
      unsubUsers();
      unsubSettings();
      unsubAnnounce();
      unsubResults();
      unsubPrizes();
    };
  }, [isAdminAuthorized]);

  // Check duplicate TRX IDs
  const checkDuplicateTrx = (trxId: string, currentPaymentId?: string): Payment[] => {
    if (!trxId) return [];
    const normalized = trxId.trim().toUpperCase();
    return payments.filter(
      (p) => p.transactionId.toUpperCase() === normalized && p.id !== currentPaymentId
    );
  };

  // Tournament controls
  const createTournament = async (
    data: Omit<Tournament, 'id' | 'createdAt' | 'filledSlots'>
  ): Promise<string> => {
    const id = `tourney_${data.mode.toLowerCase()}_${Date.now()}`;
    const newTournament: Tournament = {
      ...data,
      id,
      filledSlots: 0,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'tournaments', id), newTournament);

    // If initial room credentials provided, save in subcollection
    if (data.roomId && data.roomPassword) {
      await publishRoomCredentials(
        id,
        data.roomId,
        data.roomPassword,
        'Join Free Fire Custom room 10 minutes before start time.',
        data.matchTime
      );
    }

    return id;
  };

  const updateTournament = async (id: string, data: Partial<Tournament>) => {
    await updateDoc(doc(db, 'tournaments', id), {
      ...data,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteTournament = async (id: string) => {
    await deleteDoc(doc(db, 'tournaments', id));
  };

  const publishRoomCredentials = async (
    tournamentId: string,
    roomId: string,
    roomPassword: string,
    instructions: string,
    matchTime: string
  ) => {
    const credRef = doc(db, 'tournaments', tournamentId, 'room_credentials', 'access');
    const nowIso = new Date().toISOString();
    await setDoc(credRef, {
      roomId,
      roomPassword,
      instructions: instructions || 'Join Free Fire Custom room 10 minutes prior to scheduled start.',
      matchTime,
      publishedAt: nowIso
    });

    // Also update parent tournament doc
    await updateDoc(doc(db, 'tournaments', tournamentId), {
      roomId,
      roomPassword,
      credentialsPublishedAt: nowIso
    });

    // Notify all approved participants of this tournament
    const approvedRegs = registrations.filter(
      (r) => r.tournamentId === tournamentId && r.status === 'APPROVED'
    );
    for (const reg of approvedRegs) {
      await sendNotificationToUser(
        reg.userId,
        'Match Room ID Published!',
        `Custom Room ID & Password are now available in My Matches for ${reg.tournamentTitle}. Room ID: ${roomId}`,
        'ROOM_PUBLISHED'
      );
    }
  };

  const getTournamentRoomCredentials = async (tournamentId: string): Promise<RoomCredential | null> => {
    try {
      const snap = await getDoc(doc(db, 'tournaments', tournamentId, 'room_credentials', 'access'));
      if (snap.exists()) {
        return snap.data() as RoomCredential;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Payment Verification Actions
  const approvePayment = async (payment: Payment) => {
    const nowIso = new Date().toISOString();

    // 1. Update Payment status to APPROVED
    await updateDoc(doc(db, 'payments', payment.id), {
      status: 'APPROVED',
      reviewedAt: nowIso,
      reviewedBy: adminUser?.email || 'admin'
    });

    // 2. Update Registration status to APPROVED
    if (payment.registrationId) {
      await updateDoc(doc(db, 'registrations', payment.registrationId), {
        status: 'APPROVED'
      });
    }

    // 3. Increment tournament filledSlots
    if (payment.tournamentId) {
      try {
        await updateDoc(doc(db, 'tournaments', payment.tournamentId), {
          filledSlots: increment(1)
        });
      } catch (e) {
        console.warn('Could not increment tournament slots:', e);
      }
    }

    // 4. Send Notification to User
    await sendNotificationToUser(
      payment.userId,
      'Payment Approved • Registration Confirmed!',
      `Congratulations! Your EasyPaisa payment for ${payment.tournamentTitle} (TRX: ${payment.transactionId}) has been verified. You are confirmed!`,
      'PAYMENT_APPROVED'
    );
  };

  const rejectPayment = async (payment: Payment, reason: string) => {
    const nowIso = new Date().toISOString();
    const cleanReason = reason.trim() || 'Invalid Transaction ID or payment not received.';

    // 1. Update Payment status to REJECTED
    await updateDoc(doc(db, 'payments', payment.id), {
      status: 'REJECTED',
      rejectionReason: cleanReason,
      reviewedAt: nowIso,
      reviewedBy: adminUser?.email || 'admin'
    });

    // 2. Update Registration status to REJECTED
    if (payment.registrationId) {
      await updateDoc(doc(db, 'registrations', payment.registrationId), {
        status: 'REJECTED',
        rejectionReason: cleanReason
      });
    }

    // 3. Send Notification to User
    await sendNotificationToUser(
      payment.userId,
      'Payment Rejected',
      `Your EasyPaisa payment for ${payment.tournamentTitle} was rejected. Reason: ${cleanReason}. Please re-submit valid details or contact support.`,
      'PAYMENT_REJECTED'
    );
  };

  // User management
  const toggleBlockUser = async (userId: string, currentBlockedStatus: boolean) => {
    await updateDoc(doc(db, 'users', userId), {
      isBlocked: !currentBlockedStatus,
      updatedAt: new Date().toISOString()
    });
  };

  // App settings & Dynamic Pricing Control
  const updateAppSettings = async (newSettings: Partial<AppSettings>) => {
    await setDoc(doc(db, 'app_settings', 'general'), {
      ...newSettings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  // Announcements & Notifications
  const publishAnnouncement = async (
    title: string,
    content: string,
    type: 'BANNER' | 'GENERAL' | 'URGENT'
  ) => {
    const id = `ann_${Date.now()}`;
    await setDoc(doc(db, 'announcements', id), {
      id,
      title,
      content,
      type,
      active: true,
      createdAt: new Date().toISOString()
    });
  };

  const deleteAnnouncement = async (id: string) => {
    await deleteDoc(doc(db, 'announcements', id));
  };

  const sendNotificationToUser = async (
    userId: string,
    title: string,
    message: string,
    type: NotificationItem['type'] = 'SYSTEM'
  ) => {
    const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  const broadcastNotificationToAll = async (title: string, message: string) => {
    for (const u of users) {
      await sendNotificationToUser(u.uid, title, message, 'SYSTEM');
    }
  };

  // Winners & Leaderboard
  const publishTournamentResult = async (data: Omit<TournamentResult, 'id' | 'publishedAt'>) => {
    const id = `res_${data.tournamentId}_${Date.now()}`;
    const resultObj: TournamentResult = {
      ...data,
      id,
      publishedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'tournament_results', id), resultObj);

    // Update tournament status to COMPLETED
    await updateDoc(doc(db, 'tournaments', data.tournamentId), {
      status: 'COMPLETED'
    });

    // Broadcast notification
    await broadcastNotificationToAll(
      `Tournament Results Announced: ${data.tournamentTitle}`,
      `The official results and prize leaderboard for ${data.tournamentTitle} have been published!`
    );
  };

  const markPrizePaid = async ({
    tournamentId,
    winnerUid,
    playerName,
    ffUid,
    prizeAmount,
    transactionRef
  }: {
    tournamentId: string;
    winnerUid: string;
    playerName: string;
    ffUid: string;
    prizeAmount: number;
    transactionRef: string;
  }) => {
    const prizeId = `prize_${Date.now()}`;
    await setDoc(doc(db, 'prize_distributions', prizeId), {
      id: prizeId,
      tournamentId,
      winnerUid,
      playerName,
      ffUid,
      prizeAmount,
      paymentMethod: 'EasyPaisa',
      transactionRef,
      status: 'SENT',
      sentAt: new Date().toISOString()
    });

    if (winnerUid) {
      await sendNotificationToUser(
        winnerUid,
        'Cash Prize Distributed!',
        `Your prize of ${prizeAmount} PKR has been sent via EasyPaisa (Ref: ${transactionRef}). Congratulations!`,
        'RESULTS_ANNOUNCED'
      );
    }
  };

  return (
    <AdminDataContext.Provider
      value={{
        tournaments,
        payments,
        registrations,
        users,
        appSettings,
        announcements,
        tournamentResults,
        prizeDistributions,
        loading,
        createTournament,
        updateTournament,
        deleteTournament,
        publishRoomCredentials,
        getTournamentRoomCredentials,
        approvePayment,
        rejectPayment,
        checkDuplicateTrx,
        toggleBlockUser,
        updateAppSettings,
        publishAnnouncement,
        deleteAnnouncement,
        sendNotificationToUser,
        broadcastNotificationToAll,
        publishTournamentResult,
        markPrizePaid
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
