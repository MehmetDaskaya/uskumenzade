import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Paneli",
  description: "Admin management and settings",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>{children}</div>
    </>
  );
}
