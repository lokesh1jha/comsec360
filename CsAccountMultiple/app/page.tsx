"use client";
import { getCardsData, getProjects } from "@/api/company";
import Card from "@/components/StatCard";
import { Projects, Companies } from "@/components/Tables";
import { ProjectData } from "@/components/Tables/Projects";
import { buttonVariants } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cardData } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const accountUserUrl = process.env.NEXT_PUBLIC_CS_ACCOUNT_USER_URL ?? 'http://52.59.5.100:3000';

interface CardProps {
  amount: string;
  discription: string;
  icon: any;
  label: string;
}

export default function Home() {
  const router = useRouter();
  const [cardsData, setCardsData] = useState<CardProps[]>(cardData);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user = urlParams.get("user") ? decodeURIComponent(urlParams.get("user")!) : null;
    const type = urlParams.get("type");

    if (token && user && type) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
      localStorage.setItem("type", type);
      setToken(token);
      setUser(user);
      setType(type);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedType = localStorage.getItem("type");

      if (!storedToken || !storedUser || !storedType) {
        window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL ?? "http://3.74.43.250:3000/login";
      } else {
        setToken(storedToken);
        setUser(storedUser);
        setType(storedType);
      }
    }
  }, [router]);

  useEffect(() => {
    fetchCardsData();
    fetchProjects();
  }, []);

  const fetchCardsData = async () => {
    const response = await getCardsData();

    const updatedCardData = cardData.map(data => {
      if (data.label === "Start") {
        return { ...data, amount: response.data["started"] ?? 0 };
      }
      if (data.label === "In-Processing") {
        return { ...data, amount: response.data["in_progress"] ?? 0 };
      }
      if (data.label === "Completed") {
        return { ...data, amount: response.data["completed"] ?? 0 };
      }
      return data;
    });
    setCardsData(updatedCardData);
  }

  const fetchProjects = async () => {
    const page = 1;
    const pageSize = 10;
    const response = await getProjects(page, pageSize);
    console.log("response-------", response);
    setProjects(response.formattedProjects);
  }
  return (
    <main className="py-6 px-0">
      <section className="grid grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardsData && cardsData.map((data, index) => (
          <Card
            key={index}
            amount={data.amount}
            discription={data.discription}
            icon={data.icon}
            label={data.label}
          />
        ))}
      </section>
      <section className="mt-6 font-sans px-0">
        <Tabs defaultValue="projects">
          <TabsList className="grid w-full grid-cols-2 sm:mb-0 mb-40">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="companies" disabled>Companies</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="font-sans">
            <Link
              className={buttonVariants({ variant: "outline" })}
              href={`${accountUserUrl}?token=${token}&type=account_user&user=${encodeURIComponent(user ?? "")}`}
              target="_blank"
            >
              + Add New Project
            </Link>
            {projects && <Projects projects={projects} />}
          </TabsContent>
          <TabsContent value="companies">
            <div className="flex items-center gap-2">
              <Link
                className={buttonVariants({ variant: "outline" })}
                href="https://comsecaccount.netlify.app/"
                target="_blank"
              >
                + Add New Company
              </Link>
              <Link
                className={buttonVariants({ variant: "outline" })}
                href="https://comsecaccount.netlify.app/"
                target="_blank"
              >
                + Add New Project
              </Link>
            </div>
            <Companies />
          </TabsContent>
        </Tabs>
      </section>
      <CardDescription className="mt-4">
        Copyright © 2012 - 2024 ComSec360®. All rights reserved.
      </CardDescription>
    </main>
  );
}
