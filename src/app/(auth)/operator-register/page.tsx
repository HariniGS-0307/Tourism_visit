"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadCloud } from "lucide-react";

export const dynamic = "force-dynamic";

const operatorRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  businessName: z.string().min(2, "Business name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  description: z.string().min(10, "Description is required"),
  verificationDocUrl: z.string().url("Valid verification document URL is required"), // Normally handled by a file upload component
});

type OperatorRegisterFormData = z.infer<typeof operatorRegisterSchema>;

export default function OperatorRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OperatorRegisterFormData>({
    resolver: zodResolver(operatorRegisterSchema),
  });

  const handleMockUpload = () => {
    // In a real app, this would trigger a Cloudinary widget upload
    // Here we just mock it for the flow
    setTimeout(() => {
      setValue("verificationDocUrl", "https://res.cloudinary.com/demo/image/upload/sample.jpg", { shouldValidate: true });
      setDocUploaded(true);
    }, 1000);
  };

  const onSubmit = async (data: OperatorRegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/operator-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Something went wrong");
      }

      router.push("/login?message=Operator registered successfully. Please login.");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Partner with Us</h2>
          <p className="mt-2 text-sm text-gray-600">
            Register your business to start listing adventures
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Account Details</h3>
              
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                <div className="mt-2">
                  <input
                    {...register("name")}
                    type="text"
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                <div className="mt-2">
                  <input
                    {...register("email")}
                    type="email"
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <div className="mt-2">
                  <input
                    {...register("password")}
                    type="password"
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Business Details</h3>
              
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Business Name</label>
                <div className="mt-2">
                  <input
                    {...register("businessName")}
                    type="text"
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3"
                  />
                  {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Business Phone</label>
                <div className="mt-2">
                  <input
                    {...register("phone")}
                    type="tel"
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Business Description</label>
                <div className="mt-2">
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Verification Document (GST/Pan)</label>
            <div 
              onClick={handleMockUpload}
              className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 cursor-pointer hover:bg-gray-50 transition-colors ${docUploaded ? 'border-emerald-500 bg-emerald-50' : 'border-gray-900/25'}`}
            >
              <div className="text-center">
                <UploadCloud className={`mx-auto h-12 w-12 ${docUploaded ? 'text-emerald-500' : 'text-gray-300'}`} aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                  <span className="relative rounded-md bg-transparent font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500">
                    {docUploaded ? 'Document Uploaded' : 'Click to simulate Cloudinary upload'}
                  </span>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
            {errors.verificationDocUrl && <p className="mt-2 text-sm text-red-600">{errors.verificationDocUrl.message}</p>}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !docUploaded}
              className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50"
            >
              {loading ? "Submitting Application..." : "Submit Application"}
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Already an operator?{" "}
          <Link href="/login" className="font-semibold leading-6 text-emerald-600 hover:text-emerald-500">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

