
import { $, argv, chalk, fs } from 'zx';
import { oneLine } from 'common-tags';
import { spawnSync } from 'child_process';




import dotenv from 'dotenv';
dotenv.config();



async function zxRaw(cmd) {
  const escaping = $.quote;
  $.quote = (...all) => all;
  const res = await $`${cmd}`;
  $.quote = escaping;
  return res;
};

import {
  checkFilesExists, 
  zxRaw as RAW,
  restartDfxBackgroundClean, 
  getICRC1TokenCanisterDfxDeploymentCmd,
  getCurrentDfxIdPrincipal
} from "./script_utils.js"


function checkICRC1WasmnDidDownloaded() {
  try {
    return (fs.existsSync('./src/icrc1-token-canister/icrc1.wasm') && fs.existsSync('./src/icrc1-token-canister/icrc1.did'));
  } catch (e) {
    return false;
  }
}

if (!checkICRC1WasmnDidDownloaded()) {
  await $`./src/icrc1-token-canister/install.sh`;
};

async function deploy_icrc1_token_canister(
  { 
    mintersPrincipal = null,
    dfxJsonIcrc1CanisterName = "icrc1_token_canister",
    tokenName = "CVC ICRC1 Mock Token", 
    tokenSymbol = "CVCMICRC1"
  },
){
  const deploymentLiteral = oneLine`dfx deploy ${dfxJsonIcrc1CanisterName} --argument '(variant { Init = 
    record { 
      token_symbol = "${tokenSymbol}";
      token_name =  "${tokenName}";
      minting_account = record { owner = principal"${mintersPrincipal}"; };
      transfer_fee = 10;
      metadata = vec {};
      initial_balances = vec { }; 
      archive_options = record {
        num_blocks_to_archive = 2000;
        trigger_threshold = 1000;
        controller_id = principal"${mintersPrincipal}";
      };
    }
  })'`;
  await zxRaw(deploymentLiteral);
};

const currentDfxUserPrincipal = `${await $`dfx identity get-principal`}`.trim();

try {
  await deploy_icrc1_token_canister({
    mintersPrincipal: currentDfxUserPrincipal,
    dfxJsonIcrc1CanisterName: "icrc1_token_canister",
    tokenName: "CVC ICRC1 Mock Token", 
    tokenSymbol: "CVCMICRC1"
  })
} catch (p) {
  console.error(`Failed to deploy icrc1 ledger due to error ${p.stderr} with exit code ${p.exitCode}`);
};
