"use client";

import notes from '../data/notes.json';

import { Lato } from "next/font/google";
import React, { useState, useEffect, useRef } from "react";
import ScrollButton from './scroll_button';

const lato = Lato({ weight: ["400"], subsets: ["latin"] });

import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor, 
  TouchSensor,
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
  all_notes[note] = { ...notes[note], "size": 3, "hidden": false }
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

const slugify = (...args) => {
  const value = args.join(' ')

  return value
      .normalize('NFD') // split an accented letter in the base letter and the acent
      .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
      .replace(/\s+/g, '-') // separator
}

export default function Home() {

  const [items, setItems] = useState({
    "current": "",
    "size": 3,
    "notes": [],
    "top": [],
    "middle": [],
    "base": [],
    "frag": [],
    "all": all_notes,
  });

  console.log(items)

  const [pyramidType, setPyramidType] = useState("Perfume Pyramid");
  const [activeId, setActiveId] = useState(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 0.01
    }
  })
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor)

  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
    pointerSensor
  )

  const togglePyramid = ({ param }) => {
    if (pyramidType == "Perfume Pyramid") {
      setPyramidType("Fragrance Notes")
      let nitems = { ...items }
      let tiers = ["top", "middle", "base"]
      tiers.forEach((tier) => {
        nitems[tier].forEach((note) => { 
          nitems["frag"].push(note)
        })
        nitems[tier] = []
      })
      setItems(nitems)
    }
    else {
      setPyramidType("Perfume Pyramid")
      let nitems = { ...items }
      nitems["frag"].forEach((note) => {
        nitems["base"].push(note)
      })
      nitems["frag"] = [] 
      setItems(nitems)
    }
  }

  const handleChange = (e) => {
    let nitems = { ...items }
    nitems["size"] = parseInt(e.target.value)
    nitems["all"][nitems["current"]]["size"] = parseInt(e.target.value)
    setItems(nitems)
    console.log(items["all"][nitems["current"]])
  }

  const handleRightClick = (e, id) => {
    console.log(id)
    let nitems = { ...items }
    nitems["current"] = id
    if (e.nativeEvent.button === 2) {
      let container = findContainer(id) 
      let index = items[container].indexOf(id)
      console.log(container)
      console.log(items[container], index)

      let arr = findContainerVariations(id)
      console.log("variations", arr)
      let nid = " " + arr.reduce((max,name)=>{
        return name.length > max.length? name: max
      },arr[0])

      nitems[container] = [...nitems[container].slice(0, index), nid, ...nitems[container].slice(index)]
      nitems["all"][nid] = { ...nitems["all"][id] }
    }  
    setItems(nitems)
  }
  
  const handleOnClick = (e, id) => {
    let nitems = { ...items }
    nitems["current"] = id
    if (!Object.keys(items).map((i) => { return Array.isArray(items[i]) ? items[i].includes(id) : false }).some((i) => { return i == true })) {
      nitems["notes"].push(id)
      nitems["all"][id]["hidden"] = true
    }
    setItems(nitems)
  }

  function findContainer(id) {
    console.log(`"${id}"`)
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key) => {
      return Array.isArray(items[key]) ? items[key].includes(id) : false
    });
  }

  function findVariations(container, id) {
    console.log(`"${id}"`)
    if (id in items) {
      return id;
    }
    console.log(items[container])
    return Object.keys(items).map((key) => {
      return Array.isArray(items[key]) ? items[key].filter(s => s.includes(id.trimLeft())) : []
    });
  }

  function findContainerVariations(id) {
    console.log(`"${id}"`)
    if (id in items) {
      return id;
    }
    return Object.keys(items).map((key) => {
      return Array.isArray(items[key]) ? items[key].filter(s => s.includes(id.trimLeft())) : []
    }).flat();
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
    minHeight: "25vh",
    width: "90vw",
    height: "auto",
    position: "relative",
    padding: "1em",
    margin: "0 auto",
    background: "#fbfbfb",
    borderRadius: ".2em",
  }

  const editStyle= {
    padding: "1em",
    height: "auto",
    width: "auto",
    position: "relative",
    margin: "2em auto",
    borderRadius: ".2em",
  }

  const editInputStyle = {
    width: "3em", 
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
        <div className="flex flex-col justify-center text-center" id="pyramid" style={pyramidStyle}>
          <div className="strike-title" onClick={(e) => togglePyramid(e)}><span>{pyramidType}</span></div>
          {
            pyramidType == "Perfume Pyramid" ?
              <div>
                <h4 className={lato.className} style={labelStyle}><b>Top Notes</b></h4>
                <Droppable id="top" items={items["top"]} master={items["all"]} key="top" 
                  click={handleRightClick} context={handleRightClick} style={layerStyle} />
                <h4 className={lato.className} style={labelStyle}><b>Middle Notes</b></h4>
                <Droppable id="middle" items={items["middle"]} master={items["all"]} key="middle" 
                  click={handleRightClick} context={handleRightClick} style={layerStyle} />
                <h4 className={lato.className} style={labelStyle}><b>Base Notes</b></h4>
                <Droppable id="base" items={items["base"]} master={items["all"]} key="base" 
                  click={handleRightClick} context={handleRightClick} style={layerStyle} />
              </div>
              : 
              <Droppable id="frag" items={items["frag"]} master={items["all"]} key="frag" 
                click={handleRightClick} context={handleRightClick} style={layerStyle} />
          }
        </div>

        <div style={spacerStyle}></div>
        <Droppable id="notes" items={items["notes"]} master={items["all"]} key="notes" click={handleRightClick} context={handleRightClick} style={notesStyle} />
        <DragOverlay>
          {activeId ? <FragranceNotes key={activeId} id={activeId} size={items["all"][activeId]["size"]} /> : null}
        </DragOverlay>

      </DndContext>

      <div style={editStyle}>
        <label>
          img size&nbsp;
          <input type="text" style={editInputStyle}
            value={items["size"]} 
            onChange={handleChange}>
            </input>
          </label>
      </div>

      <div className="flex flex-col" key="all" style={{ marginTop: "5em" }}>
        <div id="nav" className="flex flex-row" style={{ alignItems: "center" }}>
          {
            Object.keys(notes_type).map((category) => {
              return <div className="lowercase text-center" style={{ margin: "1em" }} key={category}><a href={`#${slugify(category)}`}>{category}</a></div>
            })
          }
        </div>
        {
          Object.keys(notes_type).map((category) => {
            return <div className="flex flex-col text-center" key={category} style={{ margin: "2em auto" }}>
              <div style={{ margin: "2em"}}><h4 id={slugify(category)}>{category}</h4></div>

              <div className="flex flex-row flex-wrap text-center">
                {Object.keys(notes_type[category]).map((note) => {
                  return <FragranceNotes key={note} id={note} size={items["all"][note]["size"]} 
                    parent="all" 
                    style={{ width: "min-content", margin: "1em", display: items["all"][note]["hidden"] ? "none" : "flex" }} 
                    click={handleOnClick} />
                })
                }
              </div>
            </div>
          })
        }
      </div>
      <ScrollButton /> 
    </div>
  );
}

