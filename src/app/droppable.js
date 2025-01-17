import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./sortable_item";
import React from "react";

const Droppable = ({ id, items, master, click, context, style }) => {
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
        {items.map((item) => {
          return <SortableItem key={item} id={item} size={master[item]["size"]} parent={id} click={click} context={context}/>
        }
        )}
      </div>
    </SortableContext>
  );
};

export default Droppable;