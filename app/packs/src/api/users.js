import axios from "axios";
import { defaultHeaders, getAuthToken } from "./utils";

const createAccount = user => {
  const headers = defaultHeaders();

  if (getAuthToken) {
    headers["X-CSRF-Token"] = getAuthToken();
  }
  return axios.post(
    "/users.json",
    {
      captcha: user.captcha,
      code: user.code,
      email: user.email,
      legal_first_name: user.firstName,
      legal_last_name: user.lastName,
      password: user.password,
      theme_preference: "light",
      username: user.handle,
      career_needs: user.careerNeeds,
      headline: user.headline,
      gender: user.gender,
      nationality: user.nationality,
      location: user.location,
      tags: user.tags
    },
    {
      headers: {
        ...headers
      }
    }
  );
};

const sendConfirmationEmail = userId =>
  axios.post(`users/${userId}/send_confirmation_email.json`);

export const users = {
  createAccount,
  sendConfirmationEmail
};
