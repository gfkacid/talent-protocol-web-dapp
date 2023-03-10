import React, { useCallback } from "react";
import { toast } from "react-toastify";
import { Button } from "@talentprotocol/design-system";
import { ActionArea } from "./styled";
import { users } from "../../../api";
import { ToastBody } from "src/components/design_system/toasts";

export const EmailFooter = ({ hasCreateAccountError, createdUser }) => {
  const resendEmailCallback = useCallback(() => {
    users.sendConfirmationEmail(createdUser.id)
      .then(() => {
        toast.success(<ToastBody heading="Success" />)
      })
      .catch(() => {
        toast.error(<ToastBody heading="Something happened" />)
      });
  }, [createdUser]);
  return hasCreateAccountError ? (
    <></>
  ) : (
    <ActionArea>
      <Button size="small" hierarchy="tertiary" text="Resend email" onClick={resendEmailCallback}/>
    </ActionArea>
  );
}
