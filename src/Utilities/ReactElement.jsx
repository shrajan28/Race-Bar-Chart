import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import htmlToReact from "html-to-react";
import RacingBarChart from "../Components/RaceBarChart/RacingBarChart.jsx";
//To be done and tested. !! . Works only with RaceBarCHart as of now.

export default class ReactElement extends HTMLElement {
  constructor() {
    super();
    this.observer = new MutationObserver(() => this.update());
    this.observer.observe(this, { attributes: true });
  }

  connectedCallback() {
    this._innerHTML = this.innerHTML;
    this.mount();
  }

  disconnectedCallback() {
    this.unmount();
    this.observer.disconnect();
  }

  update() {
    this.unmount();
    this.mount();
  }

  mount() {
    const events = {};
    const props = {
      ...this.getProps(this.attributes),
      ...this.getEvents(events),
      children: this.parseHtmlToReact(this.innerHTML),
    };

    render(<RacingBarChart {...props} />, this);
  }

  unmount() {
    unmountComponentAtNode(this);
  }

  parseHtmlToReact(html) {
    return html && new htmlToReact.Parser().parse(html);
  }

  getProps(attributes) {
    console.log("in props");
    return [...attributes]
      .filter((attr) => attr.name !== "style")
      .map((attr) => this.convert(attr.name, attr.value))
      .reduce((props, prop) => ({ ...props, [prop.name]: prop.value }), {});
  }

  getEvents(propTypes) {
    return Object.keys(propTypes)
      .filter((key) => /on([A-Z].*)/.exec(key))
      .reduce(
        (events, ev) => ({
          ...events,
          [ev]: (args) => this.dispatchEvent(new CustomEvent(ev, { ...args })),
        }),
        {}
      );
  }

  convert(attrName, attrValue) {
    let value = attrValue;
    if (attrValue === "true" || attrValue === "false")
      value = attrValue === "true";
    else if (!isNaN(attrValue) && attrValue !== "") value = +attrValue;
    else if (/^{.*}/.exec(attrValue)) value = JSON.parse(attrValue);
    return {
      name: attrName,
      value: value,
    };
  }
}

customElements.define("racebar-chart", ReactElement, { shadow: true });
