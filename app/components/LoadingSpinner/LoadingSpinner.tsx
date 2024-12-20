// src/components/LoadingSpinner.tsx

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
    </div>
  );
}
