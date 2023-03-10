
import styled, { css } from "styled-components";
import { buildColor } from "@talentprotocol/design-system";
import { mobileStyles } from "@talentprotocol/design-system/breakpoints";

export const FirstStepActionArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 16px;

  ${mobileStyles(css`
    border-top: 1px solid ${buildColor("surfaceHover01")};
  `)}
`;
