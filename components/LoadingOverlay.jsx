"use client";
export default function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-25">
      <div className="w-12 h-12 border-t-4 border-yellow-200 border-solid rounded-full animate-spin"></div>
    </div>
  );
}
