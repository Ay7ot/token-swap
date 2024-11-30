interface Window {
    ethereum?: {
        isMetaMask?: boolean;
        request?: (...args: any[]) => Promise<any>;
        on?: (...args: any[]) => void;
        removeListener?: (...args: any[]) => void;
        selectedAddress?: string;
        chainId?: string;
        // Add other ethereum provider properties as needed
    };
}