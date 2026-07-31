"use client";

import { useEffect, useState } from "react";
import { fetchDataProfile } from "./api";
import type { DataProfileResponse } from "./types";

export type UseDataProfileState =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: DataProfileResponse; error: null }
  | { status: "error"; data: null; error: Error };

export function useDataProfile(): UseDataProfileState {
  const [state, setState] = useState<UseDataProfileState>({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    fetchDataProfile()
      .then((data) => {
        if (isActive) {
          setState({ status: "success", data, error: null });
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({
            status: "error",
            data: null,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
