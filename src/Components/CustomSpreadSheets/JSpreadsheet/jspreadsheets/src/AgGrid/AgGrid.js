import React, { useCallback, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

var filterParams = {
  comparator: function (filterLocalDateAtMidnight, cellValue) {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split("/");
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
  },
  browserDatePicker: true,
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete" },
    { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
    { field: "country" },
    { field: "year", maxWidth: 100 },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: filterParams,
    },
    { field: "sport" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: false },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: true,
      editable: true,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json", {
      headers: {
        Accept: "*/*",
      },
    }).then((resp) => {
      resp.json().then((data) => {
        console.log(data);
        setRowData(data);
      });
    });
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "Athlete",
      field: "athlete",
      minWidth: 250,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        checkbox: true,
      },
    };
  }, []);
  const enableFillHandle = true;

  // enables undo / redo
  const undoRedoCellEditing = true;

  // restricts the number of undo / redo steps to 5
  const undoRedoCellEditingLimit = 5;

  // enables flashing to help see cell changes
  const enableCellChangeFlash = true;
  return (
    <div style={containerStyle}>
      <div
        className="ag-theme-alpine"
        style={{ height: "100vh", width: "100vw" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          // autoGroupColumnDef={autoGroupColumnDef}
          groupSelectsChildren={true}
          enableFillHandle={enableFillHandle}
          undoRedoCellEditing={undoRedoCellEditing}
          suppressMultiRangeSelection={true}
          undoRedoCellEditingLimit={undoRedoCellEditingLimit}
          onGridReady={onGridReady}
          // enableRangeSelection={true}
          // enableRangeSelection={true}
          // enableRangeHandle={true}
          enableRangeSelection={true}
        ></AgGridReact>
      </div>
    </div>
  );
};
export default GridExample;
