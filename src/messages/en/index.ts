import type referenceMessages from "../es";
import common from "./common.json";
import metadata from "./metadata.json";

// Typed against Spanish, so a missing namespace or key fails the build instead of showing a raw key.
const messages: typeof referenceMessages = { common, metadata };

export default messages;
