import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signup: (params: {
    fullName: string;
    email: string;
    password: string;
    whatsapp: string;
    ffUid: string;
    ffIgn: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isProfileComplete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch or create user profile
  const fetchUserProfile = async (firebaseUser: User): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        return data;
      } else {
        // Fallback for third-party or newly authenticated user
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          fullName: firebaseUser.displayName || 'Free Fire Warrior',
          email: firebaseUser.email || '',
          whatsapp: '',
          ffUid: '',
          ffIgn: '',
          photoURL: firebaseUser.photoURL || undefined,
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
        return newProfile;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async ({
    fullName,
    email,
    password,
    whatsapp,
    ffUid,
    ffIgn
  }: {
    fullName: string;
    email: string;
    password: string;
    whatsapp: string;
    ffUid: string;
    ffIgn: string;
  }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateAuthProfile(cred.user, { displayName: fullName });

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      fullName,
      email,
      whatsapp,
      ffUid,
      ffIgn,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setProfile(newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${cred.user.uid}`);
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      await fetchUserProfile(res.user);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatePayload = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(userDocRef, updatePayload);
      setProfile((prev) => (prev ? { ...prev, ...updatePayload } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  const isProfileComplete = Boolean(
    profile && profile.ffUid && profile.ffIgn && profile.whatsapp
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signup,
        login,
        loginWithGoogle,
        resetPassword,
        logout,
        updateUserProfile,
        refreshProfile,
        isProfileComplete
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
