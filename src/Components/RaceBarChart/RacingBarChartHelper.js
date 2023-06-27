export class RacingBarChartHelper {
  constructor(props) {
    this.props = props;
    this.top_n = props.top_n ? props.top_n : 12;
  }
  halo(text, strokeWidth) {
    text
      .select(function () {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .style("fill", "#ffffff")
      .style("stroke", "#ffffff")
      .style("stroke-width", strokeWidth)
      .style("stroke-linejoin", "round")
      .style("opacity", 1);
  }
  createSlice = (slice) => {
    var resMap = new Map();
    var result = [];
    slice.map((x) => {
      if (!resMap.has(x[props.config.label]))
        resMap.set(x[props.config.label], {
          value: x[props.config.value],
          colour: x.colour ? x.colour : d3.hsl(Math.random() * 360, 0.75, 0.75),
        });
      else
        resMap.set(x[props.config.label], {
          value:
            x[props.config.value] + resMap.get(x[props.config.label]).value,
          colour: x.colour ? x.colour : d3.hsl(Math.random() * 360, 0.75, 0.75),
        });
    });
    resMap.forEach((value, key) => {
      result.push({
        name: key,
        value: value.value,
        colour: value.colour,
      });
    });
    result = result.sort((a, b) => b.value - a.value);
    result.forEach((d, i) => {
      d.rank = i;
    });
    return result.slice(0, this.top_n);
  };
  plotChart = async (data) => {
    console.log(props);
    let maxRange = props.detectoutliers
      ? props.maxrange
        ? props.maxrange
        : 6000
      : undefined;

    var tickDuration = props.intervalduration ? props.intervalduration : 1000;

    var height = props.dimensions ? props.dimensions.height : 400;
    var width = props.dimensions ? props.dimensions.width : window.innerWidth;
    var svg = d3
      .select("#chart")
      .append("svg")

      .attr("viewBox", `0 0 ${width + 100} ${height}`)
      .attr("width", `${width + 100}`);
    const margin = {
      top: 80,
      right: 0,
      bottom: 5,
      left: 0,
    };

    let barPadding = (height - (margin.bottom + margin.top)) / (top_n * 5);

    let caption = svg
      .append("text")
      .attr("class", "caption")
      .attr("x", width)
      .attr("y", height - 5)
      .style("text-anchor", "end");

    data = d3.group(data, (d) => d[props.config.timelinekey]);

    let slices = Array.from(data.keys()).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    let year = slices[0];

    let yearSlice = createSlice(data.get(year));

    let x = d3
      .scaleLinear()
      .domain([0, maxRange ? maxRange : d3.max(yearSlice, (d) => d.value)])
      .range([margin.left, width - margin.right - 65]);

    let y = d3
      .scaleLinear()
      .domain([top_n, 0])
      .range([height - margin.bottom, margin.top]);

    let xAxis = d3
      .axisTop(x)
      .scale(x)
      .ticks(width > 500 ? 5 : 2)
      .tickSize(-(height - margin.top - margin.bottom))
      .tickFormat((d) => d3.format(",")(d));

    svg
      .append("g")
      .attr("class", "axis xAxis")
      .attr("transform", `translate(0, ${margin.top})`)
      .call(xAxis)
      .selectAll(".tick line")
      .selectAll(".tick:not(:first-of-type) line")
      .attr("stroke", "white")
      .classed("origin", (d) => d == 0);

    svg
      .selectAll("react.bar")
      .data(yearSlice, (d) => d.name)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", x(0) + 1)
      .attr("width", (d) => {
        return maxRange
          ? d.value > maxRange
            ? width - 10
            : x(d.value)
          : d3.min([x(d.value), 300]);
      })
      .attr("y", (d) => y(d.rank) + 5)
      .attr("height", y(1) - y(0) - barPadding)
      .style("fill", (d) => d.colour);

    svg
      .selectAll("text.label")
      .data(yearSlice, (d) => d.name)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => {
        return maxRange
          ? d.value > maxRange
            ? width - 20
            : x(d.value)
          : x(d.value);
      })
      .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1)
      .style("text-anchor", "end")
      .html((d) => d.name);

    svg
      .selectAll("text.valueLabel")
      .data(yearSlice, (d) => d.value)
      .enter()
      .append("text")
      .attr("class", "valueLabel")
      .attr("x", (d) => {
        return maxRange
          ? d.value > maxRange
            ? width
            : x(d.value)
          : x(d.value);
      })
      .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1)
      .text((d) => d3.format(",.0f")(d.value));

    let yearText = svg
      .append("text")
      .attr("class", "yearText")
      .attr("x", width - margin.right)
      .attr("y", height - 25)
      .style("text-anchor", "end")
      .html(
        new Date(year).toLocaleDateString(undefined, {
          year: "numeric",
          month: "2-digit",
        })
      )
      .call(halo, 10);
    maxRange
      ? svg
          .append("text")
          .attr("class", "legend")
          .attr("x", width - margin.right)
          .attr("y", height - 5)
          .style("text-anchor", "end")
          .html(`Outliers at ${maxRange}+`)
          .call(halo, 10)
      : null;
    let counter = 0;

    let ticker = d3.interval((e) => {
      counter++;
      yearSlice = createSlice(data.get(year));

      x.domain([0, maxRange ? maxRange : d3.max(yearSlice, (d) => d.value)]);

      svg
        .select(".xAxis")
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .call(xAxis);

      let bars = svg.selectAll(".bar").data(yearSlice, (d) => d.name);

      bars
        .enter()
        .append("rect")
        .attr("class", (d) => `bar ${d.name.replace(/\s/g, "_")}`)
        .attr("x", x(0) + 1)
        .attr("width", (d) => {
          return maxRange
            ? d.value > maxRange
              ? width - 10
              : x(d.value)
            : d3.min([x(d.value), 300]);
        })
        .attr("y", (d) => y(top_n + 1) + 5)
        .attr("height", y(1) - y(0) - barPadding)
        .style("fill", (d) => d.colour)
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("y", (d) => y(d.rank) + 5);

      bars
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("width", (d) => {
          return maxRange
            ? d.value > maxRange
              ? width - 10
              : x(d.value)
            : x(d.value) - x(0) - 1;
        })
        .attr("y", (d) => y(d.rank) + 5);

      bars
        .exit()
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("width", (d) => {
          return maxRange
            ? d.value > maxRange
              ? width - 10
              : x(d.value)
            : x(d.value) - x(0) - 1;
        })
        .attr("y", (d) => y(top_n + 1) + 5)
        .remove();

      let labels = svg.selectAll(".label").data(yearSlice, (d) => d.name);

      labels
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d) => {
          return maxRange
            ? d.value > maxRange
              ? width - 20
              : x(d.value)
            : x(d.value);
        })
        .attr("y", (d) => y(top_n + 1) + 5 + (y(1) - y(0)) / 2)
        .style("text-anchor", "end")
        .html((d) => d.name)
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1);

      labels
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d) => {
          return maxRange
            ? d.value > maxRange
              ? width - 20
              : x(d.value)
            : x(d.value);
        })
        .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1);

      labels
        .exit()
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d) => {
          return maxRange
            ? d.value > maxRange
              ? width - 20
              : x(d.value)
            : x(d.value);
        })
        .attr("y", (d) => y(top_n + 1) + 5)
        .remove();

      let valueLabels = svg
        .selectAll(".valueLabel")
        .data(yearSlice, (d) => d.name);

      valueLabels
        .enter()
        .append("text")
        .attr("class", "valueLabel")
        .attr("x", (d) => {
          return maxRange
            ? d.value > maxRange
              ? width
              : x(d.value)
            : x(d.value) + 5;
        })
        .attr("y", (d) => y(top_n + 1) + 5)
        .text((d) => d3.format(",.0f")(d.value))
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1);

      valueLabels
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d) => {
          return maxRange
            ? d.value > maxRange
              ? width
              : x(d.value)
            : x(d.value) + 5;
        })
        .attr("y", (d) => y(d.rank) + 5 + (y(1) - y(0)) / 2 + 1)
        .tween("text", function (d) {
          let i = d3.interpolateRound(d.value, d.value);
          return function (t) {
            this.textContent = d3.format(",")(i(t));
          };
        });

      valueLabels
        .exit()
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d) => {
          return maxRange
            ? d.value > maxRange
              ? width
              : x(d.value)
            : x(d.value) + 5;
        })
        .attr("y", (d) => y(top_n + 1) + 5)
        .remove();

      yearText.html(
        new Date(year.toString()).toLocaleDateString(undefined, {
          year: "numeric",
          month: "2-digit",
        })
      );

      if (year == slices[slices.length - 1]) ticker.stop();

      year = slices[counter];
    }, tickDuration);
  };
}
