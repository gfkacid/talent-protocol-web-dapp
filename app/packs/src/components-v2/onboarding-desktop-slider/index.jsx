import { Icon } from "@talentprotocol/design-system";
import React from "react";
import { OnBoardFlow } from "../on-board-flow";
import { OnboardingContainer, OnboardingInnerContainer } from "./styled";

export const OnboardingDesktopSlider = () => {
  return (
    <>
      <Icon name="logo-light" />
      <OnboardingContainer>
        <OnboardingInnerContainer>
          <OnBoardFlow isDesktop />
        </OnboardingInnerContainer>
      </OnboardingContainer>
    </>
  );
};
