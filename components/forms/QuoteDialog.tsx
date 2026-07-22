"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import QuoteForm from "./QuoteForm";

interface QuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuoteDialog({
  open,
  onOpenChange,
}: QuoteDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">

        <DialogHeader>

          <DialogTitle className="text-2xl">
            Үнийн санал авах
          </DialogTitle>

          <DialogDescription>
            Доорх мэдээллийг бөглөнө үү. Бид тантай удахгүй холбогдох болно.
          </DialogDescription>

        </DialogHeader>

        <QuoteForm
          onSuccess={() => onOpenChange(false)}
        />

      </DialogContent>
    </Dialog>
  );
}