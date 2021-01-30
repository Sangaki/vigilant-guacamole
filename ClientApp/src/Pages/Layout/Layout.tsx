import React from 'react';
import { AppRouter } from '../index';

export const AppLayout: React.FC<{}> = () => {
  return (
    <div className="app-wrapper">
      <AppRouter />
    </div>
  );
};
