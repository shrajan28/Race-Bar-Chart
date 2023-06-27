import React, { useEffect, useRef } from "react";
import jspreadsheet from "jspreadsheet-ce";
import jexcel from "jexcel";
import "../node_modules/jexcel/dist/jexcel.css";

function Component() {
  const jRef = useRef(null);
  const options = {
    data: [[]],
    minDimensions: [500, 500],
  };

  useEffect(() => {
    if (!jRef.current.jspreadsheet) {
      jspreadsheet(document.getElementById("spreadsheet"), {
        minDimensions: [200, 200],
        lazyLoading: true,
        paste: true,
        copy: true,
        copyCompatibility: true,
        noCellsSelected: true,
        selectionCopy: true,
        columns: [
          {
            type: "text",
            width: 200,
            title: "Name",
          },
          {
            type: "dropdown",
            width: 100,
            title: "Age",
            source: [
              {
                id: 1,
                name: "Male",
              },
              {
                id: 2,
                name: "Female",
              },
            ],
          },
          {
            type: "text",
            width: 200,
            title: "City",
          },
        ],
      });
    }
  }, []);

  const addRow = () => {
    jexcel.insertRow();
  };

  return (
    <div>
      <div id="spreadsheet" ref={jRef} />
      <br />
      <input type="button" onClick={addRow} value="Add new row" />
    </div>
  );
}

export default Component;
