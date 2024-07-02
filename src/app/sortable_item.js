"use client";

import notes from '../data/notes.json';

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import FragranceNotes from './fragrance_notes';

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
    position: "relative",
    userSelect: "none",
    cursor: "grab",
    boxSizing: "border-box", 
  };

  return (
    <div style={{...itemStyle, ...props.style}} ref={setNodeRef} {...attributes} {...listeners}>
      <FragranceNotes key={props.id} id={props.id} parent={props.parent}></FragranceNotes>
    </div>
  );
};

export default SortableItem;
