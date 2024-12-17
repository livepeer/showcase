'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@repo/design-system/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useRouter, useSearchParams } from 'next/navigation';

interface DateRangePickerProps {
  className?: string;
  onDateRangeChange?: (from: Date, to: Date) => void;
  'aria-label'?: string;
}

export function DateRangePicker({
  className,
  onDateRangeChange,
  'aria-label': ariaLabel,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>();

  const updateDateRange = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return;
    setDate(range);
    onDateRangeChange?.(range.from, range.to);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-range-picker"
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
            aria-label={ariaLabel || 'Select date range'}
            role="button"
            data-testid="date-range-picker-button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={updateDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
