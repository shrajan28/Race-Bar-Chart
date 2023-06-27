import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HotTable } from "@handsontable/react";
import { textRenderer } from "handsontable/renderers/textRenderer";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.min.css";
import Handsontable from "handsontable";
import "pikaday/css/pikaday.css";
import { progressBarRenderer, starsRenderer } from "./renderers";
import { data } from "./sample";
import { UndoRedo } from "handsontable/plugins";
import {
  alignHeaders,
  drawCheckboxInRowHeaders,
  addClassesToRows,
  changeCheckboxCell,
} from "./hooks";

// register Handsontable's modules
registerAllModules();

function Hud(props) {
  const hotSettings = {
    startRows: 1000,
    data: props.data,
    startCols: 1000,
    undo: true,

    isEmptyCol: true,
    isEmptyRow: true,
    colHeaders: true,
    rowHeaders: true,
    // columns: [
    //   { data: 1, type: "text" },
    //   { data: 3, type: "text" },
    //   {
    //     data: 4,
    //     type: "date",
    //     allowInvalid: false,
    //   },
    //   {
    //     data: 6,
    //     type: "checkbox",
    //     className: "htCenter",
    //   },
    //   {
    //     data: 7,
    //     type: "numeric",
    //   },
    //   {
    //     data: 8,
    //     renderer: progressBarRenderer,
    //     readOnly: true,
    //     className: "htMiddle",
    //   },
    //   {
    //     data: 9,
    //     renderer: starsRenderer,
    //     readOnly: true,
    //     className: "star htCenter",
    //   },
    //   { data: 5, type: "text" },
    //   { data: 2, type: "text" },
    // ],
    dropdownMenu: true,
    hiddenColumns: {
      indicators: true,
    },
    contextMenu: true,
    multiColumnSorting: true,
    filters: true,
    rowHeaders: true,
    afterGetColHeader: alignHeaders,
    //afterGetRowHeader: drawCheckboxInRowHeaders,
    afterOnCellMouseDown: changeCheckboxCell,
    beforeRenderer: addClassesToRows,
    licenseKey: "non-commercial-and-evaluation",
    search: true,
  };
  const [click, setClick] = useState(false);
  return (
    <div>
      {" "}
      <g-toolbar>
        * <g-icon-button src="menu.png" on-click="menuAction"></g-icon-button>*{" "}
        <div
          class="flex"
          onClick={() => {
            setClick(!click);
            console.log(click);
          }}
        >
          Title
        </div>
        * <g-icon-button src="more.png" on-click="moreAction"></g-icon-button>*{" "}
      </g-toolbar>{" "}
      <HotTable id="hot" settings={hotSettings} />
    </div>
  );
}

export default Hud;
