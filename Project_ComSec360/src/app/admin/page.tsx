"use client";
import { Suspense, useEffect, useState } from "react";
import CardSet from "./_components/cards/CardSet";
import { InviteForm } from "./_components/forms/InviteForm";
import DataTable from "./_components/table/DataTable";
import { CardSetSkeleton, TableSkeleton } from "./_components/skeletons";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const [user, setUser] = useState({});
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const getUser = () => {
    if (typeof window === 'undefined') return false;
    const user = localStorage.getItem('user');
    if (user && Object.keys(JSON.parse(user)).length) {
      setUser(JSON.parse(user));
      setIsAuthChecked(true);
    } else if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  };


  useEffect(() => {
    getUser();
  }, []);

  if (!isAuthChecked) {
    return <TableSkeleton />// Prevent rendering until auth check completes
  }

  return (
    <section className="py-6 container space-y-6">
      <Suspense fallback={<CardSetSkeleton />}>
        <CardSet />
      </Suspense>
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-3">
        <div className="xl:col-span-2">
          {/* <Suspense fallback={<TableSkeleton />}> */}
          <DataTable />
          {/* </Suspense> */}
        </div>
        <InviteForm />
      </div>
    </section>
  );
};

export default AdminPage;


