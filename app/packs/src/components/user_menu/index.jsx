import React, { useState, useEffect, useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import TalentProfilePicture from "../talent/TalentProfilePicture";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MetamaskConnect from "../login/MetamaskConnect";
import { destroy } from "../../utils/requests";
import EditInvestorProfilePicture from "./EditInvestorProfilePicture";

import { OnChain } from "src/onchain";

import transakSDK from "@transak/transak-sdk";
import { useWindowDimensionsHook } from "src/utils/window";

const newTransak = (width, height) =>
  new transakSDK({
    apiKey: "d8921427-8447-4523-9333-f062f738026f", // Your API Key
    environment: "STAGING", // STAGING/PRODUCTION
    defaultCryptoCurrency: "CUSD",
    fiatCurrency: "EUR",
    defaultPaymentMethod: "credit_debit_card",
    themeColor: "000000",
    hostURL: window.location.origin,
    widgetHeight: `${height}px`,
    widgetWidth: `${width}px`,
    network: "CELO",
    cryptoCurrencyList: "CUSD",
  });

const UserMenu = ({ user, signOutPath }) => {
  const [show, setShow] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [stableBalance, setStableBalance] = useState(0);
  const [account, setAccount] = useState("");
  const { height, width } = useWindowDimensionsHook();

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(user.walletId);
  };

  const onClickTransak = (e) => {
    e.preventDefault();

    const _width = width > 700 ? 700 : width;
    const _height = height > 450 ? 450 : height;

    const transak = newTransak(_width, _height);
    transak.init();

    // To get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
      console.log(data);
    });

    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      transak.close();
    });
  };

  const signOut = () => {
    destroy(signOutPath).then(() => {
      window.location.replace("/");
    });
  };

  const setupChain = useCallback(async () => {
    const onChain = new OnChain();

    const account = await onChain.connectedAccount();

    if (account) {
      setAccount(account.toLowerCase());
      setWalletConnected(true);

      await onChain.loadStableToken();
      const balance = await onChain.getStableBalance(true);

      if (balance) {
        setStableBalance(balance);
      }
    }
  }, [walletConnected]);

  const onWalletConnect = async (account) => {
    await setupChain();

    if (account) {
      setAccount(account.toLowerCase());
    }
  };

  useEffect(() => {
    setupChain();
  }, []);

  const showConnectButton = () => {
    if (!account || !user.walletId) {
      return true;
    } else if (account != user.walletId) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Dropdown className="">
        <Dropdown.Toggle
          className="user-menu-dropdown-btn no-caret"
          id="user-dropdown"
        >
          <TalentProfilePicture
            src={user.profilePictureUrl}
            height={20}
            className="mr-2"
          />
          <small className="mr-2">{user.username}</small>
          <FontAwesomeIcon icon={faAngleDown} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {!showConnectButton() && (
            <Dropdown.Item
              key="tab-dropdown-address"
              onClick={copyAddressToClipboard}
            >
              <small className="text-black">Address: </small>
              <small className="text-secondary">{user.displayWalletId}</small>
              <FontAwesomeIcon icon={faCopy} />
            </Dropdown.Item>
          )}
          {showConnectButton() && (
            <Dropdown.Item key="tab-dropdown-connect-wallet">
              <MetamaskConnect user_id={user.id} onConnect={onWalletConnect} />
            </Dropdown.Item>
          )}
          <Dropdown.ItemText key="tab-dropdown-balance">
            <small className="text-black">Balance: </small>
            <small className="text-secondary">{stableBalance}</small>
            <small className="text-secondary ml-1">cUSD</small>
          </Dropdown.ItemText>
          <Dropdown.Item
            key="tab-dropdown-get-funds"
            className="text-black"
            onClick={onClickTransak}
          >
            <small>Get funds</small>
          </Dropdown.Item>
          {user.isTalent ? (
            <Dropdown.Item
              key="tab-dropdown-my-profile"
              className="text-black"
              href={`/talent/${user.username}`}
            >
              <small>My profile</small>
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              key="tab-dropdown-change-investor-image"
              className="text-black"
              onClick={() => setShow(true)}
            >
              <small>Change profile picture</small>
            </Dropdown.Item>
          )}
          <Dropdown.Item
            key="tab-dropdown-sign-out"
            onClick={signOut}
            className="text-black"
          >
            <small>Sign out</small>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <EditInvestorProfilePicture
        show={show}
        setShow={setShow}
        investorId={user.investorId}
      />
    </>
  );
};

export default UserMenu;
