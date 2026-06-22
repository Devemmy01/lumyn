"use client";

import { useEffect } from "react";
import { initializeFirebaseAnalytics } from "@/lib/firebase/client";

export default function FirebaseAnalytics() {
  useEffect(() => {
    initializeFirebaseAnalytics().catch((error) => {
      console.error("[firebase/analytics]", error);
    });
  }, []);

  return null;
}
