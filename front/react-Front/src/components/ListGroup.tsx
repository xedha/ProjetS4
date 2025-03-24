import { useState } from "react";

function ListGroup() {
  let List: any[] = ["redha", "ramy", "test"];

  function message() {
    if (List.length === 0) {
      return <p>There are no elements in the list</p>;
    }
  }
  function display(){
    console.log(List);
  }
  const [selected, setSelected] = useState(-1);
  return (
    <>
      <h1>ListGroup huhuhuhuhuhuhuhuhuhu</h1>
      {message()}

      <ul className="list-group">
        {List.map((item, index) => (
          <li
            key={item}
            className={index === selected ? "list-group-item active" : "list-group-item"}
            onClick={() => setSelected(index)}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
