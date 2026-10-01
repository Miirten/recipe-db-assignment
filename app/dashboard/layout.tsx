import SideNav from "@/app/ui/dashboard/sidenav";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 md:flex">
      <SideNav />

      <main className="min-w-0 flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}