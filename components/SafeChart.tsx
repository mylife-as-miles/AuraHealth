import React from 'react';

export const SafeChart = ({ children, width, height, ...props }: any) => {
  if (width !== undefined && height !== undefined && width > 0 && height > 0) {
    return React.cloneElement(children, { width, height, ...props });
  }
  return null;
};
