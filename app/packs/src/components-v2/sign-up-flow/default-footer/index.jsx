import React from "react";
import { Button } from "@talentprotocol/design-system";
import { ActionArea } from "./styled";

export const DefaultFooter = ({ previousStep, nextStep, isNextDisabled }) => (
  <ActionArea>
    <Button size="small" hierarchy="tertiary" text="Back" onClick={previousStep} />
    <Button size="small" hierarchy="primary" text="Next" onClick={nextStep} isDisabled={isNextDisabled} />
  </ActionArea>
);
