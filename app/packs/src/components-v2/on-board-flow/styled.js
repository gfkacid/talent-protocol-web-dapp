import { buildColor } from "@talentprotocol/design-system";
import { mobileStyles } from "@talentprotocol/design-system/breakpoints";
import { desktopStyles } from "@talentprotocol/design-system/breakpoints";
import styled, { css } from "styled-components";

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ImageContainer = styled.div`
  width: 100%;
  background-color: ${buildColor("primary")};
  padding: 24px 16px;

  ${mobileStyles(css`
    padding: 24px 0;
  `)}
`;

export const StyledImage = styled.img`
  width: 100%;
  object-fit: cover;
`;

export const InfoContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;

  ${desktopStyles(css`
    text-align: center;
  `)}
`;

export const ActionContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  gap: 8px;
`;

export const SliderSelectorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`;
