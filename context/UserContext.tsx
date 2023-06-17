import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@Lib/auth';
import { createUserInDbIfNotFound } from '@Lib/firestore';

type UserProviderProps = {
  children: React.ReactNode;
};

export type UserContext = User | null;

const UserContext = createContext<UserContext>(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        try {
          setUser(null);
          const userCredentials = await signInAnonymously(auth);
          await createUserInDbIfNotFound(userCredentials.user.uid);
        } catch (error) {
          console.log(error);
        }
      }
    });

    return unsubscribe;
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
