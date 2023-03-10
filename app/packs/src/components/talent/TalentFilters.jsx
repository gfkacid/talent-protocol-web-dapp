import React, { useMemo } from "react";

import Dropdown from "react-bootstrap/Dropdown";
import { P2, P3 } from "src/components/design_system/typography";
import { OrderBy } from "src/components/icons";

const TalentFilters = ({ status, setStatus, filter, isAdminOrModerator = false }) => {
  const options = useMemo(() => {
    if (isAdminOrModerator) {
      return [
        "All",
        "Admin all",
        "Trending",
        "Latest added",
        "Launching soon",
        "Pending approval",
        "Verified",
        "By Celo Network",
        "By Polygon Network",
        "Looking for a mentor",
        "Looking to mentor others",
        "Looking to hire",
        "Looking for new opportunities"
      ];
    }

    return [
      "All",
      "Trending",
      "Latest added",
      "Launching soon",
      "Verified",
      "By Celo Network",
      "By Polygon Network",
      "Looking for a mentor",
      "Looking to mentor others",
      "Looking to hire",
      "Looking for new opportunities"
    ];
  }, [isAdminOrModerator]);

  const selectedClass = option => (option == status ? " text-primary" : "text-black");

  const filterOptions = (e, option) => {
    setStatus(option);
    filter(e, "status", option);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="talent-button white-subtle-button normal-size-button no-caret d-flex justify-content-between align-items-center"
        id="talent-filters-dropdown"
        bsPrefix=""
        as="div"
        style={{ height: 34, width: 150 }}
      >
        <P2 bold text={status} className="mr-2 align-middle text-black text-ellipsis" />
        <OrderBy black />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map(option => (
          <Dropdown.Item
            key={`tab-dropdown-${option}`}
            className="d-flex flex-row justify-content-between"
            onClick={e => filterOptions(e, option)}
          >
            <P3 bold text={option} className={selectedClass(option)} />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TalentFilters;
