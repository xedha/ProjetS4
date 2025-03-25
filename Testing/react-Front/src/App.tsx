import Message from "./Message";
import "./App.css";
import ListGroup from "./components/ListGroup";

function App() {
  let List = ["redha", "ramy", "test"];
  const handleSelected = (item: string) => console.log(item);
  return (
    <div className="total">
      <ListGroup
        Item={List}
        heading="Citeies"
        onSelect={handleSelected}
      ></ListGroup>
    </div>
  );
}

export default App;
