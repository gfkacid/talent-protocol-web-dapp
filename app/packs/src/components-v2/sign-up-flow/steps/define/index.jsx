import { Dropdown, Input, Typography } from "@talentprotocol/design-system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { genderOptions, nationalityOptions } from "../../../../components/talent/Edit/dropdownValues";
import { TitleRow, Row, RowWithMargin, Form } from "./styled";

export const DefineStep = ({ user, setUser, setIsNextDisable }) => {
  const [gender, setGender] = useState(user.gender || "");
  const [nationality, setNationality] = useState(user.nationality || "");
  const locationRef = useRef(null);
  const validateStep = useCallback((genderParameter, nationalityParameter) => {
    if ((!!genderParameter || !!gender) && (!!nationalityParameter || !!nationality) && locationRef.current.value) {
      setUser({
        ...user,
        gender: gender || genderParameter,
        nationality: nationality || nationalityParameter,
        location: locationRef.current.value
      });
    } else {
      setIsNextDisable(true);
    }
  }, [gender, nationality, locationRef, user, setUser]);
  useEffect(() => {
    setIsNextDisable(false);
  }, [user, setIsNextDisable]);
  return (
    <>
      <TitleRow>
        <Typography specs={{ variant: "h3", type: "bold" }} color="primary01">
          What best defines you?
        </Typography>
        <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
          Only Location will be visible in your profile.
        </Typography>
      </TitleRow>
      <Form>
        <Row>
          <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
            Gender
          </Typography>
          <Dropdown
            options={genderOptions}
            selectValue={value => {
              setGender(value);
              validateStep(value);
            }}
            value={gender || user.gender || ""}
            placeholder="Select a gender"
          />
        </Row>
        <RowWithMargin>
          <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
            Nationality
          </Typography>
          <Dropdown
            options={nationalityOptions}
            selectValue={value => {
              setNationality(value);
              validateStep(undefined, value);
            }}
            value={nationality || user.nationality || ""}
            placeholder="Select a nationality"
          />
        </RowWithMargin>
        <RowWithMargin>
          <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
            Location
          </Typography>
          <Input
            placeholder="Porto, Portugal"
            onChange={validateStep}
            onBlur={validateStep}
            inputRef={locationRef}
            defaultValue={user.location}
          />
        </RowWithMargin>
      </Form>
    </>
  );
};


/*

          <Input
            placeholder="Italian, Japonese, Colombian..."
            onChange={validateStep}
            onBlur={validateStep}
            inputRef={nationalityRef}
            defaultValue={user.nationality}
          />

*/
