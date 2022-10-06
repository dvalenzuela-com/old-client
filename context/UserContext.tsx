import { onAuthStateChanged, signInAnonymously, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "@Lib/auth";
import { createUserIfNotFound } from "@Lib/firestore";

type UserProviderProps = {
    children: React.ReactNode
}
export type UserContext = {
    getUser: () => User | null;
};

const defaultUserContext: UserContext = {
    getUser: () => null
}

export const UserContext = createContext<UserContext>(defaultUserContext);

export const UserProvider = ({ children }: UserProviderProps) => {

    const [user, setUser] = useState<User | null>(null);

    const [userFound, setUserFound] = useState(true);

    useEffect(() => {
        if (!userFound) {
            signInAnonymously(auth)
                .then(async userCredential => {
                    return createUserIfNotFound(userCredential.user.uid);
                })
                .then(() => {
                    //console.log("final then");
                })
            
        }
    }, [userFound])

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            setUserFound(true);
            setUser(user);
        } else {
            setUser(null);
            setUserFound(false);
        }
    });

    const handleGetUser = () => {
        return user;
    }

    return (
        <UserContext.Provider value={{
            getUser: handleGetUser
        }}>
            {children}
        </UserContext.Provider>
    )
};