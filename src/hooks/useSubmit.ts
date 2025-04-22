import { useState, useCallback } from "react";
import { SubmitOptions, SubmitResponse } from "../core/types";
import { invalidateData } from "../core/fetch";

export function useSubmit(
  url: string,
  options: SubmitOptions = {}
): SubmitResponse {
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any | null>(null);

  const submit = useCallback(
    async (formData: any) => {
      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method: options.method || "POST",
          headers: options.headers || {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Error submitting to ${url}: ${response.statusText}`);
        }

        const responseData = await response.json();
        setData(responseData);

        if (options.refreshData) {
          options.refreshData.forEach((dataUrl) => {
            invalidateData(dataUrl);
          });
        }

        if (options.onSuccess) {
          options.onSuccess(responseData);
        }

        return responseData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);

        if (options.onError) {
          options.onError(error);
        }

        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [url, options]
  );

  return {
    submit,
    isSubmitting,
    error,
    data,
  };
}
