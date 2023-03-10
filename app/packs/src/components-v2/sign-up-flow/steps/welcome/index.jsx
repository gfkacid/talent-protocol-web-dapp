import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Button, TextLink, Typography } from "@talentprotocol/design-system";
import {
  ActionContainer,
  AvatarContainer,
  Container,
  LoadingStateContainer,
  PrivacyPolicyStatementContainer
} from "./styled";

export const WelcomeStep = ({ linkedinRedirectUri, linkedinClientId, inviteProps, openCaptchaModal }) => {
  const [state, setState] = useState("loading");
  const signInWithLinkedinURL = useMemo(
    () =>
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${linkedinRedirectUri}&scope=r_liteprofile%20r_emailaddress`,
    [linkedinClientId, linkedinRedirectUri]
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      const username = window.location.href.split("/join/")[1];
      if (username) {
        setState("invite");
        return;
      }
      setState("no-invite");
    }
  }, [inviteProps]);
  const InviterArea = useMemo(() => {
    if (state === "no-invite") {
      return (
        <Typography specs={{ variant: "h3", type: "bold" }} color="primary01">
          Join Talent Protocol
        </Typography>
      );
    }
    return (
      <>
        <AvatarContainer>
          <Avatar size="lg" userId={1} url={inviteProps.profilePictureUrl || ""} />
        </AvatarContainer>
        <Typography specs={{ variant: "h3", type: "bold" }} color="primary01">
          {inviteProps.name || "Your friend"} has invited you to join Talent Protocol
        </Typography>
      </>
    );
  }, [state, inviteProps]);
  return state === "loading" ? (
    <LoadingStateContainer>loading</LoadingStateContainer>
  ) : (
    <Container>
      {InviterArea}
      <ActionContainer>
        <Button
          hierarchy="primary"
          size="large"
          leftIcon="email"
          iconColor="bg01"
          text="Sign up with Email"
          isStretched
          onClick={openCaptchaModal}
        />
        <Button
          hierarchy="secondary"
          size="large"
          leftIcon="linkedin"
          text="Sign up with Linkedin"
          isStretched
          href={signInWithLinkedinURL}
        />
      </ActionContainer>
      <PrivacyPolicyStatementContainer>
        <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
          By continue you agree and you’ve read the
        </Typography>
        <TextLink
          size="small"
          text="Terms & Conditions"
          color="primary"
          href="https://talentprotocol.notion.site/Terms-Conditions-ec060cb6c06e49a98f17d235d0835773"
          newPage
        />
        <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
          and
        </Typography>
        <TextLink
          size="small"
          text="Privacy Policy"
          color="primary"
          href="https://talentprotocol.notion.site/Privacy-Policy-cc2b297006b54b3db1a008592302ccf5"
          newPage
        />
      </PrivacyPolicyStatementContainer>
    </Container>
  );
};
