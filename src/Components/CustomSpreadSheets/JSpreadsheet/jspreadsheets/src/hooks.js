import Handsontable from "handsontable";

const SELECTED_CLASS = "selected";
const DEFAULT_ALIGNMENT_CLASS = "htLeft";
const ODD_ROW_CLASS = "odd";
const headerAlignments = new Map([
  ["9", "htCenter"],
  ["10", "htRight"],
  ["12", "htCenter"],
]);

export const addClassesToRows = (
  TD,
  row,
  column,
  prop,
  value,
  cellProperties
) => {
  // Adding classes to `TR` just while rendering first visible `TD` element
  if (column !== 0) {
    return;
  }

  const parentElement = TD.parentElement;

  if (parentElement === null) {
    return;
  }

  // Add class to selected rows
  if (cellProperties.instance.getDataAtRowProp(row, "0")) {
    Handsontable.dom.addClass(parentElement, SELECTED_CLASS);
  } else {
    Handsontable.dom.removeClass(parentElement, SELECTED_CLASS);
  }

  // Add class to odd TRs
  if (row % 2 === 0) {
    Handsontable.dom.addClass(parentElement, ODD_ROW_CLASS);
  } else {
    Handsontable.dom.removeClass(parentElement, ODD_ROW_CLASS);
  }
};

export const drawCheckboxInRowHeaders = function drawCheckboxInRowHeaders(
  row,
  TH
) {
  const input = document.createElement("input");

  input.type = "checkbox";

  if (row >= 0 && this.getDataAtRowProp(row, "0")) {
    input.checked = true;
  }

  Handsontable.dom.empty(TH);

  TH.appendChild(input);
};

export const alignHeaders = (column, TH) => {
  if (column < 0) {
    return;
  }

  if (TH.firstChild) {
    if (headerAlignments.has(column.toString())) {
      Handsontable.dom.removeClass(TH.firstChild, DEFAULT_ALIGNMENT_CLASS);
      Handsontable.dom.addClass(
        TH.firstChild,
        // @ts-ignore Above if checks whether there is an element in the Map.
        headerAlignments.get(column.toString())
      );
    } else {
      Handsontable.dom.addClass(TH.firstChild, DEFAULT_ALIGNMENT_CLASS);
    }
  }
};

export const changeCheckboxCell = function changeCheckboxCell(event, coords) {
  const target = event.target;

  if (coords.col === -1 && event.target && target.nodeName === "INPUT") {
    event.preventDefault(); // Handsontable will render checked/unchecked checkbox by it own.

    this.setDataAtRowProp(coords.row, "0", !target.checked);
  }
};
