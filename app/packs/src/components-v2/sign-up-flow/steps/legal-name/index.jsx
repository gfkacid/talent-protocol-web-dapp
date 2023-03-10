import { Input, Typography } from "@talentprotocol/design-system";
import React, { useCallback, useEffect, useRef } from "react";
import { TitleRow, Row, RowWithMargin, Form } from "./styled";

export const LegalNameStep = ({ setIsNextDisable, setUser, user }) => {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const validateStep = useCallback(() => {
    if (firstNameRef.current.value && lastNameRef.current.value) {
      setUser({ ...user, firstName: firstNameRef.current.value, lastName: lastNameRef.current.value });
      setIsNextDisable(false);
    }
  }, [firstNameRef, lastNameRef, setIsNextDisable]);
  useEffect(() => {
    validateStep();
  }, [user]);
  return (
    <>
      <TitleRow>
        <Typography specs={{ variant: "h3", type: "bold" }} color="primary01">
          First we need your real name.
        </Typography>
        <Typography specs={{ variant: "p2", type: "regular" }} color="primary01">
          We need your legal name to be able to verify your identity. You can choose to keep your real name private and
          not show it in your profile.
        </Typography>
      </TitleRow>
      <Form>
        <Row>
          <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
            First Name
          </Typography>
          <Input
            placeholder="John"
            defaultValue={user.firstName}
            inputRef={firstNameRef}
            onChange={validateStep}
            onBlur={validateStep}
          />
        </Row>
        <RowWithMargin>
          <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
            Last Name
          </Typography>
          <Input
            placeholder="Doe"
            defaultValue={user.lastName}
            inputRef={lastNameRef}
            onChange={validateStep}
            onBlur={validateStep}
          />
        </RowWithMargin>
      </Form>
    </>
  );
};
