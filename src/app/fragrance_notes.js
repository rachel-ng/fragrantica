"use client";

import notes from '../data/notes.json';

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const FragranceNotes = (props) => {
  const itemStyle = {
    justifyContent: "center",
    flexDirection: "column",
    width: "max-content",
    textAlign: "center",
    opacity: 0.96025,
  };
  
  return (
    <div style={{...itemStyle, ...props.style}} onClick={(e) => props.onClick(e, props.id)}>
      <div>
        <img style={{ width: "3rem"}} src={notes[props.id]["img"]}></img>
      </div>
      <div>
      <a href={notes[props.id]["url"]} target="_blank">{props.id}</a>
      {props.parent && props.parent == "notes" ? 
      <div style={{width: "min-content", fontSize: ".75rem", lineHeight: 1, margin: "0 auto 2rem auto"}}>
        {notes[props.id]["category"]}
      </div>
      : ""}
      </div>
    </div>
  );
};

export default FragranceNotes;
