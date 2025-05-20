"use client"

import { Sidebar } from "../common/Sidebar"
import { Header } from "../common/Header"
import { useTranslation } from 'react-i18next';

import Tabel from "./tabel1/Tabel"
import Addbutton from "./addbutton/Addbutton";
import Search from "./search bar/seach";
import Settin from "./heads/settin"
import Mange from "./heads/mangment";
import Mangetable from "./table2/table2";

const data = [
  {
    username: "mdickerson",
    fullName: "Matt Dickerson",
    phone: "+213 654 321 987",
    email: "matt@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    username: "wiktoria88",
    fullName: "Wiktoria Novak",
    phone: "+213 987 123 456",
    email: "wiktoria@example.com",
    role: "Editor",
    status: "Inactive",
  },
  {
    username: "liam_tech",
    fullName: "Liam Johnson",
    phone: "+213 776 345 678",
    email: "liam@example.com",
    role: "Moderator",
    status: "Active",
  },
  {
    username: "emma.codes",
    fullName: "Emma Brown",
    phone: "+213 661 987 654",
    email: "emma@example.com",
    role: "Viewer",
    status: "Pending",
  },
  {
    username: "noah.admin",
    fullName: "Noah Wilson",
    phone: "+213 770 112 233",
    email: "noah@example.com",
    role: "Admin",
    status: "Active",
  },
];

function Page2() {
  const { t } = useTranslation();

  return (
    <>
      <div className="teacher-management-layout">
        <Sidebar />
        <div className="teacher-management-main">
          <Header title={t('settings.title')} />
        </div>
      </div>

      <Search/>
      <Settin/>
      <Tabel data={data} />
      <Addbutton/> 
      <Mange/>
      <Mangetable />
    </>
  )
}

export default Page2
