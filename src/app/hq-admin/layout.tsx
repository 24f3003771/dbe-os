import AdminNav from "./AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>
    </div>
  );
}
