import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<void> {
  try {
    await signInWithPopup(auth, provider);
  } catch (e: unknown) {
    const error = e as { code?: string };
    // Popup blocked or closed — fall back to redirect
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      await signInWithRedirect(auth, provider);
    } else {
      throw e;
    }
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
