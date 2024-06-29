import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./sortable_item";
import React from "react";

const Droppable = ({ id, items, style }) => {
  const { setNodeRef } = useDroppable({ id });
  const droppableStyle = {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center",
    padding: "0.5rem",
    minHeight: "4rem",
  };
  const combinedStyles = {...droppableStyle, ...style}

  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <div ref={setNodeRef} style={combinedStyles}>
        {items.map((item) => (
          <SortableItem key={item} id={item} parent={id}/>
        ))}
      </div>
    </SortableContext>
  );
};

export default Droppable;