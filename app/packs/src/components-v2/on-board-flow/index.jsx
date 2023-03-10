import React, { useEffect, useMemo } from "react";
import { Typography, Button, SliderSelector, useSliderSelector } from "@talentprotocol/design-system";
import firstImage from "./assets/01.svg";
import secondImage from "./assets/02.svg";
import thirdImage from "./assets/03.svg";
import fourthImage from "./assets/04.svg";
import firstDesktopImage from "./assets/01-desktop.svg";
import secondDesktopImage from "./assets/02-desktop.svg";
import thirdDesktopImage from "./assets/03-desktop.svg";
import fourthDesktopImage from "./assets/04-desktop.svg";
import {
  Container,
  ImageContainer,
  StyledImage,
  InfoContainer,
  ActionContainer,
  SliderSelectorContainer
} from "./styled";

const SLIDER_TIMER = 8000;

const SLIDER_CONTENT = [
  {
    title: "Build your web3 resume.",
    description:
      "A professional profile made for builders and designed for the future of work. Combine on-chain and off-chain credentials. Add career goals to your timeline, not just past jobs and schools.",
    image: {
      true: firstDesktopImage,
      false: firstImage
    }
  },
  {
    title: "Support the people you believe in.",
    description:
      "Transform loose connections into meaningful connections. Discover inspiring talent to support, contribute to their professional journey, and unlock perks and rewards as they grow.",
    image: {
      true: secondDesktopImage,
      false: secondImage
    }
  },
  {
    title: "Launch your own token.",
    description:
      "Let people invest in your potential. Build a personal board of advisors, truly vested in your career. The support network you need to succeed.",
    image: {
      true: thirdDesktopImage,
      false: thirdImage
    }
  },
  {
    title: "Success is collective.",
    description:
      "Talent Protocol is an open-source project on a mission to help the next generation of builders achieve success and fulfilment. Unlock access to scholarships, work opportunities, and more.",
    image: {
      true: fourthDesktopImage,
      false: fourthImage
    }
  }
];

export const OnBoardFlow = ({ isDesktop = false, nextStep }) => {
  const sliderState = useSliderSelector(SLIDER_CONTENT.length);
  const ActionAreaFooter = useMemo(() => {
    if (isDesktop) return <></>;
    return sliderState.selectedElement < SLIDER_CONTENT.length - 1 ? (
      <>
        <Button hierarchy="primary" size="large" text="Next" isStretched onClick={sliderState.jumpElement} />
        <Button hierarchy="tertiary" size="large" text="I already have an account" isStretched href="/ " />
      </>
    ) : (
      <Button hierarchy="primary" size="large" text="Join the community" onClick={nextStep} isStretched />
    );
  }, [isDesktop, sliderState.jumpElement]);
  useEffect(() => {
    let sliderIntervalId;
    if (isDesktop) {
      sliderIntervalId = setInterval(() => {
        sliderState.jumpElement();
      }, SLIDER_TIMER);
    }
    return () => {
      if (sliderIntervalId) {
        clearInterval(sliderIntervalId);
      }
    };
  }, [isDesktop, sliderState]);
  return (
    <Container>
      <ImageContainer>
        {!isDesktop && (
          <SliderSelectorContainer>
            <SliderSelector
              size={SLIDER_CONTENT.length}
              onClick={sliderState.selectElement}
              selectElement={sliderState.selectElement}
              selectedIndex={sliderState.selectedElement}
              variant="secondary"
            />
          </SliderSelectorContainer>
        )}
        <StyledImage src={SLIDER_CONTENT[sliderState.selectedElement].image[isDesktop]} alt="banner" />
      </ImageContainer>
      <InfoContainer>
        <Typography specs={{ variant: "h3", type: "bold" }} color={isDesktop ? "bg01" : "primary01"}>
          {SLIDER_CONTENT[sliderState.selectedElement].title}
        </Typography>
        <Typography specs={{ variant: "p2", type: "regular" }} color={isDesktop ? "bg01" : "primary03"}>
          {SLIDER_CONTENT[sliderState.selectedElement].description}
        </Typography>
      </InfoContainer>
      <ActionContainer>
        {isDesktop && (
          <SliderSelectorContainer>
            <SliderSelector
              size={SLIDER_CONTENT.length}
              onClick={sliderState.selectElement}
              selectElement={sliderState.selectElement}
              selectedIndex={sliderState.selectedElement}
              variant="secondary"
            />
          </SliderSelectorContainer>
        )}
        {ActionAreaFooter}
      </ActionContainer>
    </Container>
  );
};
