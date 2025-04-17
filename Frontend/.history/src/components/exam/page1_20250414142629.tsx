import Tabel from "./tabel1/Tabel"
import Addbutton from "./addbutton/Addbutton";
import Search from "./search bar/seach";


const data = [
   {
    level: "L1",
    specialty: "Informatique",
    semester: "S1",
    section: "A",
    date: "13/05/2022",
    time: "10:00",
    examRoom: "Room 101",
    moduleName: "Transfer Bank",
    moduleAbbreviation: "TB",
    supervisor: "Matt Dickerson",
    order: "1",
    nbrSE: "2",
    nbrSS: "1",
    email: "matt@example.com"
  },
  {
    level: "L2",
    specialty: "Mathématiques",
    semester: "S2",
    section: "B",
    date: "22/05/2022",
    time: "11:00",
    examRoom: "Room 202",
    moduleName: "Cash on Delivery",
    moduleAbbreviation: "COD",
    supervisor: "Wiktoria",
    order: "2",
    nbrSE: "1",
    nbrSS: "2",
    email: "wiktoria@example.com"
  },
  {
    level: "L3",
    specialty: "Physique",
    semester: "S3",
    section: "C",
    date: "15/06/2022",
    time: "08:30",
    examRoom: "Room 303",
    moduleName: "Credit Card Payment",
    moduleAbbreviation: "CC",
    supervisor: "Liam",
    order: "3",
    nbrSE: "3",
    nbrSS: "1",
    email: "liam@example.com"
  },
  {
    level: "M1",
    specialty: "Chimie",
    semester: "S4",
    section: "D",
    date: "30/07/2022",
    time: "09:00",
    examRoom: "Room 404",
    moduleName: "PayPal Payment",
    moduleAbbreviation: "PP",
    supervisor: "Emma",
    order: "4",
    nbrSE: "1",
    nbrSS: "1",
    email: "emma@example.com"
  },
  {
    level: "M2",
    specialty: "Biologie",
    semester: "S5",
    section: "E",
    date: "10/08/2022",
    time: "13:00",
    examRoom: "Room 505",
    moduleName: "Bank Transfer",
    moduleAbbreviation: "BT",
    supervisor: "Noah",
    order: "5",
    nbrSE: "2",
    nbrSS: "2",
    email: "noah@example.comefsdfsdfsdfsdsf fds fds"
  },
  {
    level: "L1",
    specialty: "Informatique",
    semester: "S6",
    section: "F",
    date: "01/09/2022",
    time: "15:00",
    examRoom: "Room 606",
    moduleName: "Crypto Payment",
    moduleAbbreviation: "CRY",
    supervisor: "Olivia",
    order: "6",
    nbrSE: "1",
    nbrSS: "3",
    email: "olivia@example.com"
  },
  {
    level: "L2",
    specialty: "Mathématiques",
    semester: "S2",
    section: "G",
    date: "18/10/2022",
    time: "14:30",
    examRoom: "Room 707",
    moduleName: "Mobile Payment",
    moduleAbbreviation: "MP",
    supervisor: "James",
    order: "7",
    nbrSE: "3",
    nbrSS: "1",
    email: "james@example.com"
  },
  {
    level: "L3",
    specialty: "Physique",
    semester: "S3",
    section: "H",
    date: "03/11/2022",
    time: "12:00",
    examRoom: "Room 808",
    moduleName: "Voucher Redemption",
    moduleAbbreviation: "VCH",
    supervisor: "Sophia",
    order: "8",
    nbrSE: "2",
    nbrSS: "2",
    email: "sophia@example.com"
  }
];


function Page1() {
 

  return (
    <>
<div className="teacher-management-layout">
  <Sidebar />
  <div className="teacher-management-main">
    <Header title="Teacher Management" />
    
  </div>
</div>

  <h1 className="text-xl font-bold mb-4">Dynamic Table</h1>
  <Tabel data={data} />
    
<Addbutton/> 
    <Search/>
    </>
  
  )
}

export default Page1
