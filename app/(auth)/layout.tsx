import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) redirect("/");
  return (
    <div className="h-screen flex items-center justify-center">{children}</div>
  );
};

export default Layout;
