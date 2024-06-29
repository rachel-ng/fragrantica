import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./sortable_item";
import React from "react";

const Droppable = ({ id, items, style, click }) => {
  const { setNodeRef } = useDroppable({ id });

  const droppableStyle = {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center",
    padding: "0.5rem",
    minHeight: "4rem",
  };

  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy} style={style}>
      <div ref={setNodeRef} style={droppableStyle}>
        {items.map((item) => (
          <SortableItem key={item} id={item} parent={id} click={click}/>
        ))}
      </div>
    </SortableContext>
  );
};

export default Droppable;