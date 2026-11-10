import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase/config';
import { UserProfile } from '../types';
import { ADMIN_BRAND } from '../assets/branding';

interface AdminAuthContextType {
  adminUser: User | null;
  adminProfile: UserProfile | null;
  loading: boolean;
  loginAdmin: (email: string, pass: string) => Promise<void>;
  createInitialAdminAccount: (email: string, pass: string, name: string) => Promise<void>;
  resetAdminPassword: (email: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  isAdminAuthorized: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check admin role
  const verifyAdminPrivileges = async (firebaseUser: User): Promise<boolean> => {
    try {
      const isSuperAdminEmail =
        firebaseUser.email?.toLowerCase() === ADMIN_BRAND.defaultAdminEmail.toLowerCase();

      // Check users collection
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        if (data.role === 'admin' || isSuperAdminEmail) {
          if (data.role !== 'admin' && isSuperAdminEmail) {
            await updateDoc(userDocRef, { role: 'admin' });
            data.role = 'admin';
          }
          // Also guarantee admins collection entry
          await setDoc(doc(db, 'admins', firebaseUser.uid), {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'admin',
            lastLogin: new Date().toISOString()
          }, { merge: true });

          setAdminProfile(data);
          setAdminUser(firebaseUser);
          return true;
        }
      } else if (isSuperAdminEmail) {
        // Create initial admin user record
        const initialProfile: UserProfile = {
          uid: firebaseUser.uid,
          fullName: 'Adil Warraich (Super Admin)',
          email: firebaseUser.email || ADMIN_BRAND.defaultAdminEmail,
          whatsapp: '03456311135',
          ffUid: '2847910245',
          ffIgn: '亗ADIL_ADMIN亗',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userDocRef, initialProfile);
        await setDoc(doc(db, 'admins', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: 'admin',
          lastLogin: new Date().toISOString()
        }, { merge: true });
        setAdminProfile(initialProfile);
        setAdminUser(firebaseUser);
        return true;
      }

      // If user has no admin role and is not the super admin email:
      await signOut(auth);
      setAdminUser(null);
      setAdminProfile(null);
      return false;
    } catch (err) {
      console.error('Error verifying admin authorization:', err);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await verifyAdminPrivileges(currentUser);
      } else {
        setAdminUser(null);
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAdmin = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const isAllowed = await verifyAdminPrivileges(cred.user);
    if (!isAllowed) {
      throw new Error(
        'ACCESS DENIED: This account does not possess administrator permissions for ADIL ESPORTS.'
      );
    }
  };

  const createInitialAdminAccount = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const initialProfile: UserProfile = {
      uid: cred.user.uid,
      fullName: name || 'Adil Warraich',
      email: cred.user.email || email.trim(),
      whatsapp: '03456311135',
      ffUid: '2847910245',
      ffIgn: '亗ADIL_ADMIN亗',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', cred.user.uid), initialProfile);
    await setDoc(doc(db, 'admins', cred.user.uid), {
      uid: cred.user.uid,
      email: cred.user.email,
      role: 'admin',
      created: new Date().toISOString()
    });
    setAdminProfile(initialProfile);
    setAdminUser(cred.user);
  };

  const resetAdminPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const logoutAdmin = async () => {
    await signOut(auth);
    setAdminUser(null);
    setAdminProfile(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminProfile,
        loading,
        loginAdmin,
        createInitialAdminAccount,
        resetAdminPassword,
        logoutAdmin,
        isAdminAuthorized: Boolean(adminUser && adminProfile?.role === 'admin')
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
