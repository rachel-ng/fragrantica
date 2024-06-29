"use client";

import notes from '../data/notes.json';

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const notes_list = Object.keys(notes).map((note) => {
  return notes[note]["name"]
})

const notes_type = Object.keys(notes).map((note) => {
  return {"name": notes[note]["name"], "type": "notes"}
})

const SortableItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: "0.2rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    width: "max-content",
    textAlign: "center",
    opacity: 0.96025,
    position: "relative",
    userSelect: "none",
    cursor: "grab",
    boxSizing: "border-box", 
  };

  return (
    <div style={itemStyle} ref={setNodeRef} {...attributes} {...listeners}>
      <div>
        <img style={{ width: "3rem"}} src={notes[props.id]["img"]}></img>
      </div>
      <div style={{justifyContent: "center"}}>
      <a href={notes[props.id]["url"]} target="_blank">{props.id}</a>
      {/* {props.parent == "notes" ? 
      <div style={{width: "min-content", fontSize: ".75rem", lineHeight: 1, marginBottom: "2rem"}}>
        {notes[props.id]["category"]}
      </div>
      : ""} */}
      </div>
    </div>
  );
};

export default SortableItem;
