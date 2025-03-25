import { useState } from "react";

interface ListGroupProps {
  Item: string[];
  heading: string;
   onSelect(item : string): void;
}

function ListGroup({ Item, heading,onSelect }: ListGroupProps) {
  function message() {
    <h1>{heading}</h1>;
    if (Item.length === 0) {
      return <p>There are no elements in the list</p>;
    }
  }
 
  const [selected, setSelected] = useState(-1);
  return (
    <>
      <h1>{heading}</h1>
      <h1>ListGroup huhuhuhuhuhuhuhuhuhu</h1>
      {message()}

      <ul className="list-group">
        {Item.map((item, index) => (
          <li
            key={item}
            className={
              index === selected ? "list-group-item active" : "list-group-item"
            }
            onClick={() => {setSelected(index); 
              onSelect(item);
            }
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
