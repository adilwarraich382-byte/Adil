import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
  getDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { useAuth } from './AuthContext';
import {
  Tournament,
  Registration,
  Payment,
  NotificationItem,
  Announcement,
  AppSettings,
  RoomCredential
} from '../types';
import { BRAND } from '../assets/branding';

interface TournamentContextType {
  tournaments: Tournament[];
  userRegistrations: Registration[];
  userPayments: Payment[];
  notifications: NotificationItem[];
  announcements: Announcement[];
  appSettings: AppSettings;
  loading: boolean;
  submitTournamentPayment: (params: {
    tournament: Tournament;
    senderName: string;
    senderPhone: string;
    transactionId: string;
    amountPaid: number;
    screenshotBase64?: string;
    teammateNames?: string;
  }) => Promise<{ success: boolean; error?: string; registrationId?: string; paymentId?: string }>;
  getRoomCredentials: (tournamentId: string) => Promise<RoomCredential | null>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  unreadCount: number;
}

const defaultAppSettings: AppSettings = {
  id: 'general',
  easyPaisaNumber: BRAND.easyPaisaDefaultNumber,
  easyPaisaName: BRAND.easyPaisaDefaultName,
  whatsappSupportNumber: BRAND.whatsappDefaultSupport,
  minDeposit: 200,
  defaultSoloFee: 100,
  defaultSoloPrize: 500,
  defaultDuoFee: 200,
  defaultDuoPrize: 1000,
  defaultSquadFee: 400,
  defaultSquadPrize: 2000,
  rulesUrl: 'https://adilesports.pk/rules'
};

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<Registration[]>([]);
  const [userPayments, setUserPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Real-time Tournaments listener
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'tournaments'),
      (snapshot) => {
        const list: Tournament[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Tournament, 'id'>) });
        });
        setTournaments(list);
      },
      (error) => {
        console.error('Error fetching tournaments:', error);
        handleFirestoreError(error, OperationType.GET, 'tournaments');
      }
    );
    return () => unsub();
  }, []);

  // 2. Real-time App Settings listener
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'app_settings', 'general'),
      (snapshot) => {
        if (snapshot.exists()) {
          setAppSettings({ id: snapshot.id, ...(snapshot.data() as Omit<AppSettings, 'id'>) });
        }
      },
      (error) => {
        console.error('Error fetching app settings:', error);
      }
    );
    return () => unsub();
  }, []);

  // 3. Real-time Announcements listener
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'announcements'),
      (snapshot) => {
        const list: Announcement[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Announcement, 'id'>) });
        });
        setAnnouncements(list.filter((a) => a.active));
      },
      (error) => {
        console.error('Error fetching announcements:', error);
      }
    );
    return () => unsub();
  }, []);

  // 4. User-specific real-time listeners (Registrations, Payments, Notifications)
  useEffect(() => {
    if (!user) {
      setUserRegistrations([]);
      setUserPayments([]);
      setNotifications([]);
      setLoading(false);
      return;
    }

    // Registrations listener
    const regQuery = query(collection(db, 'registrations'), where('userId', '==', user.uid));
    const unsubReg = onSnapshot(
      regQuery,
      (snapshot) => {
        const list: Registration[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Registration, 'id'>) });
        });
        setUserRegistrations(list);
      },
      (error) => {
        console.error('Error in registrations snapshot:', error);
        handleFirestoreError(error, OperationType.GET, 'registrations');
      }
    );

    // Payments listener
    const payQuery = query(collection(db, 'payments'), where('userId', '==', user.uid));
    const unsubPay = onSnapshot(
      payQuery,
      (snapshot) => {
        const list: Payment[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Payment, 'id'>) });
        });
        setUserPayments(list);
      },
      (error) => {
        console.error('Error in payments snapshot:', error);
        handleFirestoreError(error, OperationType.GET, 'payments');
      }
    );

    // Notifications listener
    const notifQuery = query(collection(db, 'notifications'), where('userId', '==', user.uid));
    const unsubNotif = onSnapshot(
      notifQuery,
      (snapshot) => {
        const list: NotificationItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<NotificationItem, 'id'>) });
        });
        // Sort newest first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(list);
        setLoading(false);
      },
      (error) => {
        console.error('Error in notifications snapshot:', error);
      }
    );

    return () => {
      unsubReg();
      unsubPay();
      unsubNotif();
    };
  }, [user]);

  // Submit payment & registration
  const submitTournamentPayment = async (params: {
    tournament: Tournament;
    senderName: string;
    senderPhone: string;
    transactionId: string;
    amountPaid: number;
    screenshotBase64?: string;
    teammateNames?: string;
  }): Promise<{ success: boolean; error?: string; registrationId?: string; paymentId?: string }> => {
    if (!user || !profile) {
      return { success: false, error: 'Please login to register for this tournament.' };
    }

    const cleanTrx = params.transactionId.trim().toUpperCase();
    if (!cleanTrx || cleanTrx.length < 5) {
      return { success: false, error: 'Please enter a valid EasyPaisa Transaction ID (TRX ID).' };
    }

    try {
      // 1. Prevent duplicate transaction IDs
      const duplicateQuery = query(collection(db, 'payments'), where('transactionId', '==', cleanTrx));
      const duplicateSnap = await getDocs(duplicateQuery);
      if (!duplicateSnap.empty) {
        return {
          success: false,
          error: `Transaction ID "${cleanTrx}" has already been submitted. Please check your EasyPaisa SMS.`
        };
      }

      // Check if user already registered for this tournament
      const registrationDocId = `${user.uid}_${params.tournament.id}`;
      const existingRegSnap = await getDoc(doc(db, 'registrations', registrationDocId));
      if (existingRegSnap.exists()) {
        const existingData = existingRegSnap.data() as Registration;
        if (existingData.status === 'APPROVED') {
          return { success: false, error: 'You are already registered and confirmed for this tournament!' };
        }
        if (existingData.status === 'PENDING') {
          return { success: false, error: 'You already have a pending registration waiting for admin approval.' };
        }
      }

      const paymentDocId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const nowIso = new Date().toISOString();

      // Create Payment doc
      const paymentData: Payment = {
        id: paymentDocId,
        registrationId: registrationDocId,
        tournamentId: params.tournament.id,
        tournamentTitle: params.tournament.title,
        entryFee: params.tournament.entryFee,
        paymentMethod: 'EasyPaisa',
        recipientNumber: appSettings.easyPaisaNumber,
        recipientName: appSettings.easyPaisaName,
        senderName: params.senderName.trim(),
        senderPhone: params.senderPhone.trim(),
        transactionId: cleanTrx,
        amountPaid: params.amountPaid,
        screenshotUrl: params.screenshotBase64 || '',
        status: 'PENDING',
        userId: user.uid,
        userEmail: user.email || '',
        submittedAt: nowIso
      };

      await setDoc(doc(db, 'payments', paymentDocId), paymentData);

      // Create Registration doc
      const registrationData: Registration = {
        id: registrationDocId,
        tournamentId: params.tournament.id,
        tournamentTitle: params.tournament.title,
        tournamentMode: params.tournament.mode,
        userId: user.uid,
        userName: profile.fullName || params.senderName,
        userEmail: user.email || '',
        whatsapp: profile.whatsapp || params.senderPhone,
        ffUid: profile.ffUid,
        ffIgn: profile.ffIgn,
        teammateNames: params.teammateNames || '',
        paymentId: paymentDocId,
        status: 'PENDING',
        slotNumber: (params.tournament.filledSlots || 0) + 1,
        registeredAt: nowIso
      };

      await setDoc(doc(db, 'registrations', registrationDocId), registrationData);

      // Create in-app notification
      const notifDocId = `notif_${Date.now()}`;
      await setDoc(doc(db, 'notifications', notifDocId), {
        id: notifDocId,
        userId: user.uid,
        title: 'Payment Submitted - Pending Verification',
        message: `Your EasyPaisa payment (TRX: ${cleanTrx}) for ${params.tournament.title} was submitted. Admin will verify it shortly.`,
        type: 'PAYMENT_SUBMITTED',
        read: false,
        targetId: registrationDocId,
        createdAt: nowIso
      });

      return {
        success: true,
        registrationId: registrationDocId,
        paymentId: paymentDocId
      };
    } catch (err: unknown) {
      console.error('Error submitting payment:', err);
      const errorText = err instanceof Error ? err.message : String(err);
      try {
        handleFirestoreError(err, OperationType.WRITE, 'payments');
      } catch {
        // Handled and logged by handleFirestoreError
      }
      return {
        success: false,
        error: errorText || 'Failed to submit payment. Please try again.'
      };
    }
  };

  // Securely retrieve Room Credentials for approved players
  const getRoomCredentials = async (tournamentId: string): Promise<RoomCredential | null> => {
    if (!user) return null;
    try {
      const roomDocRef = doc(db, 'tournaments', tournamentId, 'room_credentials', 'access');
      const roomSnap = await getDoc(roomDocRef);
      if (roomSnap.exists()) {
        return roomSnap.data() as RoomCredential;
      }
      return null;
    } catch (err) {
      console.warn('Unauthorized or room credentials not published yet:', err);
      return null;
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const clearAllNotifications = async () => {
    if (!user) return;
    try {
      for (const n of notifications) {
        if (!n.read) {
          await updateDoc(doc(db, 'notifications', n.id), { read: true });
        }
      }
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        userRegistrations,
        userPayments,
        notifications,
        announcements,
        appSettings,
        loading,
        submitTournamentPayment,
        getRoomCredentials,
        markNotificationRead,
        clearAllNotifications,
        unreadCount
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
