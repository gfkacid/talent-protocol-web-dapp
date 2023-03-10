import { Button, Icon, Spinner, Typography } from "@talentprotocol/design-system";
import React, { useCallback, useEffect, useState } from "react";
import { users } from "../../../../api";
import { Container, TitleRow } from "./styled";

export const ConfirmEmailStep = ({ user, goToFirstStep, setHasCreateAccountError, setCreatedUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const createAccountCallback = useCallback(() => {
    users
      .createAccount(user)
      .then(({ data }) => {
        setIsLoading(false);
        setHasError(false);
        setHasCreateAccountError(false);
        setCreatedUser(data);
      })
      .catch(() => {
        setIsLoading(false);
        setHasError(true);
        setHasCreateAccountError(true);
      });
  }, [user, setHasCreateAccountError]);
  useEffect(() => {
    createAccountCallback();
  }, [createAccountCallback]);
  return isLoading ? (
    <Container>
      <Spinner size={64} />
    </Container>
  ) : (
    (hasError && (
      <Container>
        <Icon name="question" color="primary04" size={64} />
        <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
          Something went wrong
        </Typography>
        <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
          Please check your registration data for errors or reach out to the team
        </Typography>
        <Button hierarchy="primary" size="medium" text="Review data" onClick={goToFirstStep} />
      </Container>
    )) || (
      <Container>
        <TitleRow>
          <Typography specs={{ variant: "h3", type: "bold" }} color="primary01">
            Lastly, Please check you inbox and confirm your email:
          </Typography>
          <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
            {user.email}
          </Typography>
        </TitleRow>
      </Container>
    )
  );
};
