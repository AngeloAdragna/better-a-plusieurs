import {createContext, useContext, useState} from 'react';

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [isConnected, setIsConnected] = useState(false);

    return(
        <AuthContext.Provider value={{isConnected, setIsConnected}}>
            {children}
        </AuthContext.Provider>
    )
}