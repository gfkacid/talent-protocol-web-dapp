import React, { useState } from "react";
import { H3, P1, Caption } from "src/components/design_system/typography";
import Button from "src/components/design_system/button";
import ApplyToLaunchTokenModal from "src/components/design_system/modals/ApplyToLaunchTokenModal";
import { TALENT_PROTOCOL_DISCORD } from "src/utils/constants";

const TalentTokenApplicationBanner = ({ userId, userUsername }) => {
  const [showApplyToLaunchTokenModal, setShowApplyToLaunchTokenModal] = useState(false);

  return (
    <>
      <div className="talent-background launch-token-banner-background">
        <div className="talent-background-text permanent-text-white">
          <div className="col-1"></div>
          <div style={{ width: "450px" }}>
            <Caption className="mb-2 text-yellow" text="TALENT TOKEN APPLICATION" bold />
            <H3 className="pb-4" text="Launch your own token and create your on-chain resume." bold />
            <Button
              type="primary-default"
              size="extra-big"
              onClick={() => setShowApplyToLaunchTokenModal(true)}
              text="Apply Now"
            />
          </div>
        </div>
      </div>
      <ApplyToLaunchTokenModal
        show={showApplyToLaunchTokenModal}
        hide={() => setShowApplyToLaunchTokenModal(false)}
        userId={userId}
        username={userUsername}
      />
    </>
  );
};

const ConnectWalletBanner = () => (
  <div className="talent-background connect-wallet-banner-background">
    <div className="talent-background-text permanent-text-white">
      <div className="col-1"></div>
      <div style={{ width: "450px" }}>
        <Caption className="mb-2 text-yellow" text="WELCOME TO TALENT PROTOCOL" bold />
        <H3 className="pb-4" text="Connect a wallet to unlock your first community NFT." bold />
        <a className="button-link" href={"/quests/user"}>
          <Button type="primary-default" size="extra-big" onClick={() => null} text="Connect Wallet" />
        </a>
      </div>
    </div>
  </div>
);

const JoinCommunityBanner = () => (
  <div className="talent-background join-community-banner-background">
    <div className="talent-background-text permanent-text-white">
      <div className="col-1"></div>
      <div style={{ width: "450px" }}>
        <Caption className="mb-2 text-primary" text="A COMMUNITY OF TALENT" bold />
        <H3
          className="pb-4 permanent-text-black"
          text="Join our Discord server and access exclusive community channels."
          bold
        />
        <a className="button-link" href={TALENT_PROTOCOL_DISCORD} target="_blank">
          <Button type="primary-default" size="extra-big" onClick={() => null} text="Join Community" />
        </a>
      </div>
    </div>
  </div>
);

const LaunchMyTokenBanner = ({ username }) => (
  <div className="talent-background launch-my-token-banner-background">
    <div className="talent-background-text permanent-text-white">
      <div className="col-1"></div>
      <div style={{ width: "450px" }}>
        <Caption className="mb-2 text-yellow" text="LET'S DO THIS!" bold />
        <H3 className="pb-4" text="Launch a Talent Token and win $200 in tokens." bold />
        <a className="button-link" href={`/u/${username}#token`}>
          <Button type="primary-default" size="extra-big" onClick={() => null} text="Launch my token" />
        </a>
      </div>
    </div>
  </div>
);

const InviteTalentBanner = () => (
  <div className="talent-background invite-talent-banner-background">
    <div className="talent-background-text permanent-text-white">
      <div className="col-1"></div>
      <div style={{ width: "450px" }}>
        <Caption className="mb-2 text-primary" text="SCOUT-TO-EARN" bold />
        <H3
          className="pb-4 permanent-text-black"
          text="Invite your high-potential friends to join Talent Protocol and earn TAL."
          bold
        />
        <a className="button-link" href="/earn?tab=talent">
          <Button type="primary-default" size="extra-big" onClick={() => null} text="Invite Talent" />
        </a>
      </div>
    </div>
  </div>
);

const VerifiyUserBanner = ({ username }) => (
  <div className="talent-background verify-user-banner-background">
    <div className="talent-background-text">
      <div className="col-1"></div>
      <div style={{ width: "450px" }}>
        <H3 className="pb-2 text-marketing-light-yellow" text="Verified Badge." bold />
        <P1
          className="pb-4 text-marketing-light-yellow"
          text="By verifying your identity, you can increase your profile strength and unlock your Talent Mate!"
        />
        <a className="button-link" href={`/u/${username}`}>
          <Button type="white-default" size="big" onClick={() => null} text="Verify your identity" />
        </a>
      </div>
    </div>
  </div>
);

const DiscoveryBanners = ({ user }) => {
  const currentBanner = () => {
    if (!user?.wallet_address) {
      return <ConnectWalletBanner />;
    } else if (!user.verified) {
      return <VerifiyUserBanner username={user?.username} />;
    } else if (user?.profile_type === "approved") {
      return <LaunchMyTokenBanner username={user?.username} />;
    } else if (user.profile_type == "talent" && user?.token_launched) {
      return <InviteTalentBanner />;
    } else if (user.active_supporter) {
      return <JoinCommunityBanner />;
    } else if (user.wallet_address) {
      return <TalentTokenApplicationBanner userId={user?.id} userUsername={user?.username} />;
    }
  };

  return <div className="banners">{currentBanner()}</div>;
};

export default DiscoveryBanners;
