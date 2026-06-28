import Link from "next/link";
import { AlertTriangle } from "lucide-react";



export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
      <div className="flex max-w-md flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8">
          You do not have the required permissions to view this page. If you believe this is an error, please contact support.
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

