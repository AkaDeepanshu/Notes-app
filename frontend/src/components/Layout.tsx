import type { ReactNode } from 'react';
import background from '../assets/background.png';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-[1200px] min-h-[600px] bg-white rounded-xl shadow-lg overflow-hidden flex">
        {children}
      </div>
    </div>
  );
};

interface ContentProps {
  children: ReactNode;
  className?: string;
}

export const Content = ({ children, className = '' }: ContentProps) => {
  return (
    <div className={`w-full md:w-1/2 p-8 ${className}`}>
      {children}
    </div>
  );
};

export const ImageSide = () => {
  return (
    <div className="hidden md:block w-1/2 bg-pattern">
      <div className="h-full w-full flex items-center justify-center">
        <img src={background} alt="Background Image" />
      </div>
    </div>
  );
};
