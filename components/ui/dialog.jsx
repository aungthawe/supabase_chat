"use client";

import React, { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const DialogContext = createContext(null);

export function Dialog({ children, open, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (val) => {
    if (!isControlled) setInternalOpen(val);
    onOpenChange?.(val);
  };

  return (
    <DialogContext.Provider value={{ isOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children }) {
  const { setOpen } = useContext(DialogContext);
  return React.cloneElement(children, {
    onClick: () => setOpen(true),
  });
}

export function DialogContent({ children, className = "" }) {
  const { isOpen, setOpen } = useContext(DialogContext);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/20 "
      />
      {/* modal */}
      <div
        className={`relative z-50 w-[90%] max-w-md rounded-2xl bg-white/40 backdrop-blur-md p-6 shadow-xl animate-scaleIn ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-3">{children}</div>;
}

export function DialogTitle({ children, className = "" }) {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
}
