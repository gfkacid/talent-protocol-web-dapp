import { useState } from "react";

export const useUserBuilder = () => {
  const [user, setUser] = useState({
    captcha: "",
    code: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    handle: "",
    gender: "",
    nationality: "",
    location: "",
    headline: "",
    tags: [],
    careerNeeds: []
  });
  return { user, setUser };
};
