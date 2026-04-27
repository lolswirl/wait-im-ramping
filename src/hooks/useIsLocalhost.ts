import { useState, useEffect } from "react";

export const useIsLocalhost = (): boolean => {
    const [isLocalhost, setIsLocalhost] = useState(false);

    useEffect(() => {
        setIsLocalhost(
            window.location.hostname === "localhost" || 
            window.location.hostname === "127.0.0.1"
        );
    }, []);

    return isLocalhost;
};
