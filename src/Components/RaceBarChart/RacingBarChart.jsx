import { useEffect } from "react";
import * as d3 from "d3";
import "./RaceBarChart.css";
import { RacingBarChartHelper } from "./RacingBarChartHelper";

const RacingBarChart = (props) => {
  const racingBarChartHelper = new RacingBarChartHelper(props);
  useEffect(() => {
    racingBarChartHelper.plotChart(props.data ? JSON.parse(props.data) : []);
  }, []);

  return <div id="chart"></div>;
};

export default RacingBarChart;
