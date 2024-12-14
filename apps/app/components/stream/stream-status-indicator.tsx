import { useStreamStatus } from '@/hooks/useStreamStatus';
import { Badge } from '@repo/design-system/components/ui/badge';
import { LoaderCircleIcon } from 'lucide-react';

const StreamStatusIndicator = ({ streamId }: { streamId: string }) => {
    
    const { status, loading, error } = useStreamStatus(streamId);

    const getStatusColor = () => {
        const color = (() => {
            switch (status?.state) {
            case 'ONLINE':
                return 'green';
            case 'OFFLINE':
                return 'gray';
            case 'DEGRADED_INPUT':
            case 'DEGRADED_OUTPUT':
                return 'red';
            default:
                return 'gray';
            }
        })();
        return `bg-${color}-500/90`;
    };


    return (
        <div>
            <Badge className={`${error?'bg-gray-500/90':getStatusColor()} text-white font-medium text-xs`}>
                {loading? <LoaderCircleIcon  className="animate-spin"/> : error || !status?.state ? 'UNKNOWN' : status?.state}
            </Badge>
        </div>
    );
};

export default StreamStatusIndicator;
