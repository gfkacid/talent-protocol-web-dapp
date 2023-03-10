import styled, { css } from "styled-components";
import { buildColor } from "@talentprotocol/design-system";
import { mobileStyles } from "@talentprotocol/design-system/breakpoints";
import { desktopStyles } from "@talentprotocol/design-system/breakpoints";

export const ActionArea = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 16px;

  ${mobileStyles(css`
    border-top: 1px solid ${buildColor("surfaceHover01")};
  `)}

  ${desktopStyles(css`
    max-width: 456px;
    margin: 0 auto;
  `)}
`;