import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";

import { patch } from "src/utils/requests";
import { OnChain } from "src/onchain";
import { chainNameToId } from "src/onchain/utils";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import Button from "src/components/design_system/button";
import TokenDetails from "src/components/talent/Show/TokenDetails";
import Caption from "src/components/design_system/typography/caption";
import ParagraphLink from "src/components/design_system/link/ParagraphLink";
import { ArrowRight, ArrowLeft } from "src/components/icons";

import LaunchTokenModals from "./LaunchTokenModals";

const Token = (props) => {
  const {
    mode,
    token,
    talent,
    user,
    railsContext,
    mobile,
    changeTab,
    changeSharedState,
    requiredFields,
  } = props;
  if (user.profile_type !== "approved" && user.profile_type !== "talent") {
    window.location.href = "edit_profile";
    return;
  }

  const [ticker, setTicker] = useState(token.ticker || "");
  const [show, setShow] = useState(false);
  const [error, setError] = useState({});
  const [contractId, setContractId] = useState(token.contract_id || "");

  const changeTicker = (value) => {
    if (error["length"]) {
      setError((prev) => ({ ...prev, length: false }));
    }
    if (error["characters"]) {
      setError((prev) => ({ ...prev, characters: false }));
    }
    if (error["tickerTaken"]) {
      setError((prev) => ({ ...prev, tickerTaken: false }));
    }

    setTicker(value.toUpperCase());
  };

  if (contractId && !show) {
    return (
      <>
        <H5 className="w-100 text-left" text={ticker} bold />
        <P2 className="w-100 text-left" mode={mode}>
          You can see all your token activity on your{" "}
          <ParagraphLink text="portfolio" href="/portfolio" target="_blank" />
        </P2>
        <TokenDetails
          ticker={token.ticker}
          token={{ ...token, contract_id: contractId }}
          displayName={user.display_name || user.username}
          username={user.username}
          railsContext={railsContext}
          chainId={token.chain_id}
          mobile={mobile}
          className="w-100 mb-4"
        />
        {mobile && (
          <div className="d-flex flex-row justify-content-between w-100 mt-4 mb-3">
            <div className="d-flex flex-column">
              <Caption text="PREVIOUS" />
              <div
                className="text-grey cursor-pointer"
                onClick={() => changeTab("Goal")}
              >
                <ArrowLeft color="currentColor" /> Goal
              </div>
            </div>
            <div className="d-flex flex-column">
              <Caption text="NEXT" />
              <div
                className="text-grey cursor-pointer"
                onClick={() => changeTab("Perks")}
              >
                Perks <ArrowRight color="currentColor" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const readyForLaunch = () =>
    requiredFields.length == 0 ||
    (requiredFields.length == 1 && requiredFields[0] == "Ticker");

  return (
    <>
      {show && (
        <LaunchTokenModals
          show={show}
          setShow={setShow}
          changeSharedState={changeSharedState}
          mode={mode}
          token={token}
          user={user}
          talent={talent}
          railsContext={railsContext}
          setContractId={setContractId}
          ticker={ticker}
          changeTicker={changeTicker}
        />
      )}
      <H5
        className="w-100 text-left"
        mode={mode}
        text="Launch your Talent Token today!"
        bold
      />
      <div className="d-flex flex-row w-100 justify-content-between mt-2">
        <div className="col-8 d-flex flex-column p-0">
          <P2 className="p2 w-100 text-left p-0" mode={mode}>
            We recommend using Metamask to deploy your token although other
            wallets are also supported. If you don't have a metamask wallet you
            can create it using{" "}
            <a href="https://www.metamask.io" target="_blank">
              Metamask.io
            </a>
          </P2>
          {!readyForLaunch() && (
            <P2>
              You must further complete your profile before you can launch your
              token.
            </P2>
          )}
        </div>
        <div>
          <Button
            onClick={() => setShow(true)}
            type="primary-default"
            mode={mode}
            disabled={!readyForLaunch()}
          >
            Launch Talent Token
          </Button>
        </div>
      </div>
      <div className={`divider ${mode} my-3`}></div>
      <TextInput
        title={"Ticker Name"}
        mode={mode}
        placeholder={"3 to 8 characters"}
        shortCaption={
          "Your ticker name will be visible next to your display name. You need to launch your talent token to enable buying your token."
        }
        onChange={(e) => changeTicker(e.target.value)}
        value={ticker || ""}
        className="w-100 mt-3"
        maxLength={8}
        maxLengthText
      />
      {error["ticker"] && (
        <P2 className="text-danger">
          The ticker you've chosen is already taken. We currently only allow one
          user to have a given ticker across the blockchains that we support.
        </P2>
      )}
      {mobile && (
        <div className="d-flex flex-row justify-content-between w-100 my-3">
          <div className="d-flex flex-column">
            <Caption text="PREVIOUS" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Goal")}
            >
              <ArrowLeft color="currentColor" /> Goal
            </div>
          </div>
          <div className="d-flex flex-column">
            <Caption text="NEXT" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Perks")}
            >
              Perks <ArrowRight color="currentColor" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Token;
