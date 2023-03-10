export const getAuthToken = () => document.querySelector('meta[name="csrf-token"]')?.content;

export const defaultHeaders = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json"
  };
};
