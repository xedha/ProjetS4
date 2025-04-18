"use client"

import { Sidebar } from "../common/Sidebar"
import { Header } from "../common/Header"

import Tabel from "./tabel1/Tabel"
import Addbutton from "./addbutton/Addbutton";
import Search from "./search bar/seach";


const data = [
  {
    name: "Matt Dickerson",
    type: "Transfer Bank",
    date: "13/05/2022",
    title: "Transfer Bank",
    abbreviation: "TB",
    coef: "TB",
    credits: "$4.95",
    unit: "TB",
    lecture: "TB",
    tutorial: "TB",
    practical: "TB",
  },
  {
    name: "Wiktoria",
    type: "Cash on Delivery",
    date: "22/05/2022",
    title: "Cash on Delivery",
    abbreviation: "COD",
    coef: "COD",
    credits: "$8.95",
    unit: "COD",
    lecture: "COD",
    tutorial: "COD",
    practical: "COD",
  },
  {
    name: "Liam",
    type: "Credit Card",
    date: "15/06/2022",
    title: "Credit Card Payment",
    abbreviation: "CC",
    coef: "CC",
    credits: "$12.50",
    unit: "CC",
    lecture: "CC",
    tutorial: "CC",
    practical: "CC",
  },
  {
    name: "Emma",
    type: "PayPal",
    date: "30/07/2022",
    title: "PayPal Payment",
    abbreviation: "PP",
    coef: "PP",
    credits: "$5.00",
    unit: "PP",
    lecture: "PP",
    tutorial: "PP",
    practical: "PP",
  },
  {
    name: "Noah",
    type: "Bank Transfer",
    date: "10/08/2022",
    title: "Bank Transfer",
    abbreviation: "BT",
    coef: "BT",
    credits: "$20.00",
    unit: "BT",
    lecture: "BT",
    tutorial: "BT",
    practical: "BT",
  },
  {
    name: "Olivia",
    type: "Cryptocurrency",
    date: "01/09/2022",
    title: "Crypto Payment",
    abbreviation: "CRY",
    coef: "CRY",
    credits: "$150.00",
    unit: "CRY",
    lecture: "CRY",
    tutorial: "CRY",
    practical: "CRY",
  },
  {
    name: "James",
    type: "Mobile Payment",
    date: "18/10/2022",
    title: "Mobile Payment",
    abbreviation: "MP",
    coef: "MP",
    credits: "$7.25",
    unit: "MP",
    lecture: "MP",
    tutorial: "MP",
    practical: "MP",
  },
  {
    name: "Sophia",
    type: "Voucher",
    date: "03/11/2022",
    title: "Voucher Redemption",
    abbreviation: "VCH",
    coef: "VCH",
    credits: "$3.50",
    unit: "VCH",
    lecture: "VCH",
    tutorial: "VCH",
    practical: "VCH",
  },
  
];



function Page() {
 

  return (
    <>
<div className="teacher-management-layout">
  <Sidebar />
  <div className="teacher-management-main">
    <Header title="C" />
   
  </div>
</div>


 
  <Tabel data={data} />
    
<Addbutton/> 
    <Search/>
    </>
  
  )
}

export default Page
