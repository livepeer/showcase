import { useStreamStatus } from '@/hooks/useStreamStatus';
import { Badge } from '@repo/design-system/components/ui/badge';
import { LoaderCircleIcon } from 'lucide-react';

const StreamStatusIndicator = ({ streamId }: { streamId: string }) => {
    
    const { status, loading, error } = useStreamStatus(streamId);

    const getStatusColor = () => {
        const color = (() => {
            switch (status?.PRIMARY_STATE) {
            case 'ACTIVE':
                return 'green';
            case 'PROCESSING':
                return 'yellow';
            case 'DEGRADED':
                return 'red';
            case 'OFFLINE':
                return 'gray';
            default:
                return 'gray';
            }
        })();
        return `bg-${color}-500/90`;
    };


    return (
        <div>
            <Badge className={`${error?'bg-gray-500/90':getStatusColor()} text-white font-medium text-xs`}>
                {loading? <LoaderCircleIcon  className="animate-spin"/> : error ? 'UNKNOWN' : status?.PRIMARY_STATE}
            </Badge>
        </div>
    );
};

export default StreamStatusIndicator;
