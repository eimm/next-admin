"use client";

import React, { useEffect, useState } from "react";

export function withEnsureClient<T extends React.JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>
) {
  return function ComponentEnsuredClient(props: T) {
    const [isMounted, setIsmounted] = useState(false);
    useEffect(() => {
      setIsmounted(true);
    }, []);

    if (!isMounted) {
      return null;
    }

    return <Component {...props} />;
  };
}
