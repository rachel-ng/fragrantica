"use client";

import notes from '../data/notes.json';

import React, { useState, useEffect } from "react";
import Image from "next/image";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Droppable from "./droppable";
import { arrayMove, insertAtIndex, removeAtIndex } from "./utils/array";

const notes_list = Object.keys(notes).map((note) => {
  return notes[note]["name"]
})

const notes_type = Object.keys(notes).map((note) => {
  return {"name": notes[note]["name"], "type": "notes"}
})

export default function Home() {
  const [items, setItems] = useState({
    "notes": notes_list, 
    "top": [], 
    "middle": [],
    "base": [],
    "frag": []
  });

  const [pyramidType, setPyramidType] = useState("Perfume Pyramid");

  // useEffect(() => console.log({ items }), [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  
  const togglePyramid = ({param}) => {
    if (pyramidType == "Perfume Pyramid") {
      setPyramidType("Fragrance Notes")
    }
    else {
      setPyramidType("Perfume Pyramid")
    }
  }

  const handleDragOver = ({ over, active }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (!overContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;

        return moveBetweenContainers(
          items,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index || 0;

      setItems((items) => {
        let newItems;
        if (activeContainer === overContainer) {
          newItems = {
            ...items,
            [overContainer]: arrayMove(
              items[overContainer],
              activeIndex,
              overIndex
            )
          };
        } else {
          newItems = moveBetweenContainers(
            items,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            active.id
          );
        }

        return newItems;
      });
    }
  };

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item)
    };
  };

  const containerStyle = { 
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
  };

  const notesStyle = {
    flexFlow: "column wrap", 
    padding: "2rem",
    height: "50vh",
    overflow: "scroll",
    position: "relative",
    padding: "2rem",
  }
  const pyramidStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center", 
    background: "white",
    padding: "0.5rem",
  }
  const layerStyle = {
  }

  const labelStyle = {
    marginTop: "0.5rem"
  }

  const spacerStyle = {
    height: "5rem"
  }

  return (
    <div
      style={containerStyle}
    >
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div style={pyramidStyle}>
          <div className="strike-title" onClick={(e) => togglePyramid(e)}><span>{ pyramidType }</span></div>
          {
            pyramidType == "Perfume Pyramid" ? 
            <div>
              <h4 style={labelStyle}><b>Top Notes</b></h4>
              <Droppable id="top" items={items["top"]} key="top" style={layerStyle}/>
              <h4 style={labelStyle}><b>Middle Notes</b></h4>
              <Droppable id="middle" items={items["middle"]} key="middle" style={layerStyle}/>
              <h4 style={labelStyle}><b>Base Notes</b></h4>
              <Droppable id="base" items={items["base"]} key="base" style={layerStyle}/>
            </div>
            : <Droppable id="frag" items={items["frag"]} key="frag" style={layerStyle}/>
          }
        </div>
        <div style={spacerStyle}></div>
        <Droppable id="notes" items={items["notes"]} key="notes" style={notesStyle}/>
      </DndContext>
    </div>
  );
}

