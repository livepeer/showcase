'use client';

import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/design-system/components/ui/alert-dialog';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Progress } from '@repo/design-system/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Billing() {
  const [selectedCredits, setSelectedCredits] = useState<null | number>(null);
  const [showBilling, setShowBilling] = React.useState(false);

  const searchParams = useSearchParams();
  const billing = searchParams.get('billing');

  const router = useRouter();

  const handleClose = () => {
    setShowBilling(false);
    router.replace(window.location.pathname);
  };

  const handleBuyCredits = () => {
    toast.success(`Purchased ${selectedCredits} credits`);
    setSelectedCredits(3000);
    handleClose();
  };

  useEffect(() => {
    setShowBilling(billing === 'true');
  }, [billing]);

  return (
    <AlertDialog open={showBilling} onOpenChange={setShowBilling}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-medium">
            Billing and Credits
          </AlertDialogTitle>
          <AlertDialogDescription>
            Credits are used to run pipelines. You can purchase more credits
            from here. 1 credit provides 1 minutes of ingest usage.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 ">
            <p className="text-md font-medium">Gateway Provider</p>
          </div>
          <div className="mt-2 mb-4">
            <Select defaultValue="livepeer">
              <SelectTrigger>
                <SelectValue placeholder="Select Gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="livepeer">Livepeer Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <hr className="border-none " />
          <div className="flex items-center gap-2">
            <p className="text-md font-medium">Balance</p>
          </div>
          <div className="mt-3 ">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-lg font-medium">200</span>
                <span className="text-sm text-foreground">credits left</span>
              </div>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                21 hours until next free credits
                <QuestionMarkCircledIcon className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2">
              <Progress value={80} />
            </div>
            <div className="mt-2 flex flex-row items-center justify-end -mr-4">
              <Button variant="link">View credits logs</Button>
            </div>
          </div>
          <hr className="border-t border-border mb-4" />
          <div className="flex items-center gap-2">
            <p className="text-md font-medium">Add Credits</p>
          </div>
          <div className="mt-3  h-[5.5rem]">
            <CreditSelection onSelect={setSelectedCredits} />
          </div>
        </div>

        <div className="text-sm text-muted-foreground mt-1">
          🎉 For a limited time, please enjoy free usage subsidized by Livepeer.
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBuyCredits}
            disabled={selectedCredits === null || selectedCredits < 1}
          >
            Buy {selectedCredits} credits for $0.00
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const CreditSelection = ({
  onSelect,
}: {
  onSelect: (value: null | number) => void;
}) => {
  const [selectedCredits, setSelectedCredits] = useState<number | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const creditOptions = [
    { value: 300, label: '300 credits' },
    { value: 600, label: '600 credits' },
    { value: 3000, label: '3000 credits' },
    { value: 6000, label: '6000 credits' },
  ];

  const handleCreditSelect = (value: number | string) => {
    if (value === 'custom') {
      setIsCustomMode(true);
      onSelect(Number(customValue));
    } else {
      setSelectedCredits(Number(value));
      onSelect(Number(value));
      setIsCustomMode(false);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {creditOptions.map(({ value, label }) => (
        <Button
          key={value}
          variant={selectedCredits === value ? 'default' : 'outline'}
          onClick={() => handleCreditSelect(value)}
          className="w-full"
        >
          {label}
        </Button>
      ))}
      <AnimatePresence mode="wait">
        {isCustomMode ? (
          <motion.div
            key="input"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: 0.3,
              type: 'spring',
              stiffness: 500,
              damping: 25,
            }}
            className="relative"
          >
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '150%' }}
              transition={{ duration: 0.3 }}
              className="absolute z-10"
            >
              <Input
                type="number"
                placeholder="Enter amount"
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value);
                  onSelect(Number(e.target.value));
                }}
                className="w-full"
                autoFocus
                onBlur={() => {
                  if (!customValue) {
                    setIsCustomMode(false);
                  }
                }}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              onClick={() => handleCreditSelect('custom')}
              className="w-full h-full"
            >
              Custom
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
