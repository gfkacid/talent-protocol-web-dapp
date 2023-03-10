import React, { useCallback, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@talentprotocol/design-system";
import { Container, ActionArea } from "./styled";

export const Captcha = ({ captchaKey, nextStep, user, setUser, closeModal }) => {
  const [isNextDisabled, setIsNextDisable] = useState(true);
  const recaptchaSubmition = useCallback(
    value => {
      setIsNextDisable(false);
      setUser({
        ...user,
        captcha: value
      });
    },
    [user, setUser, closeModal, nextStep]
  );
  return (
    <Container>
      <ReCAPTCHA sitekey={captchaKey} onChange={recaptchaSubmition} />
      <ActionArea>
        <Button
          size="small"
          hierarchy="primary"
          text="Next"
          onClick={() => {
            nextStep();
            closeModal();
          }}
          isDisabled={isNextDisabled}
        />
      </ActionArea>
    </Container>
  );
};
