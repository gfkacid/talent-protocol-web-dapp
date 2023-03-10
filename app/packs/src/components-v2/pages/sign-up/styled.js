import { buildColor } from "@talentprotocol/design-system";
import styled from "styled-components";

export const Container = styled.main`
  height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  position: relative;
`;

export const DesktopSimpleInnerContainer = styled.div`
  max-height: 640px;
  max-width: 456px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
