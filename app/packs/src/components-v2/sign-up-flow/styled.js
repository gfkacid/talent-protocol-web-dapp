import { mobileStyles } from "@talentprotocol/design-system/breakpoints";
import { desktopStyles } from "@talentprotocol/design-system/breakpoints";
import styled, { css } from "styled-components";

export const Container = styled.section`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StepContainer = styled.div`
  ${mobileStyles(css`
    padding: 0 16px;
  `)}
`;

export const StepCounterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 24px 16px 0;

  ${desktopStyles(css`
    padding: 0;
  `)}
`;

export const ActionContainer = styled.div`
  ${desktopStyles(css`
    width: 100%;
    position: absolute;
    bottom: 0;
    right: 0;
  `)};
`;
