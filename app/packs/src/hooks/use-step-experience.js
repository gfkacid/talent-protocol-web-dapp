import { useCallback, useState } from "react";

export const useStepExperience = size => {
  const [currentStep, setCurrentStep] = useState(1);
  const jumpToStep = useCallback(
    stepToJumpTo => {
      if (stepToJumpTo < 1 || stepToJumpTo > size) {
        console.error("Can't jump to an unexistent index");
        return;
      }
      setCurrentStep(stepToJumpTo);
    },
    [setCurrentStep]
  );
  const nextStep = useCallback(() => {
    if (currentStep === size) {
      console.error("There are no more steps to jump to");
      return;
    }
    setCurrentStep(currentStep + 1);
  }, [currentStep, setCurrentStep]);
  const previousStep = useCallback(() => {
    if (!currentStep) {
      console.error("Already in the first step");
      return;
    }
    setCurrentStep(currentStep - 1);
  }, [currentStep, setCurrentStep]);
  return {
    currentStep,
    jumpToStep,
    nextStep,
    previousStep
  };
};
