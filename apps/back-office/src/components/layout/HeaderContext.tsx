import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface HeaderStore {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    backPath?: string;
    onBack?: () => void;
    search?: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    } | null;
    tabs?: ReactNode;
}

interface HeaderContextType {
    header: HeaderStore;
    setHeader: (header: HeaderStore) => void;
    resetHeader: () => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
    const [header, setHeaderState] = useState<HeaderStore>({ title: '' });

    const setHeader = useCallback((newHeader: HeaderStore) => {
        setHeaderState(newHeader);
    }, []);

    const resetHeader = useCallback(() => {
        setHeaderState({ title: '' });
    }, []);

    return (
        <HeaderContext.Provider value={{ header, setHeader, resetHeader }}>
            {children}
        </HeaderContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHeader() {
    const context = useContext(HeaderContext);
    if (context === undefined) {
        throw new Error('useHeader must be used within a HeaderProvider');
    }
    return context;
}
