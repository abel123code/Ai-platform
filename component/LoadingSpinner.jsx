import React from 'react'
import { Book, CheckCircle, ChevronDown, ChevronRight,Loader2  } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1>Loading.....</h1>
        <Loader2 className="h-8 w-8 animate-spin text-primary mt-3" />
    </div>
  )
}

export default LoadingSpinner