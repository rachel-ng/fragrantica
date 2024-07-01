"use client";

import notes from '../data/notes.json';

import React, { useState, useEffect } from "react";
import Image from "next/image";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { 
  arrayMove,
  sortableKeyboardCoordinates 
} from "@dnd-kit/sortable";

import Droppable from "./droppable";
import FragranceNotes from './fragrance_notes';

const notes_list = Object.keys(notes).map((note) => {
  return notes[note]["name"]
})

const all_notes = {}
Object.keys(notes).forEach((note) => {
  all_notes[note] = {...notes[note], "hidden": false}
})

const notes_type = {}
Object.keys(notes).forEach((note) => {
  if (notes_type[notes[note]["category"]]) {
    notes_type[notes[note]["category"]][note] = notes[note]
  }
  else {
    notes_type[notes[note]["category"]] = {}
    notes_type[notes[note]["category"]][note] = notes[note]
  }
})

export default function Home() {

  const [items, setItems] = useState({
    "notes": [], 
    "top": [], 
    "middle": [],
    "base": [],
    "frag": [], 
    "all": all_notes,
  });

  const [pyramidType, setPyramidType] = useState("Perfume Pyramid");

  const [activeId, setActiveId] = useState(null);

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

  const handleOnClick = (e, id) => {
    if (!Object.keys(items).map((i) => {return Array.isArray(items[i]) ? items[i].includes(id) : false }).some((i) => { return i == true})) {
      let nitems = {...items}
      nitems["notes"].push(id)
      nitems["all"][id]["hidden"] = true
      setItems(nitems)
      console.log(e.target)
    }
  }

  function findContainer(id) {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  }

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  }

  function handleDragOver(event) {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id)
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length)
        ]
      };
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(active.id);
    const overIndex = items[overContainer].indexOf(overId);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
      }));
    }

    setActiveId(null);
  }

  const containerStyle = { 
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
  };

  const notesStyle = {
    flexFlow: "row wrap", 
    padding: "2rem",
    minHeight: "25vh",
    width: "80vw",
    height: "auto",
    position: "relative",
    padding: "1em",
    margin: "0 auto",
    background: "#fbfbfb",
    borderRadius: ".2em",
  }
  const pyramidStyle = {
    background: "white",
    padding: "0.5rem",
  }
  const layerStyle = {
  }

  const labelStyle = {
    marginTop: "0.5rem"
  }

  const spacerStyle = {
    display: "block",
    height: "5rem"
  }

  return (
    <div
      style={containerStyle}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        >
        <div className="flex flex-col justify-center text-center" style={pyramidStyle}>
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
        <DragOverlay>
          {activeId ? <FragranceNotes key={activeId} id={activeId} /> : null}
        </DragOverlay>

      </DndContext>
      <div className="flex flex-col" key="all" style={{ marginTop: "5em" }}>
        {
          Object.keys(notes_type).map((category) => {
            return <div className="flex flex-col text-center" key={category} style={{ margin: "2em auto"}}>
              <div><h4>{category}</h4></div>
              <div className="flex flex-row flex-wrap text-center">
                {Object.keys(notes_type[category]).map((note) => {
                  return <FragranceNotes key={note} id={note} style={{ margin: "1em", display: items["all"][note]["hidden"] ? "none" : "flex" }} parent="all" onClick={handleOnClick} />
                  })
                }
              </div>
            </div>
          })
        }
      </div>
    </div>
  );
}

