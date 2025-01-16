import { CardProps } from "@/components/StatCard";
import { ProjectData } from "@/components/Tables/Projects";
import { Power, Loader, CheckCircle2 } from "lucide-react";
export const notificationContent = [
  {
    title: "New Form Released!!",
    description: "Govt. has released a new form",
    date: "12 May, 2024",
  },
  {
    title: "Form Guidelines Released!!",
    description: "Govt. has released a new form guidelines",
    date: "11 May, 2024",
  },
  {
    title: "Delay in Form Submission!!",
    description: "Govt. has delayed a form submissions",
    date: "10 May, 2024",
  },
  {
    title: "Advisory for Fintech Companies!!",
    description: "Govt. has issued new advisory for Fintech Companies",
    date: "8 May, 2024",
  },
];

export const messagesContent = [
  {
    imgSrc: "/user/user-01.png",
    name: "Robert John",
    message: "Need Status Update on Upcoming Forms.",
    time: "2 mins ago",
  },
  {
    imgSrc: "/user/user-02.png",
    name: "Mariya Desoja",
    message: "Correction in the current form.",
    time: "5 mins ago",
  },
  {
    imgSrc: "/user/user-03.png",
    name: "Henry Dholi",
    message: "Why my projects are still pending ?",
    time: "10 mins ago",
  },
  {
    imgSrc: "/user/user-04.png",
    name: "Cody Fisher",
    message: "Project Status not Updating!!",
    time: "35 mins ago",
  },
  {
    imgSrc: "/user/user-05.png",
    name: "Harry Brooks",
    message: "Please update links so that I can redirect",
    time: "2 days ago",
  },
  {
    imgSrc: "/user/user-06.png",
    name: "Harry Williamson",
    message: "Regarding Form Guidelines",
    time: "3 days ago",
  },
];

export const cardData: CardProps[] = [
  {
    label: "Start",
    amount: "1",
    discription: "Project(s) Started",
    icon: Power,
  },
  {
    label: "In-Processing",
    amount: "0",
    discription: "Project(s) In-Processing",
    icon: Loader,
  },
  {
    label: "Completed",
    amount: "0",
    discription: "Project(s) Completed",
    icon: CheckCircle2,
  },
];

export const data: ProjectData[] = [
  {
    id: "m5gr84i9",
    status: "In-Processing",
    company: "ABCD",
    project: "Incorporation",
    start: "01-03-2024",
    due: "31-03-2024",
    published: 2,
    processBy: "Yon Roe",
  },
];
