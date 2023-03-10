import styled from "styled-components";
import { buildColor } from "@talentprotocol/design-system";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

export const ActionArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid ${buildColor("surfaceHover01")};
`;
