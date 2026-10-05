import type referenceMessages from "../es";
import common from "./common.json";
import errors from "./errors.json";
import metadata from "./metadata.json";
import auth from "./auth.json";
import exam from "./exam.json";
import notes from "./notes.json";
import chat from "./chat.json";
import vocabulary from "./vocabulary.json";
import reader from "./reader.json";
import workspace from "./workspace.json";
import subscription from "./subscription.json";
import landing from "./landing.json";

// Typed against Spanish, so a missing namespace or key fails the build instead of showing a raw key.
const messages: typeof referenceMessages = {
  common,
  errors,
  metadata,
  auth,
  exam,
  notes,
  chat,
  vocabulary,
  reader,
  workspace,
  subscription,
  landing,
};

export default messages;
