"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@repo/design-system/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Button } from "@repo/design-system/components/ui/button";
import { Progress } from "@repo/design-system/components/ui/progress";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@repo/design-system/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export default function Gateway() {
  const [showGateway, setShowGateway] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const gateway = searchParams.get("gateway");

  const handleClose = () => {
    setShowGateway(false);
    router.replace(window.location.pathname);
  };

  const handleSave = () => {
    toast.success(`Saved gateway provider`);
    handleClose();
  };

  useEffect(() => {
    setShowGateway(gateway === "true");
  }, [gateway]);

  return (
    <AlertDialog open={showGateway} onOpenChange={setShowGateway}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-medium">
            Gateway Provider
          </AlertDialogTitle>
          <AlertDialogDescription>
            You can select the gateway provider you want to use. Please note that
            this will affect the quality and the cost of outputs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Select defaultValue="livepeer">
          <SelectTrigger>
            <SelectValue placeholder="Select Gateway" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="livepeer">Livepeer Studio</SelectItem>
          </SelectContent>
        </Select>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
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
  const [customValue, setCustomValue] = useState("");

  const creditOptions = [
    { value: 300, label: "300 credits" },
    { value: 600, label: "600 credits" },
    { value: 3000, label: "3000 credits" },
    { value: 6000, label: "6000 credits" },
  ];

  const handleCreditSelect = (value: number | string) => {
    if (value === "custom") {
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
          variant={selectedCredits === value ? "default" : "outline"}
          onClick={() => handleCreditSelect(value)}
          className="w-full"
        >
          {label}
        </Button>
      ))}
      <AnimatePresence mode="wait">
        {!isCustomMode ? (
          <motion.div
            key="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              onClick={() => handleCreditSelect("custom")}
              className="w-full h-full"
            >
              Custom
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 25,
            }}
            className="relative"
          >
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "150%" }}
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
        )}
      </AnimatePresence>
    </div>
  );
};
