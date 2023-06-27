# react-control-lib

Seamless & fully customizable bar chart for React.The result of bar chart is already sorted in descending order so you don't need to write extra code for that purpose.

<br>

## Quick Start

```
npm install --save react-control-lib
```

```javascript
import "react-control-lib";
```

You should call the web component directly into your code with necessary parameters to plot the chart.
All the parameters should be pass as string type since its a web component.

```jsx
<racebar-chart />
```

## Usage

> Passing props.

You will need to pass your own props to the `racebar-chart` webcomponent.
| Prop | Type | Required |Explanation |
| ----------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **data** | JSONArray | Yes | An array of objects with keys being the data for the chart . Ex- `data=[{ mnth: "2020-08", cnt: "2133435", name: "Test",}]`|
| **config** | Object | Yes | An object containing keys that are in present in the array objects of the data attribute. **timelinekey:** the property on which timeline will be constructed. **value:** the property to be used to plot the data on the x-axis. **label:** the property to appear on labels of the bars in the chart |
| **detectOutliers** | Boolean | No | A boolean attribute to detect and set max range to handle the scenario . Default maxRange: 6000 |
| **maxRange** | Integer | No | A number to give the maxRange to limit the bars to plot the outliers. Default: 6000 |
| **top_n** | Integer | No | The total numbers of entries to be displayed in the chart .Default: 12 |
| **intervalDuration** | Integer |No | Waiting time between intervals in the timeLine (in ms). Default: 1000 |
| **dimensions** | Object | No | An object that contains the width and height of the container .Default {width: window.innerwidth, height : 400 } |

## Usage with parameters in HTML

```jsx
<racebar-chart
  data='[{mnth:"2020-10-11", cnt :"234354", name:"Test name"}]'
  config='{"timelinekey":"mnth","value":"cnt","label":"name"}'
/>
```

## Usage with parameters in React

```jsx
<racebar-chart
  data={JSON.stringify(data)}
  config={JSON.stringify({
    timelinekey: "mnth",
    value: "cnt",
    label: "name",
  })}
  //optional parameters
  detectOutliers={"true"}
  dimensions={JSON.stringify({ width: 900, height: 500 })}
/>
```
