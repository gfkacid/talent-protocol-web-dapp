import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input, Typography } from "@talentprotocol/design-system";
import { Row, Form, TitleRow } from "./styled";
import { username } from "../../../../api/username";

export const HandleStep = ({ user, setUser, setIsNextDisable }) => {
  const [handleError, setHandleError] = useState("");
  const handleRef = useRef(null);
  const validateStep = useCallback(() => {
    username
      .validateHandle(handleRef.current.value)
      .then(({ data }) => {
        if (data.error) {
          setHandleError(data.error);
          setIsNextDisable(true);
        } else {
          setHandleError("");
          setIsNextDisable(false);
          setUser({
            ...user,
            handle: handleRef.current.value
          });
        }
      })
      .catch(() => {
        setHandleError("Something happened");
        setIsNextDisable(true);
      });
  }, [handleRef, setHandleError, setUser, user]);
  useEffect(() => {
    if (user.handle) {
      validateStep()
    }
  }, [user]);
  return (
    <>
      <TitleRow>
        <Typography specs={{ variant: "h3", type: "bold" }} color="primary01">
          Choose your @handle.
        </Typography>
        <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
          Your handle is your username on Talent Protocol and you’ll be also able to claim it as your domain.
        </Typography>
      </TitleRow>
      <Form>
        <Row>
          <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
            Handle
          </Typography>
          <Input
            placeholder="johndoe"
            defaultValue={user.handle}
            inputRef={handleRef}
            hasError={!!handleError}
            onChange={validateStep}
            onBlur={validateStep}
            shortDescription={handleError}
          />
        </Row>
      </Form>
    </>
  );
};
