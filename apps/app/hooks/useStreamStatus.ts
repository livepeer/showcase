import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, useRef } from 'react';

type StreamStatus = {
    state: 'OFFLINE' | 'ONLINE' | 'DEGRADED_INPUT' | 'DEGRADED_OUTPUT';
    last_updated: number;
    input_status: {
        last_frame_time: number;
        fps: number;
    };
    output_status: {
        last_frame_time: number;
        fps: number;
        last_restart_time: number | null;
        last_error_time: number | null;
    };
};

const BASE_POLLING_INTERVAL = 5000;
const MAX_BACKOFF_INTERVAL = 120000; // Maximum backoff interval (e.g., 2 minutes)

export const useStreamStatus = (streamId: string) => {
    const { ready, user } = usePrivy();
    const [status, setStatus] = useState<StreamStatus | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const failureCountRef = useRef(0);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

    const determineStreamStatus = (apiResponse: any): StreamStatus => {
        const now = Date.now() / 1000;

        const {
            input_fps,
            output_fps,
            last_input_time,
            last_output_time,
            last_restart_time,
            last_error_time,
        } = apiResponse;

        const inputHealthyThreshold = 2; // seconds
        const inputOfflineThreshold = 60; // seconds
        const outputHealthyThreshold = 5; // seconds
        const outputOfflineThreshold = 60; // seconds
        const fpsMinThreshold = Math.min(10, 0.8 * input_fps);

        const inputIsHealthy = now - last_input_time < inputHealthyThreshold;
        const inputIsOffline = now - last_input_time > inputOfflineThreshold;

        const outputIsHealthy = now - last_output_time < outputHealthyThreshold;
        const outputIsOffline = now - last_output_time > outputOfflineThreshold;

        const inputDegraded = input_fps < 15;
        const outputDegraded = output_fps < fpsMinThreshold;

        let state: StreamStatus["state"] = "OFFLINE";

        if (inputIsHealthy && outputIsHealthy) {
            if (!inputDegraded && !outputDegraded) {
                state = "ONLINE";
            } else if (inputDegraded) {
                state = "DEGRADED_INPUT";
            } else if (outputDegraded) {
                state = "DEGRADED_OUTPUT";
            }
        } else if (inputIsOffline || outputIsOffline) {
            state = "OFFLINE";
        }

        return {
            state,
            last_updated: now,
            input_status: {
                last_frame_time: last_input_time,
                fps: input_fps,
            },
            output_status: {
                last_frame_time: last_output_time,
                fps: output_fps,
                last_restart_time: last_restart_time || null,
                last_error_time: last_error_time || null,
            },
        };
    };

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
                if (!success || !data) {
                    triggerError(error??"No stream data returned from api");
                    return;
                }
                // example output from api -> {"input_fps":23.992516753574126,"last_error":null,"last_error_time":null,"last_input_time":1734119451.551498,"last_output_time":1734119451.5212831,"last_params":{},"last_params_hash":"-2083727633593109426","last_params_update_time":null,"last_restart_logs":null,"last_restart_time":null,"output_fps":13.07218761733542,"pipeline":"streamdiffusion","pipeline_id":"pip_p4XsqEJk2ZqqWLuw","request_id":"dcfa489c","restart_count":0,"start_time":1734119361.5293992,"stream_id":"str_jzpgwxehWzYSUBAi","type":"status"}
                const transformedStatus = determineStreamStatus(data);
                setStatus(transformedStatus);
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
        };

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

        fetchStatus();
        intervalIdRef.current = setInterval(fetchStatus, BASE_POLLING_INTERVAL);

        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [streamId, ready, user]);

    return { status, loading, error };
};
