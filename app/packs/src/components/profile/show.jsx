import React, { useEffect, useState } from "react";
import Divider from "src/components/design_system/other/Divider";
import { loggedInUserStore } from "src/contexts/state";

import ThemeContainer from "src/contexts/ThemeContext";
import { camelCaseObject } from "src/utils/transformObjects";
import { useWindowDimensionsHook } from "src/utils/window";
import Button from "src/components/design_system/button";

import Poaps from "./web3/poaps";
import Nfts from "./web3/nfts";
import Tokens from "./web3/tokens";
import Overview from "./overview";
import About from "./About";
import Journey from "./Journey";
import Community from "./Community";
import Token from "./Token";
import LaunchToken from "./LaunchToken";
import ApplyToLaunchToken from "./ApplyToLaunchToken";
import Perks from "./Perks";
import SocialGraph from "./social_graph/SocialGraph";

const Show = ({ talent, railsContext, withPersonaRequest, profileSubdomain }) => {
  const [localTalent, setLocalTalent] = useState(camelCaseObject(talent));
  const user = localTalent.user;
  const talentToken = localTalent.talentToken;
  const [selectedSection, setSelectedSection] = useState(window.location.hash);
  const [showLastDivider, setShowLastDivider] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const talentTokenPrice = 0.1;

  const { currentUser, fetchCurrentUser } = loggedInUserStore();
  const canUpdate = talent.user.uuid == currentUser?.id && !previewMode;

  const { mobile } = useWindowDimensionsHook();

  useEffect(() => {
    if (!currentUser) {
      fetchCurrentUser();
    }
  }, []);

  const changeSection = newSection => {
    setSelectedSection(newSection);
  };

  const buttonType = section => {
    if (section == selectedSection) {
      return "white-default";
    } else if (!selectedSection && section == "#about") {
      return "white-default";
    } else {
      return "white-ghost";
    }
  };

  useEffect(() => {
    if (selectedSection) {
      const scrollDiv = document.getElementById(selectedSection).offsetTop;
      window.scrollTo({ top: scrollDiv - 70, behavior: "smooth" });
      window.history.replaceState({}, document.title, `${localTalent.user.username}${selectedSection}`);
    }
  }, [selectedSection]);

  const onWalletConnect = account => {
    setLocalTalent(prev => ({
      ...prev,
      user: {
        ...prev.user,
        walletId: account
      }
    }));
  };

  const getCurrentTokenSection = () => {
    if ((user.profileType == "approved" || user.profileType == "talent") && !talentToken.contractId) {
      return LaunchToken;
    }

    if (user.profileType != "approved" && user.profileType != "talent") {
      return ApplyToLaunchToken;
    }

    return Token;
  };

  const CurrentTokenSection = getCurrentTokenSection();

  return (
    <div className="d-flex flex-column lg-h-100 p-0">
      <Overview
        className="mb-2"
        talent={localTalent}
        setTalent={setLocalTalent}
        currentUserId={currentUser?.id}
        currentUserAdmin={currentUser?.admin}
        currentUserModerator={currentUser?.moderator}
        railsContext={railsContext}
        changeSection={changeSection}
        talentTokenPrice={talentTokenPrice}
        canUpdate={canUpdate}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        isCurrentUserImpersonated={currentUser?.impersonated}
        withPersonaRequest={withPersonaRequest}
        profileSubdomain={profileSubdomain}
      />
      <Divider className="my-6" />
      <div className="d-flex justify-content-lg-center overflow-x-scroll mx-4">
        <Button className="mr-2" type={buttonType("#about")} text="About" onClick={() => changeSection("#about")} />
        <Button
          className="mr-2"
          type={buttonType("#journey")}
          text="Journey"
          onClick={() => changeSection("#journey")}
        />
        {(talentToken.contractId || canUpdate) && (
          <Button
            className="mr-2"
            type={buttonType("#token")}
            text={talentToken.ticker ? `$${talentToken.ticker}` : "Token"}
            onClick={() => changeSection("#token")}
          />
        )}
        <Button
          className="mr-2"
          type={buttonType("#community")}
          text="Community"
          onClick={() => changeSection("#community")}
        />
        {((user.walletId && user.visibleDigitalCollectibles) || canUpdate) && (
          <Button
            type={buttonType("#digital-collectibles")}
            text={"Digital Collectibles"}
            onClick={() => changeSection("#digital-collectibles")}
          />
        )}
      </div>
      <div className="my-7 w-100 col-12" id="#about">
        <About talent={localTalent} setTalent={setLocalTalent} canUpdate={canUpdate} previewMode={previewMode} />
      </div>
      {mobile && <Divider />}
      <div className="my-7 w-100 col-12" id="#journey">
        <Journey talent={localTalent} setTalent={setLocalTalent} canUpdate={canUpdate} />
      </div>
      <div className="my-7 w-100" id={"#token"}>
        {talentToken.contractId && <Perks talent={localTalent} canUpdate={canUpdate} />}
        <CurrentTokenSection
          talent={localTalent}
          talentTokenPrice={talentTokenPrice}
          setLocalTalent={setLocalTalent}
          railsContext={railsContext}
          waitingApproval={user.profileType == "waiting_for_approval"}
          canUpdate={canUpdate}
        />
      </div>
      <div className="my-7 w-100 col-12" id="#community">
        <Community userId={localTalent.user.uuid} talent={localTalent} canUpdate={canUpdate} />
      </div>
      {currentUser?.admin && (
        <div className="my-7 w-100 col-12" id="#social-graph">
          <div className="social-graph">
            <SocialGraph talent={localTalent} />
          </div>
        </div>
      )}
      {(showLastDivider || canUpdate) && <Divider className="my-6" />}
      <div className="mt-7 w-100" id="#digital-collectibles">
        <Poaps
          user={localTalent.user}
          canUpdate={canUpdate}
          setShowLastDivider={setShowLastDivider}
          setTalent={setLocalTalent}
          railsContext={railsContext}
          onWalletConnect={onWalletConnect}
        />
        <Nfts
          user={localTalent.user}
          canUpdate={canUpdate}
          setShowLastDivider={setShowLastDivider}
          setTalent={setLocalTalent}
          railsContext={railsContext}
          onWalletConnect={onWalletConnect}
        />
        <Tokens
          user={localTalent.user}
          canUpdate={canUpdate}
          setShowLastDivider={setShowLastDivider}
          setTalent={setLocalTalent}
          railsContext={railsContext}
          onWalletConnect={onWalletConnect}
        />
      </div>
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer>
      <Show {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};
