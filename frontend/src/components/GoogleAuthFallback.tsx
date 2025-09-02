import { useState } from 'react';

interface GoogleFallbackProps {
  errorMessage: string;
}

const GoogleAuthFallback = ({ errorMessage }: GoogleFallbackProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
      <h3 className="font-semibold text-yellow-800">Google Authentication Issue</h3>
      <p className="text-yellow-700 mb-2">
        Google authentication is currently unavailable. You can still use email/OTP login.
      </p>
      
      {showDetails && (
        <div className="mt-2 p-2 bg-yellow-100 rounded text-sm text-yellow-800">
          <p className="font-mono">{errorMessage}</p>
        </div>
      )}
      
      <button 
        className="text-sm text-yellow-600 hover:underline mt-2"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide details' : 'Show technical details'}
      </button>
    </div>
  );
};

export default GoogleAuthFallback;
