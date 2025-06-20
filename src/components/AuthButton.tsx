import React, { useEffect, useState } from "react";
import { auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "../lib/firebase";
import { User } from "firebase/auth";

const AuthButton: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Sign in failed");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src={user.photoURL || ""} alt="User" style={{ width: 32, borderRadius: "50%" }} />
        <span>{user.displayName || user.email}</span>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  return <button onClick={handleSignIn}>Sign in with Google</button>;
};

export default AuthButton; 