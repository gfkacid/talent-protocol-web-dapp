import React, { useState, useContext, useEffect } from "react";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import { useWindowDimensionsHook } from "src/utils/window";

import { loggedInUserStore } from "src/contexts/state";

import { Switch } from "@talentprotocol/design-system/switch";

import { emailRegex, usernameRegex } from "src/utils/regexes";
import { H5, P2, P3 } from "src/components/design_system/typography";
import { passwordMatchesRequirements } from "src/utils/passwordRequirements";
import { patch, post, get } from "src/utils/requests";
import { ToastBody } from "src/components/design_system/toasts";
import Button from "src/components/design_system/button";
import Divider from "src/components/design_system/other/Divider";
import Link from "src/components/design_system/link";
import LoadingButton from "src/components/button/LoadingButton";
import Tag from "src/components/design_system/tag";
import TextInput from "src/components/design_system/fields/textinput";
import { CustomHandleInput } from "src/components-v2/custom-handle-input";

const NotificationInputs = [
  {
    description: "Someone bought your talent token",
    name: "TokenAcquiredNotification"
  },
  {
    description: "Someone sent you a chat message",
    name: "MessageReceivedNotification"
  }
];

const Settings = props => {
  const theme = useContext(ThemeContext);
  const mode = theme.mode();
  const { mobile } = useWindowDimensionsHook();

  const talBaseDomain = props.railsContext.talBaseDomain;

  const [notificationPreferences, setNotificationPreferences] = useState(props.notificationPreferences);

  const { currentUser, fetchCurrentUser } = loggedInUserStore();

  const [settings, setSettings] = useState({
    tal_domain: currentUser?.tal_domain || "",
    tal_domain_theme: currentUser?.tal_domain_theme || "light",
    wallet_id: currentUser?.wallet_id || "",
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    messagingDisabled: currentUser?.messaging_disabled || false,
    currentPassword: "",
    newPassword: "",
    deletePassword: ""
  });

  const [validationErrors, setValidationErrors] = useState({
    username: false,
    currentPassword: false,
    newPassword: false,
    deletePassword: false,
    talDomain: false
  });
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
    public: false
  });
  const [emailValidated, setEmailValidated] = useState(false);
  const [domainValidated, setDomainValidated] = useState(false);
  const { valid: validPassword, errors, tags } = passwordMatchesRequirements(settings.newPassword);
  const [notifications, setNotifications] = useState({
    saving: false,
    success: false
  });

  useEffect(() => {
    if (!currentUser) {
      fetchCurrentUser();
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setSettings({
      tal_domain: currentUser.tal_domain || "",
      tal_domain_theme: currentUser.tal_domain_theme || "light",
      wallet_id: currentUser.wallet_id || "",
      username: currentUser.username || "",
      email: currentUser.email || "",
      messagingDisabled: currentUser.messaging_disabled || false,
      currentPassword: "",
      newPassword: "",
      deletePassword: ""
    });
    setEmailValidated(!!currentUser.email);
    setDomainValidated(!!currentUser.tal_domain);
  }, [currentUser]);

  const changeAttribute = (attribute, value) => {
    if (attribute === "currentPassword" && validationErrors.currentPassword) {
      setValidationErrors(prev => ({ ...prev, currentPassword: false }));
    } else if (attribute === "email") {
      setValidationErrors(prev => ({ ...prev, email: false }));
      setEmailValidated(false);
      if (emailRegex.test(value)) validateEmail(value);
    } else if (attribute === "tal_domain") {
      setValidationErrors(prev => ({ ...prev, tal_domain: false }));
      setDomainValidated(false);
    } else if (attribute === "username") {
      if (usernameRegex.test(value)) {
        setValidationErrors(prev => ({ ...prev, username: false }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          username: "Username only allows lower case letters and numbers"
        }));
      }
    } else if (attribute === "deletePassword") {
      setValidationErrors(prev => ({ ...prev, deleting: false }));
    }

    setSettings(prevInfo => ({ ...prevInfo, [attribute]: value }));
  };

  const updateUser = async () => {
    setSaving(prev => ({ ...prev, loading: true }));

    const response = await patch(`/api/v1/users/${currentUser?.id}`, {
      user: {
        ...settings,
        messaging_disabled: settings.messagingDisabled
      }
    }).catch(() => setValidationErrors(prev => ({ ...prev, saving: true })));

    if (response) {
      if (!response.errors && !response.error) {
        setSaving(prev => ({ ...prev, loading: false, profile: true }));
      } else {
        setValidationErrors(prev => ({ ...prev, ...response.errors }));
      }
    }

    setSaving(prev => ({ ...prev, loading: false }));
  };

  const updatePassword = async () => {
    setSaving(prev => ({ ...prev, loading: true }));

    const response = await patch(`/api/v1/users/${currentUser?.id}`, {
      user: {
        current_password: settings.currentPassword,
        new_password: settings.newPassword
      }
    }).catch(() => setValidationErrors(prev => ({ ...prev, saving: true })));

    if (response) {
      if (!response.errors && !response.error) {
        setSettings(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: ""
        }));
        setSaving(prev => ({ ...prev, loading: false, profile: true }));
      } else {
        setValidationErrors(prev => ({ ...prev, ...response.errors }));
      }
    }

    setSaving(prev => ({ ...prev, loading: false }));
  };

  const sendDeleteAccountEmail = async () => {
    const response = await post(`/api/v1/users/${currentUser?.id}/delete_account_tokens`);

    if (response && response.success) {
      toast.success(<ToastBody heading="Success!" body="Email sent!" />);
    }
  };

  const setNotificationSettings = name => event => {
    const value = parseInt(event.currentTarget.value, 10);
    const preferences = { ...notificationPreferences, [name]: value };
    setNotificationPreferences(preferences);
  };

  const updateNotificationSettings = async () => {
    let success = true;
    setNotifications(prev => ({ ...prev, saving: true, success: false }));

    const response = await patch(`/api/v1/users/${currentUser?.id}`, {
      user: {
        notification_preferences: notificationPreferences
      }
    }).catch(() => (success = false));

    success = success && response && !response.errors;
    setNotifications(prev => ({ ...prev, saving: false, success }));
  };

  const messagingModeChanged = () => settings.messagingDisabled != currentUser?.messaging_disabled;

  const cannotSaveSettings = () =>
    !emailValidated ||
    !!validationErrors.email ||
    !domainValidated ||
    !!validationErrors.talDomain ||
    settings.username.length == 0 ||
    !!validationErrors.username;

  const cannotChangePassword = () =>
    !!validationErrors.currentPassword ||
    !!validationErrors.newPassword ||
    settings.currentPassword.length < 8 ||
    settings.newPassword.length < 8 ||
    (!!settings.newPassword && !validPassword);

  const validateEmail = value => {
    if (emailRegex.test(value)) {
      setValidationErrors(prev => ({ ...prev, email: false }));
    } else {
      setValidationErrors(prev => ({
        ...prev,
        email: "Email is not valid"
      }));
    }
    setEmailValidated(true);
  };

  const validateDomain = async talDomain => {
    if (!talDomain) {
      return;
    }

    let subdomainWithDomain = talDomain;

    if (!subdomainWithDomain.includes(talBaseDomain)) {
      subdomainWithDomain = `${talDomain}.${talBaseDomain}`;
    }

    const response = await get(`/api/v1/users/domain_owner?tal_domain=${subdomainWithDomain}`).catch(error =>
      console.error(error)
    );

    if (response.error) {
      setValidationErrors(prev => ({ ...prev, talDomain: response.error }));
    } else {
      setValidationErrors(prev => ({ ...prev, talDomain: false }));
    }

    setDomainValidated(true);
  };

  const saveProfileDisabled = () => {
    return (saving.loading || cannotSaveSettings()) && !messagingModeChanged();
  };

  const talSubdomain = () =>
    settings.tal_domain.includes(talBaseDomain)
      ? settings.tal_domain.replace(`.${talBaseDomain}`, "")
      : settings.tal_domain;

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <div className="d-flex flex-column edit-profile-content w-100">
        <H5 className="w-100 text-left" mode={mode} text="Account Settings" bold />
        <P2 className="w-100 text-left" mode={mode} text="Update your username and manage your account" />
        <div className="d-flex flex-row w-100 flex-wrap justify-content-between mt-4">
          <TextInput
            title={"Username"}
            mode={mode}
            shortCaption={`Your Talent Protocol URL: /u/${settings.username}`}
            onChange={e => changeAttribute("username", e.target.value)}
            value={settings.username}
            className="w-100"
            required
            error={validationErrors.username}
          />
          {validationErrors.username && <P3 className="text-danger" text={validationErrors.username} />}
        </div>
        <div className="d-flex flex-row w-100 flex-wrap mt-4">
          <TextInput
            title="Email"
            type="email"
            mode={mode}
            onChange={e => changeAttribute("email", e.target.value)}
            value={settings.email}
            className="w-100"
            required
            error={validationErrors.email}
            onBlur={e => validateEmail(e.target.value)}
          />
          {validationErrors?.email && <P3 className="text-danger" text={validationErrors.email} />}
        </div>
        <div className="d-flex flex-column w-100 flex-wrap mt-4">
          <P2 bold className="text-black mb-2">
            Disable Messages
          </P2>

          <div className="d-flex flex-row align-middle align-items-center">
            <Switch
              isDarkTheme={mode == "dark"}
              state="enabled"
              isChecked={!settings.messagingDisabled}
              onChange={() => changeAttribute("messagingDisabled", !settings.messagingDisabled)}
            />
            <P2 className="text-primary-01 ml-2 mb-2" text="I want to receive messages" />
          </div>
        </div>
        <div className="d-flex flex-row w-100 flex-wrap mt-4">
          <div className="d-flex flex-row align-middle align-items-center mb-2">
            <P2 className="text-primary-01" bold text="Custom domain" />
            <Tag className="tag-available-label ml-2 square-tag" size="small">
              <P3 className="bg-01" bold text="New" />
            </Tag>
          </div>
          <CustomHandleInput
            mode={mode}
            onChange={e => changeAttribute("tal_domain", e.target.innerText)}
            value={talSubdomain()}
            onBlur={e => validateDomain(e.target.innerText)}
          />
          {validationErrors?.talDomain ? (
            <P3 className="text-danger mt-1" text={validationErrors.talDomain} />
          ) : (
            <P3 className="mt-1">
              Set your handle to configure your Talent Protocol custom domain.{" "}
              <a href="https://talentprotocol.com/handle" target="_blank">
                Learn More
              </a>
            </P3>
          )}
        </div>
        <div className="d-flex flex-column w-100 flex-wrap mt-4">
          <div className="d-flex flex-row align-middle align-items-center mb-2">
            <P2 className="text-primary-01" bold text="Custom domain theme" />
            <Tag className="tag-available-label ml-2 square-tag" size="small">
              <P3 className="bg-01" bold text="New" />
            </Tag>
          </div>

          <div className="d-flex flex-row align-middle align-items-center">
            <Switch
              isDarkTheme={mode == "dark"}
              isChecked={settings.tal_domain_theme == "dark"}
              state={validationErrors?.talDomain || !settings.tal_domain ? "disabled" : "enabled"}
              onChange={() =>
                changeAttribute("tal_domain_theme", settings.tal_domain_theme == "dark" ? "light" : "dark")
              }
            />
            <P2 className="text-primary-01 ml-2 mb-2" text="Dark Theme" />
          </div>
        </div>
        <div className="d-flex flex-column w-100 flex-wrap mt-3">
          <div className={`d-flex flex-row ${mobile ? "justify-content-between" : "mt-4"} w-100 pb-4`}>
            <LoadingButton
              onClick={() => updateUser()}
              type="primary-default"
              mode={mode}
              disabled={saveProfileDisabled()}
              loading={saving.loading}
              success={saving.profile}
            >
              Save Profile
            </LoadingButton>
          </div>
        </div>
        <Divider className="mb-4" />
        <div className="d-flex flex-row w-100 flex-wrap mt-4">
          <TextInput
            title={"Current Password"}
            type="password"
            placeholder={"*********"}
            mode={mode}
            onChange={e => changeAttribute("currentPassword", e.target.value)}
            value={settings.currentPassword}
            className="w-100"
            required
            error={validationErrors.currentPassword}
          />
          {validationErrors?.currentPassword && <P3 className="text-danger" text={validationErrors.currentPassword} />}
        </div>
        <div className="d-flex flex-row w-100 justify-content-between mt-4">
          <TextInput
            title={"New Password"}
            type="password"
            placeholder={"*********"}
            mode={mode}
            onChange={e => changeAttribute("newPassword", e.target.value)}
            value={settings.newPassword}
            className="w-100"
            error={validationErrors.newPassword}
          />
        </div>
        <div className="d-flex flex-wrap">
          {tags.map(tag => (
            <Tag className={`mr-2 mt-2${errors[tag] ? "" : " bg-success"}`} key={tag}>
              <P3 text={tag} bold className={errors[tag] ? "" : "permanent-text-white"} />
            </Tag>
          ))}
        </div>
        <Button
          onClick={() => updatePassword()}
          type="primary-default"
          mode={mode}
          disabled={cannotChangePassword()}
          className="mt-4 mb-4 w-100"
        >
          Change password
        </Button>

        <Divider className="mb-4" />
        <div className="d-flex flex-column w-100 my-3">
          <H5 className="w-100 text-left" mode={mode} text="Email Notification Settings" bold />
          <P2
            className="w-100 text-left"
            mode={mode}
            text="For each type of notification you can select to receive an immediate email notification, a daily email digest or to not receive any email."
          />

          {NotificationInputs.map(input => (
            <div className="d-flex flex-row w-100 flex-wrap mt-4" key={input.name}>
              <div className="d-flex flex-column w-100">
                <div className="d-flex flex-row justify-content-between align-items-end">
                  <P2 bold className="text-black mb-2">
                    {input.description}
                  </P2>
                </div>
                <Form.Control
                  as="select"
                  onChange={setNotificationSettings(input.name)}
                  value={notificationPreferences[input.name]}
                  className="height-auto"
                >
                  <option value="0">Disabled</option>
                  <option value="1">Immediate</option>
                  <option value="2">Digest</option>
                </Form.Control>
              </div>
            </div>
          ))}
          <div className={`d-flex flex-row ${mobile ? "justify-content-between mt-4" : "mt-4"} w-100 pb-4`}>
            <LoadingButton
              onClick={updateNotificationSettings}
              type="primary-default"
              mode={mode}
              loading={notifications.saving}
              disabled={notifications.saving}
              success={notifications.success}
            >
              Save Settings
            </LoadingButton>
          </div>
        </div>

        <Divider className="mb-4" />
        <div className="d-flex flex-column w-100 my-3">
          <H5 className="w-100 text-left" mode={mode} text="Close Account" bold />
          <P2
            className="w-100 text-left"
            mode={mode}
            text="To permanently delete your account and account data, you'll need to confirm your decision in an email we send you."
          />
          <button className="button-link w-100 mt-4 mb-2" onClick={sendDeleteAccountEmail}>
            <Link text="Send delete account confirmation email" className="text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer>
      <Settings {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};
