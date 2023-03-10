import { TextArea, Typography } from "@talentprotocol/design-system";
import React, { useCallback, useState } from "react";
import { Row, Form, TitleRow, WordCounterContainer } from "./styled";

const MAX_CHARACTERS = 70;

export const IntroductionStep = ({ user, setUser, setIsNextDisable }) => {
  const [headline, setHeadline] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [] = useState("");
  const onChangeCallback = useCallback(
    e => {
      setHeadline(e.target.value);
    },
    [setHeadline]
  );
  const validateStep = useCallback(() => {
    setIsFirstRender(false);
    if (headline && headline.length <= MAX_CHARACTERS) {
      setUser({
        ...user,
        headline
      });
      setIsNextDisable(false);
    } else {
      setIsNextDisable(true);
    }
  }, [user, setUser, setIsNextDisable, headline, setIsFirstRender]);
  return (
    <>
      <TitleRow>
        <Typography specs={{ variant: "h3", type: "bold" }} color="primary01">
          Introduce yourself in 70 characters or less.
        </Typography>
        <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
          What’s the headline of your career? You can edit this later.
        </Typography>
      </TitleRow>
      <Form>
        <WordCounterContainer>
          <Typography specs={{ variant: "p3", type: "bold" }} color="primary01">
            {headline.length}/{MAX_CHARACTERS}
          </Typography>
        </WordCounterContainer>
        <Row>
          <TextArea
            placeholder="Headline suggestion here"
            defaultValue={user.headline}
            hasError={(!isFirstRender && !headline) || headline.length > MAX_CHARACTERS}
            shortDescription={headline.length > MAX_CHARACTERS ? "Max characters reached" : ""}
            onChange={e => {
              onChangeCallback(e);
              validateStep();
            }}
            onBlur={validateStep}
          />
        </Row>
      </Form>
    </>
  );
};
