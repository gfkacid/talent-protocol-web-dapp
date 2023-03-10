import React, { useEffect, useMemo, useState } from "react";
import { Modal, Typography, useModal } from "@talentprotocol/design-system";
import { useStepExperience } from "../../hooks/use-step-experience";
import { EmailPasswordStep } from "./steps/email-password";
import { WelcomeStep } from "./steps/welcome";
import { LegalNameStep } from "./steps/legal-name";
import { HandleStep } from "./steps/handle";
import { DefineStep } from "./steps/define";
import { OccupationStep } from "./steps/occupation";
import { LookingForStep } from "./steps/looking-for";
import { IntroductionStep } from "./steps/introduction";
import { ConfirmEmailStep } from "./steps/confirm-email";
import { useUserBuilder } from "./hooks/use-user-builder";
import { WelcomeFooter } from "./welcome-footer";
import { DefaultFooter } from "./default-footer";
import { ActionContainer, Container, StepContainer, StepCounterContainer } from "./styled";
import { EmailFooter } from "./email-footer";
import { Captcha } from "./steps/captcha";
import { OnBoardFlow } from "../on-board-flow";

const STEP_TO_COMPONENT_MAP = isDesktop =>
  isDesktop
    ? {
        1: WelcomeStep,
        2: EmailPasswordStep,
        3: LegalNameStep,
        4: HandleStep,
        5: DefineStep,
        6: OccupationStep,
        7: LookingForStep,
        8: IntroductionStep,
        9: ConfirmEmailStep
      }
    : {
        1: OnBoardFlow,
        2: WelcomeStep,
        3: EmailPasswordStep,
        4: LegalNameStep,
        5: HandleStep,
        6: DefineStep,
        7: OccupationStep,
        8: LookingForStep,
        9: IntroductionStep,
        10: ConfirmEmailStep
      };

export const SignUpFlow = props => {
  const captchaModalState = useModal();
  const { linkedinClientId, linkedinRedirectUri } = props;
  const [isNextDisabled, setIsNextDisable] = useState(true);
  const [hasCreateAccountError, setHasCreateAccountError] = useState(false);
  const [createdUser, setCreatedUser] = useState({});
  const userBuilderState = useUserBuilder();
  useEffect(() => {
    if (userBuilderState.user.code === props.code) return;
    userBuilderState.setUser({
      ...userBuilderState.user,
      code: props.code
    });
  }, [props.code, userBuilderState]);
  const stepsState = useStepExperience(Object.keys(STEP_TO_COMPONENT_MAP(props.isDesktop)).length);
  const StepScreen = useMemo(
    () => STEP_TO_COMPONENT_MAP(props.isDesktop)[stepsState.currentStep],
    [stepsState.currentStep]
  );
  useEffect(() => {
    setIsNextDisable(true);
  }, [setIsNextDisable, stepsState.currentStep]);
  const MemoizedStep = useMemo(
    () => (
      <StepScreen
        openCaptchaModal={captchaModalState.openModal}
        nextStep={stepsState.nextStep}
        setIsNextDisable={setIsNextDisable}
        user={userBuilderState.user}
        setUser={userBuilderState.setUser}
        linkedinClientId={linkedinClientId}
        linkedinRedirectUri={linkedinRedirectUri}
        setHasCreateAccountError={setHasCreateAccountError}
        setCreatedUser={setCreatedUser}
        inviteProps={{
          name: props.name,
          profilePictureUrl: props.profilePictureUrl,
          inviteCode: props.inviteCode
        }}
        goToFirstStep={() => stepsState.jumpToStep(props.isDesktop ? 2 : 3)}
      />
    ),
    [
      captchaModalState,
      stepsState,
      setIsNextDisable,
      useUserBuilder,
      linkedinClientId,
      linkedinRedirectUri,
      props.name,
      props.profilePictureUrl,
      props.inviteCode,
      props.isDesktop
    ]
  );
  const MemoizedDefaultFooter = useMemo(
    () => (
      <DefaultFooter
        previousStep={stepsState.previousStep}
        nextStep={stepsState.nextStep}
        isNextDisabled={isNextDisabled}
      />
    ),
    [stepsState, isNextDisabled]
  );
  const MemoizedActionArea = useMemo(() => {
    switch (stepsState.currentStep) {
      case 1:
        return !props.isDesktop ? <></> : <WelcomeFooter />;
      case 2:
        return !props.isDesktop ? <WelcomeFooter /> : MemoizedDefaultFooter;
      case 9:
        return !props.isDesktop ? MemoizedDefaultFooter : <EmailFooter hasCreateAccountError={hasCreateAccountError} createdUser={createdUser} />;
      case 10:
        return <EmailFooter hasCreateAccountError={hasCreateAccountError} createdUser={createdUser} />;
      default:
        return MemoizedDefaultFooter;
    }
  }, [stepsState.currentStep, isNextDisabled, props.isDesktop, hasCreateAccountError]);
  return (
    <>
      <Modal title="Captcha" isOpen={captchaModalState.isOpen} closeModal={captchaModalState.closeModal}>
        <Captcha
          captchaKey={props.captchaKey}
          nextStep={stepsState.nextStep}
          user={userBuilderState.user}
          setUser={userBuilderState.setUser}
          closeModal={captchaModalState.closeModal}
        />
      </Modal>
      <Container>
        {(!props.isDesktop && stepsState.currentStep === 1) ||
        stepsState.currentStep === 10 ||
        (props.isDesktop && stepsState.currentStep === 9) ? (
          <></>
        ) : (
          <StepCounterContainer>
            <Typography specs={{ variant: "p2", type: "medium" }} color="primary01">
              Step {!props.isDesktop ? stepsState.currentStep - 1 : stepsState.currentStep}
            </Typography>
            <Typography specs={{ variant: "p2", type: "medium" }} color="primary03">
              /
            </Typography>
            <Typography specs={{ variant: "p2", type: "medium" }} color="primary04">
              9
            </Typography>
          </StepCounterContainer>
        )}
        {stepsState.currentStep === 1 || stepsState.currentStep === 10 ? (
          MemoizedStep
        ) : (
          <StepContainer>{MemoizedStep}</StepContainer>
        )}
      </Container>
      <ActionContainer>{MemoizedActionArea}</ActionContainer>
    </>
  );
};
