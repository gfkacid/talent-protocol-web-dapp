import React, { useCallback, useMemo, useRef, useState } from "react";
import { Input, TextLink, Typography, Button } from "@talentprotocol/design-system";
import { session } from "../../api";
import {
  ActionContainer,
  Container,
  EmailBox,
  PasswordBox,
  PasswordLabelRow,
  SignInFormContainer,
  Divider,
  DividerLine,
  NoAccountContainer
} from "./styled";

export const SignInFlow = props => {
  const { linkedinClientId, linkedinRedirectUri } = props;
  const [hasErrors, setHasErrors] = useState(false);
  const formRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const signInWithLinkedinURL = useMemo(
    () =>
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${linkedinRedirectUri}&scope=r_liteprofile%20r_emailaddress`,
    [linkedinClientId, linkedinRedirectUri]
  );
  const loginCallback = useCallback(
    e => {
      e.preventDefault();
      session
        .signIn(emailRef.current.value, passwordRef.current.value)
        .then(() => {
          window.location = "/";
        })
        .catch(() => {
          setHasErrors(true);
        });
    },
    [emailRef, passwordRef]
  );
  return (
    <Container>
      <Typography specs={{ variant: "h3", type: "bold" }} color="primary01">
        GM, mate!
      </Typography>
      <SignInFormContainer onSubmit={loginCallback} ref={formRef}>
        <EmailBox>
          <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
            Email
          </Typography>
          <Input placeholder="johndoe@mail.com" inputRef={emailRef} hasError={hasErrors} />
        </EmailBox>
        <PasswordBox>
          <PasswordLabelRow>
            <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
              Password
            </Typography>
            <TextLink size="small" href="/passwords/new" text="Forgot Password?" color="primary" />
          </PasswordLabelRow>
          <Input
            placeholder="*********"
            type="password"
            inputRef={passwordRef}
            hasError={hasErrors}
            shortDescription={hasErrors && "Wrong email or password"}
          />
        </PasswordBox>
      </SignInFormContainer>
      <ActionContainer>
        <Button
          hierarchy="primary"
          size="large"
          isStretched
          text="Login"
          onClick={() => formRef?.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))}
        />
        <Divider>
          <DividerLine />
          <Typography specs={{ variant: "p2", type: "medium" }} color="primary03">
            OR
          </Typography>
          <DividerLine />
        </Divider>
        <Button
          hierarchy="secondary"
          size="large"
          isStretched
          text="Login with Linkedin"
          leftIcon="linkedin"
          href={signInWithLinkedinURL}
        />
        <NoAccountContainer>
          <Typography specs={{ variant: "label2", type: "medium" }} color="primary01">
            Don't have an account?
          </Typography>
          <TextLink size="small" href="/join" text="Sign up" color="primary" />
        </NoAccountContainer>
      </ActionContainer>
    </Container>
  );
};
