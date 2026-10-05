import type referenceMessages from "../es";
import common from "./common.json";
import metadata from "./metadata.json";
import auth from "./auth.json";
import chat from "./chat.json";
import vocabulary from "./vocabulary.json";
import subscription from "./subscription.json";
import landing from "./landing.json";

// Typed against Spanish, so a missing namespace or key fails the build instead of showing a raw key.
const messages: typeof referenceMessages = {
  common,
  metadata,
  auth,
  chat,
  vocabulary,
  subscription,
  landing,
};

export default messages;
