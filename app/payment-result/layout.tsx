import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Result",
  description: "Payment Result page",
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
