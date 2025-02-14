import React, { useEffect } from "react";

import { urlStore } from "src/contexts/state";

import Dropdown from "react-bootstrap/Dropdown";
import { P2 } from "src/components/design_system/typography";
import Tab from "src/components/design_system/tab";
import { ArrowFill, Invite, Quest } from "src/components/icons";

import cx from "classnames";

const EarnMenu = () => {
  // eslint-disable-next-line no-unused-vars
  const url = urlStore(state => state.url);
  const changeURL = urlStore(state => state.changeURL);

  const active = window.location.pathname === "/earn";

  useEffect(() => {
    changeURL(new URL(document.location));
  }, [window.location]);

  return (
    <Dropdown>
      <Dropdown.Toggle
        className={cx("no-caret d-flex align-items-center", "text-primary-04")}
        id="earn-dropdown"
        bsPrefix=""
        as="div"
        style={{ height: 34 }}
      >
        <Tab type="white" active={active} className="d-flex align-items-center mr-4">
          <P2 className={cx("mr-2", active ? "text-black" : "current-color")} bold text="Earn" />
          <ArrowFill className="toggle-arrow" size={8} pathClassName="text-primary-04" color="currentColor" />
        </Tab>
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-menu-dropdown">
        <Dropdown.Item
          key="quests-dropdown-theme"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          href="/earn?tab=quests"
        >
          <Quest pathClassName="icon-dropdown-item" />
          <P2 bold text="Quests" className="text-black ml-3" />
        </Dropdown.Item>
        <Dropdown.Item
          key="invites-dropdown-theme"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          href="/earn?tab=talent"
        >
          <Invite pathClassName="icon-dropdown-item" />
          <P2 bold text="Invites" className="text-black ml-3" />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default EarnMenu;
