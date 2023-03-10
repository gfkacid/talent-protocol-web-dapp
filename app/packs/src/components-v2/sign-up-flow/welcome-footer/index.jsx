import React from "react";
import { TextLink, Typography } from "@talentprotocol/design-system";
import { FirstStepActionArea } from "./styled";

export const WelcomeFooter = () => (
  <FirstStepActionArea>
    <Typography specs={{ variant: "label2", type: "medium" }} color="primary01">
      I already have an account.
    </Typography>
    <TextLink size="small" text="Login" color="primary" href="/" />
  </FirstStepActionArea>
);
