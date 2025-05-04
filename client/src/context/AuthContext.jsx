import {createContext, useState} from 'react';

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [isConnected, setIsConnected] = useState(localStorage.getItem("username") !== null);

    return(
        <AuthContext.Provider value={{isConnected, setIsConnected}}>
            {children}
        </AuthContext.Provider>
    )
}
