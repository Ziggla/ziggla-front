"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    SumUpCard?: {
      mount: (config: {
        id: string;
        checkoutId: string;
        onResponse?: (type: string, body: unknown) => void;
        onLoad?: () => void;
        showFooter?: boolean;
        locale?: string;
      }) => { unmount: () => void };
    };
  }
}

const SDK_URL = "https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js";

let sdkPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (typeof window !== "undefined" && window.SumUpCard) return Promise.resolve();
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load SumUp SDK"));
    document.body.appendChild(script);
  });
  return sdkPromise;
}

interface Props {
  checkoutId: string;
  locale?: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function SumupCardWidget({ checkoutId, locale, onSuccess, onError }: Props) {
  const containerId = useRef(`sumup-card-${Math.random().toString(36).slice(2)}`);
  const mountedRef = useRef<{ unmount: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSdk()
      .then(() => {
        if (cancelled || !window.SumUpCard) return;
        mountedRef.current = window.SumUpCard.mount({
          id: containerId.current,
          checkoutId,
          locale: locale ?? "en-GB",
          showFooter: false,
          onResponse: (type, body) => {
            // Only treat as paid when SumUp explicitly reports a successful
            // status. "sent"/"auth-screen" mean the form was submitted but the
            // bank may still reject it, so we wait for a confirmed status.
            const status = (body as { status?: string })?.status?.toUpperCase();
            if (status === "PAID" || status === "SUCCESSFUL") {
              onSuccess();
              return;
            }
            if (
              type === "error" ||
              type === "invalid" ||
              status === "FAILED" ||
              status === "CANCELLED" ||
              status === "CANCELED" ||
              status === "DECLINED"
            ) {
              onError(
                (body as { message?: string })?.message ??
                  "Payment was declined or cancelled.",
              );
            }
          },
        });
      })
      .catch((e) => onError(e instanceof Error ? e.message : "SDK load error"));
    return () => {
      cancelled = true;
      mountedRef.current?.unmount?.();
    };
  }, [checkoutId, locale, onSuccess, onError]);

  return <div id={containerId.current} />;
}
