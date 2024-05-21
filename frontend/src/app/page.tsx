"use client"
import useUserStore from "@/store/user";
import { redirect } from "next/navigation";
import React from "react";

export default function Home() {
  let store = useUserStore();

  if (!store.islogin) {
    redirect("/auth/login");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hello World
    </main>
  );
}
