/**
 * ERC-8021 Implementation Structure
 * Transaction Attribution
 */

export const BUILDER_CODE = "bc_jpc8qtk2";
export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";

export interface AttributionData {
  builder: string;
  attribution: string;
  appId: string;
}

export function getAttributionPayload(): AttributionData {
  return {
    builder: BUILDER_CODE,
    attribution: ATTRIBUTION_CODE,
    appId: "68f663c1b6320e0dd0819cf0"
  };
}

export function formatAttributionTransactionData(action: string): `0x${string}` {
  // Mock standard attribution format for on-chain analytics
  const str = `action:${action};app:68f663c1b6320e0dd0819cf0;builder:${BUILDER_CODE}`;
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return `0x${hex}`;
}
