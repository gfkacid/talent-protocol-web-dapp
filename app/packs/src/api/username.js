import axios from "axios";

const validateHandle = localHandle => axios.get(`/api/v1/username/valid?username=${localHandle}`);

export const username = {
  validateHandle
};
