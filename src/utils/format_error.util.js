import { EDITOR_ERROR } from "../constants/errors";

export const formatError = (domain, message) => {
  return `${EDITOR_ERROR}::${domain}::${message}`;
};
