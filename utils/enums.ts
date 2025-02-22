const EmbedVerificationStatus = {
  VERIFIED: "verified",
  NOT_VERIFIED: "notVerified",
  VERIFYING: "verifying",
};

const ParamsEnums = {
  orgId: "orgId",
  flowhitid: "flowhitid",
  projectId: "projectId",
  stepId: "stepId",
  slugName: "slugName",
  scriptId: "scriptId",
  tabName: "tabName",
  pluginId: "pluginId",
  actionId: "actionId",
  sectionKey: "sectionKey",
  sectionId: "sectionId",
  inviteId: "inviteId",
  clientId: "clientId",
  sectionIdOrScriptId: "sectionIdOrScriptId",
  versionIdOrStepId: "versionIdOrStepId",
  isPublishedTab: "isPublishedTab",
  versionId: "versionId",
  isTemplate: "isTemplate",
  interfaceId: "interfaceId",
  isConfiguration: "isConfiguration",
  isLogs: "isLogs",
  isSetup: "isSetup",
  embedding: "embedding",
  search: "search",
  serviceId: "serviceId",
  triggerId: "triggerId",
  stepName: "stepName",
  eventId: "eventId",
  chatBotId: "chatBotId",
};

export const KNOWLEDGE_BASE_SECTION_TYPES = [
  { value: "default", label: "Default" },
  { value: "custom", label: "Custom" },
];

export const KNOWLEDGE_BASE_CUSTOM_SECTION = [
  { value: "semantic", label: "Semantic Chunking" },
  { value: "manual", label: "Manual Chunking" },
  { value: "recursive", label: "Recursive Chunking" },
];

Object.freeze(EmbedVerificationStatus);
Object.freeze(ParamsEnums);

export { EmbedVerificationStatus, ParamsEnums };
