import common from "./common.json";
import metadata from "./metadata.json";
import auth from "./auth.json";
import chat from "./chat.json";
import vocabulary from "./vocabulary.json";
import subscription from "./subscription.json";
import landing from "./landing.json";

// Reference language: every other locale must provide these same namespaces and keys.
const messages = {
  common,
  metadata,
  auth,
  chat,
  vocabulary,
  subscription,
  landing,
};

export default messages;
