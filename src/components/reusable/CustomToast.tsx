'use client';

import React from 'react';
import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  button?: {
    label: string;
    onClick: () => void;
  };
}

type toastType = 'success' | 'error' | 'warning' | 'default';

export function customToast(toast: Omit<ToastProps, 'id'>, typeOfToast: toastType = 'default') {
  return sonnerToast.custom((id) => {
    const toastProps = {
      id,
      title: toast.title,
      description: toast.description,
      ...(toast.button && {
        button: {
          label: toast.button.label,
          onClick: toast.button.onClick,
        },
      }),
    };

    switch (typeOfToast) {
      case 'success':
        return <CustomSuccessToast {...toastProps} />;
      case 'error':
        return <CustomErrorToast {...toastProps} />;
      case 'warning':
        return <CustomWarningToast {...toastProps} />;
      case 'default':
      default:
        return <CustomToast {...toastProps} />;
    }
  });
}

/** A fully custom toast that still maintains the animations and interactions. */
function CustomToast(props: ToastProps) {
  const { title, description, button, id } = props;

  return (
    <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
        <button
          className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
          onClick={() => {
            button!.onClick();
            sonnerToast.dismiss(id);
          }}
        >
          {button!.label}
        </button>
      </div>
    </div>
  );
}

/** Custom success toast. */
function CustomSuccessToast(props: ToastProps) {
  const { title, description } = props;

  return (
    <div className="flex rounded-lg bg-green-400 shadow-lg ring-1 ring-green-950/50 w-full md:max-w-[364px] items-center p-4">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-[#0b031c]">{title}</p>
          <p className="mt-1 text-sm text-[#1D084A]">{description}</p>
        </div>
      </div>
    </div>
  );
}

/** Custom warning toast. */
function CustomWarningToast(props: ToastProps) {
  const { title, description } = props;

  return (
    <div className="flex rounded-lg bg-amber-300 shadow-lg ring-1 ring-amber-950/50 w-full md:max-w-[364px] items-center p-4">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-[#0b031c]">{title}</p>
          <p className="mt-1 text-sm text-[#1D084A]">{description}</p>
        </div>
      </div>
    </div>
  );
}

/** Custom error toast. */
function CustomErrorToast(props: ToastProps) {
  const { title, description } = props;

  return (
    <div className="flex rounded-lg bg-red-400 shadow-lg ring-1 ring-red-950/50 w-full md:max-w-[364px] items-center p-4">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-[#0b031c]">{title}</p>
          <p className="mt-1 text-sm text-[#1D084A]">{description}</p>
        </div>
      </div>
    </div>
  );
}
