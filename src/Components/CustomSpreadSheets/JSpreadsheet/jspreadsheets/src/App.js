import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import jspreadsheet from "jspreadsheet-ce";
import Component from "./Component";
import Hud from "./Hud";
import * as XLSX from "xlsx";
import GridExample from "./AgGrid/AgGrid";
function App() {
  const [data, setData] = useState();
  // useEffect(() => {
  //   // var urls = [
  //   //   "https://bossanova.uk/jspreadsheet/v3/jexcel.js,https://jsuites.net/v3/jsuites.js",
  //   // ];
  //   // urls.map((u) => {
  //   //   const script = document.createElement("script");

  //   //   script.src = u;
  //   //   script.async = true;

  //   //   document.body.appendChild(script);
  //   });
  // }, []);
  const uploadChange = (e) => {
    e.preventDefault();

    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets["Opportunity"];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, {
        header: 1,
      });
      console.log(dataParse);
      setData(dataParse);
    };
    reader.readAsBinaryString(f);
  };
  return (
    <div>
      <GridExample />
    </div>
  );
}

export default App;
