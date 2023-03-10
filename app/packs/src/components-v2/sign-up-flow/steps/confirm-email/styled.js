import { desktopStyles } from "@talentprotocol/design-system/breakpoints";
import styled, { css } from "styled-components";

export const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  text-align: center;
  gap: 8px;

  ${desktopStyles(css`
    width: 100%;
  `)}

  svg {
    margin-bottom: 16px;
  }

  button {
    margin-top: 16px;
  }
`;
