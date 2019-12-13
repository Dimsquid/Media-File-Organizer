import * as React from "react";
import { mount } from "enzyme";
import Playlists from "./Playlists";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const fakeSaveFile = {
  media: [],
  playlists: [],
  categories: []
};

test("Checks that the edit button will toggle the new modal", () => {
  const fakeFunc = jest.fn();

  const spy = jest.spyOn(Playlists.prototype, "toggleModal");
  const wrapper = mount(<Playlists match={{ params: { id: 0 } }} jsonData={fakeSaveFile} updateJSON={fakeFunc} />);

  expect(wrapper.state("showModal")).toBeFalsy();

  wrapper
    .find(FontAwesomeIcon)
    .first()
    .simulate("click");
  expect(spy).toHaveBeenCalledTimes(1);

  expect(wrapper.state("showModal")).toBeTruthy();
});

test("Changing a value in the input box will run onChange Function", () => {
  const fakeFunc = jest.fn();

  const spy = jest.spyOn(Playlists.prototype, "onChange");
  const wrapper = mount(<Playlists match={{ params: { id: 0 } }} jsonData={fakeSaveFile} updateJSON={fakeFunc} />);

  wrapper.setState({ showModal: true });

  wrapper
    .find(".nameChangeBar")
    .find("input")
    .first()
    .simulate("change", "dsd");
  expect(spy).toHaveBeenCalledTimes(1);
});
