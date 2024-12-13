import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, useRef } from 'react';

type StreamStatus = {
    PRIMARY_STATE: 'OFFLINE' | 'ACTIVE' | 'PROCESSING' | 'DEGRADED';
    lastUpdated: number;
    healthMetrics: {
        inputStatus: { state: 'OFFLINE' | 'ACTIVE'; lastUpdated: number };
        outputStatus: { state: 'OFFLINE' | 'ACTIVE'; platform: string; fps: number; latency: number };
    };
};

// Define the global base polling interval in milliseconds
const BASE_POLLING_INTERVAL = 5000;
const MAX_BACKOFF_INTERVAL = 120000; // Maximum backoff interval (e.g., 2 minutes)

export const useStreamStatus = (streamId: string) => {
    const { ready, user } = usePrivy();
    const [status, setStatus] = useState<StreamStatus | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const failureCountRef = useRef(0);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!ready || !user) return;

        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/streams/${streamId}/status`, {
                    headers: {
                        'x-user-id': user?.id,
                    },
                });
                if (!res.ok) {
                    triggerError(`Failed to fetch stream status: ${res.status} ${res.statusText}`);
                    return;
                }

                const { success, error, data } = await res.json();
                if (!success) {
                    triggerError(error);
                    return;
                }
                setStatus(data);
                setError(null);
                failureCountRef.current = 0;
                resetPollingInterval();
            } catch (err: any) {
                triggerError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const triggerError = (errorMsg: string) => {
            setError(errorMsg);
            failureCountRef.current += 1;
            adjustPollingInterval();
        }

        const adjustPollingInterval = () => {
            const nextInterval = Math.min(
                BASE_POLLING_INTERVAL * 2 ** failureCountRef.current,
                MAX_BACKOFF_INTERVAL
            );
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
            intervalIdRef.current = setInterval(fetchStatus, nextInterval);
        };

        const resetPollingInterval = () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
            intervalIdRef.current = setInterval(fetchStatus, BASE_POLLING_INTERVAL);
        };

        // Initial fetch and start polling
        fetchStatus();
        intervalIdRef.current = setInterval(fetchStatus, BASE_POLLING_INTERVAL);

        // Cleanup on component unmount
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [streamId, ready, user]);

    return { status, loading, error };
};
