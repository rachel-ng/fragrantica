"use client";

import notes from '../data/notes.json';

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const FragranceNotes = (props) => {
  const itemStyle = {
    width: "max-content",
    opacity: 0.96025,
    position: "relative",
  };
  const id = props.id.trimLeft()

  return (
    <div className="flex flex-col justify-start text-center" 
      style={{...itemStyle, ...props.style}} 
      onClick={(e) => {props.click ? props.click(e, id) : null }} 
      onContextMenu={(e) => {props.context ? props.context(e, id) : null }}>
      <div>
        <img style={{ width: "3em", minWidth: "3em", height: "auto" }} src={notes[id]["img"]}></img>
      </div>
      <div>
      <a href={notes[id]["url"]} target="_blank">{id}</a>
      {props.parent && props.parent == "notes" ? 
      <div style={{width: "min-content", fontSize: ".75rem", lineHeight: 1, margin: "0 auto 2rem auto"}}>
        {notes[id]["category"]}
      </div>
      : ""}
      </div>
    </div>
  );
};

export default FragranceNotes;
