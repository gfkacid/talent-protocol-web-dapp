import React from "react";
import { TalentThemeProvider } from "@talentprotocol/design-system";
import { OnBoardFlow } from "../../on-board-flow";
import { Container } from "./styled";

export const OnBoardPage = () => {
  return (
    <TalentThemeProvider>
      <Container>
        <OnBoardFlow />
      </Container>
    </TalentThemeProvider>
  );
};
