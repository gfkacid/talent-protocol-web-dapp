import axios from "axios";
import { defaultHeaders, getAuthToken } from "./utils";

const signIn = (email, password) => {
  const headers = defaultHeaders();

  if (getAuthToken) {
    headers["X-CSRF-Token"] = getAuthToken();
  }
  return axios.post(
    "/session",
    {
      email,
      password
    },
    {
      headers: {
        ...headers
      }
    }
  );
};

export const session = {
  signIn
};
