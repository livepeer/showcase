import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import '@testing-library/jest-dom';

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });
}

export * from '@testing-library/react';
export { render };
