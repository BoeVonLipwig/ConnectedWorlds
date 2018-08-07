import React from "react";
import ReactDOM from "react-dom";
import ContactButton from "./ContactButton";
import { shallow } from "enzyme";

it("renders button without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ContactButton />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders button correctly without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ContactButton />, div);
  expect(div).toMatchSnapshot();
  ReactDOM.unmountComponentAtNode(div);
});

it("handles clicks on menu element", () => {
  const mockHandler = jest.fn();
  const wrapper = shallow(<ContactButton clickHandler={mockHandler} />);
  wrapper.find("#contact-button").simulate("click");
  expect(mockHandler.mock.calls.length).toBe(1);
});

it("state changes to true when menu element clicked", () => {
  const wrapper = shallow(<ContactButton />);
  wrapper.find("#contact-button").simulate("click");
  expect(wrapper.state().showMenu).toBe(true);
});

it("state changes back to false when menu element clicked twice", () => {
  const wrapper = shallow(<ContactButton />);
  wrapper.find("#contact-button").simulate("click");
  expect(wrapper.state().showMenu).toBe(true);
  wrapper.find("#contact-button").simulate("click");
  expect(wrapper.state().showMenu).toBe(false);
});