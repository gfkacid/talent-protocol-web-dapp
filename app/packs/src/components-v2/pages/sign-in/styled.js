import { buildColor } from "@talentprotocol/design-system";
import styled from "styled-components";

export const Container = styled.main`
  height: 100vh;
  padding: 0;
  margin: 0;
`;

export const DesktopInnerContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  padding: 16px;
`;

export const DesktopColoredContainer = styled.div`
  flex-basis: 50%;
  background: ${buildColor("primary")};
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  padding: 48px;
`;

export const DesktopSimpleContainer = styled.div`
  flex-basis: 50%;
  border-radius: 24px;
  padding: 48px;
`;

export const DesktopSimpleInnerContainer = styled.div`
  height: 100%;
  max-width: 456px;
  display: flex;
  align-items: center;
  margin: auto;

  section {
    width: 100%;
    max-height: 540px;
  }
`;
