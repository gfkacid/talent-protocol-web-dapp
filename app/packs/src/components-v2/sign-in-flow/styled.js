import { buildColor } from "@talentprotocol/design-system";
import styled from "styled-components";

export const Container = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
`;

export const SignInFormContainer = styled.form`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const EmailBox = styled.div``;

export const PasswordBox = styled.div`
  margin-top: 14px;
`;

export const PasswordLabelRow = styled.div`
  display: flex;

  p {
    flex-grow: 1;
  }
`;

export const ActionContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
`;

export const Divider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const DividerLine = styled.div`
  flex-grow: 1;
  height: 1px;
  background: ${buildColor("surfaceHover02")};
`;

export const NoAccountContainer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;
