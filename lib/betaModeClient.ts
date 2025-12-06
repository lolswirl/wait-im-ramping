"use client";

// simulated beta in local dev with NEXT_PUBLIC_IS_BETA=true in startup scripts
export function useIsBeta(): boolean {
    if (typeof window === 'undefined') {
        return process.env.NEXT_PUBLIC_IS_BETA === 'true';
    }
    
    const hostname = window.location.hostname;
    
    if (hostname === 'beta.waitimramping.com' || hostname.startsWith('beta.')) {
        return true;
    }
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return process.env.NEXT_PUBLIC_IS_BETA === 'true';
    }
    
    return false;
}