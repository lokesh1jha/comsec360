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

export const directorsRows = [
  {
    label: "Person/Company",
    for: "type",
  },
  {
    label: "Surname",
    for: "surname",
  },
  {
    label: "Name",
    for: "name",
  },
  {
    label: "ID/Company No.",
    for: "idNo",
  },
  {
    label: "Address",
    for: "address",
  },
  {
    label: "Email",
    for: "email",
  },
  {
    label: "Phone",
    for: "phone",
  },
];

export const directorsContent =[
  {
    id: 1,
    type: "Person",
    surname: "Kun Lee",
    name: "Chang",
    idNo: "313425",
    address: "16 Chi Street",
    email: "email1@gmail.com",
    phone: "+12XXXXXXXXXX",
    classOfShares: "Ordinary",
    noOfShares: 200,
  },
  {
    id: 2,
    type: "Company",
    surname: "-",
    name: "Tencent Games Pvt Ltd.",
    idNo: "313425",
    address: "16 Kinjuo Street",
    email: "email2@gmail.com",
    phone: "+01XXXXXXXXX",
    classOfShares: "Preferance",
    noOfShares: 200,
  },
  {
    id: 3,
    type: "You",
    surname: "Minamoto",
    name: "Riotsu",
    idNo: "313425",
    address: "16 Saitichi Street",
    email: "email3@gmail.com",
    phone: "+91XXXXXXXXX",
    classOfShares: "Ordinary Class 1",
    noOfShares: 0,
  },
]

export const shareCapitalRows = [
  {
    label: "Class of Shares",
    for: "class",
  },
  {
    label: "Total Shares Proposed",
    for: "totalProposed",
  },
  {
    label: "Currency",
    for: "currency",
  },
  {
    label: "Unit Price of Share",
    for: "unitPrice",
  },
  {
    label: "Total Amount",
    for: "total",
  },
  {
    label: "Total Capital Subscribed",
    for: "paid",
  },
  {
    label: "Unpaid Amount",
    for: "unpaid",
  },
  {
    label: "Particulars of Rights Attached",
    for: "rightsAttached",
  },
];

export const shareCapitalContent = [
  {
    id: 1,
    class: "Ordinary",
    totalProposed: 1000,
    currency: "HKD",
    unitPrice: 1,
    total: 1000,
    paid: 200,
    unpaid: 800,
    rightsAttached: "Voting Rights",
  },
  {
    id: 2,
    class: "Preferance",
    totalProposed: 1000,
    currency: "USD",
    unitPrice: 1,
    total: 1000,
    paid: 200,
    unpaid: 800,
    rightsAttached: "Voting Rights",
  },
  {
    id: 3,
    class: "Ordinary Class 1",
    totalProposed: 1000,
    currency: "EUR",
    unitPrice: 1,
    total: 1000,
    paid: 0,
    unpaid: 0,
    rightsAttached: "Voting Rights",
  },
];