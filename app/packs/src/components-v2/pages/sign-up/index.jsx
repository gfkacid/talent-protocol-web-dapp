import React, { useMemo } from "react";
import { TalentThemeProvider } from "@talentprotocol/design-system";
import {
  Container,
  DesktopColoredContainer,
  DesktopInnerContainer,
  DesktopSimpleContainer,
  DesktopSimpleInnerContainer
} from "./styled";
import { SignUpFlow } from "../../sign-up-flow";
import { useWindowDimensionsHook } from "../../../utils/window";
import { OnboardingDesktopSlider } from "../../onboarding-desktop-slider";

export const SignUpPage = props => {
  const { mobile } = useWindowDimensionsHook(false);
  const pageContent = useMemo(() => {
    if (mobile) return <SignUpFlow {...props} />;
    return (
      <DesktopInnerContainer>
        <DesktopColoredContainer>
          <OnboardingDesktopSlider />
        </DesktopColoredContainer>
        <DesktopSimpleContainer>
          <DesktopSimpleInnerContainer>
            <SignUpFlow {...props} isDesktop />
          </DesktopSimpleInnerContainer>
        </DesktopSimpleContainer>
      </DesktopInnerContainer>
    );
  }, [mobile, props]);
  return (
    <TalentThemeProvider>
      <style>
        {`
          #helpkit-launcherButton--talentprotocol {
            display: none;
          }
        `}
      </style>
      <Container>{pageContent}</Container>
    </TalentThemeProvider>
  );
};
