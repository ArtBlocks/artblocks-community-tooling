const sdk = require("api")("@opensea/v1.0#bg4ikl1mk428b");
import {
  T_OpenSeaSale,
  T_TokenZero,
  T_OpenSeaSaleLookupTable,
  T_Token,
} from "../types/graphQL_entities_def";
import { delay } from "../utils/util_functions";
import fetch, { Headers } from "node-fetch";

require("dotenv").config();

const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;
const MAX_RETRIES = 15;

// returns the OpenSea asset's collection slug as a string
// @dev doesn't handle errors
export async function getOpenSeaAssetCollectionSlug(
  contractAddress: string,
  tokenId: string
): Promise<string> {
  const res = await sdk["getting-assets"]({
    token_ids: tokenId,
    asset_contract_address: contractAddress,
    limit: "20",
    include_orders: "false",
    "X-API-KEY": OPENSEA_API_KEY,
  });
  return res.assets[0].collection.slug;
}

// returns OpenSea sales events for a given collection slug between timestamp
// bound (exclusive).
// ONLY returns sales performed on OpenSea's contracts.
// @dev doesn't handle errors
export async function getOpenSeaSalesEvents(
  collectionSlug: string,
  tokenZero: T_TokenZero,
  occurredBeforeTimestamp: number,
  minBlockNumber: number
): Promise<T_OpenSeaSale[]> {
  const openSeaSales: T_OpenSeaSale[] = [];
  if (collectionSlug === "cryptocitizensofficial") {
    console.warn(
      "[WARN] cryptocitizens are skipped when using OpenSea API -> royalties should be being sent to PBAB contract, not AB"
    );
    return openSeaSales;
  }
  let _next = "";
  while (true) {
    let url = `https://api.opensea.io/api/v1/events?only_opensea=true&collection_slug=${collectionSlug}&event_type=successful&occurred_before=${occurredBeforeTimestamp}`;
    if (_next !== "") {
      url = url + `&cursor=${_next}`;
    }
    let headers = new Headers({
      "x-api-key": OPENSEA_API_KEY,
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
      "x-readme-api-explorer": "https://api.opensea.io/api/v1/events",
      authority: "api.opensea.io",
      origin: "https://docs.opensea.io",
      referrer: "https://docs.opensea.io",
    });
    let response;
    let success = false;
    let retries = 0;
    while (!success) {
      try {
        response = await fetch(url, {
          method: "get",
          headers: headers,
        });
      } catch (error) {
        console.debug(error);
      }
      if (!response.ok) {
        console.error(response);
        console.error(
          `[WARN] Error while retrieving sales for collection ${collectionSlug}. Cooling off for 5 seconds to avoid 429 errors.`
        );
        await delay(5000);
        if (retries < MAX_RETRIES) {
          retries++;
          console.info(`[INFO] retrying ${retries} of ${MAX_RETRIES} times`);
        } else {
          console.error(
            `[ERROR] maximum retries of ${MAX_RETRIES} reached. quitting...`
          );
          throw "max retries reached, exiting...";
        }
      } else {
        success = true;
      }
    }
    // add results to array of sales events
    const data = await response.json();
    const newOpenSeaSales = data.asset_events.map((_event) => {
      const _saleType = _event.asset_bundle === null ? "Single" : "Bundle";
      // only length of _summaryTokensSold matters, uses :: separater
      let _summaryTokensSold = "dummy";
      let _numTokensSold = 1;
      if (_saleType == "Bundle") {
        // intentionally begin loop at index 1 because already have 1 loaded
        for (let i = 1; i < _event.asset_bundle.assets.length; i++) {
          _summaryTokensSold += "::dummy";
          _numTokensSold++;
        }
      }
      // other options for paymentToken are .symbol ("ETH") or .name ("ether")
      const _openSeaLookupTables: T_OpenSeaSaleLookupTable[] = [];
      // populate this with equivalent data as defined in opensea_sales_repository.ts
      // this is because we need to know artist address, everything.
      if (_saleType === "Single") {
        const _token: T_Token = {
          // single sale
          id: `${tokenZero.tokens[0].contract.id}-${_event.asset.token_id}`,
          tokenId: _event.asset.token_id,
          contract: { ...tokenZero.tokens[0].contract },
          project: { ...tokenZero.tokens[0].project },
        };
        _openSeaLookupTables.push({
          id: `${tokenZero.tokens[0].project.id}:${_token.id}:${_event.id}`,
          token: _token,
        });
      } else {
        // bundle sale
        for (let i = 0; i < _event.asset_bundle.assets.length; i++) {
          // ONLY ADD the assets that are in this collection
          // (since we will get other collections from OS API elsewhere)
          if (
            _event.asset_bundle.assets[i].collection.slug === collectionSlug
          ) {
            const _token: T_Token = {
              id: `${tokenZero.tokens[0].contract.id}-${_event.asset_bundle.assets[i].token_id}`,
              tokenId: _event.asset_bundle.assets[i].token_id,
              contract: { ...tokenZero.tokens[0].contract },
              project: { ...tokenZero.tokens[0].project },
            };
            _openSeaLookupTables.push({
              id: `${tokenZero.tokens[0].project.id}::${_token.id}::${_event.id}`,
              token: _token,
            });
          }
        }
      }
      // should bulk and private sales be included? YES ->
      // example of two squiggles in bulk, OS collected 10%, so we should get paid
      // and it was a private sale, so bulk private sales are good to include
      // 0x2e3fb6389523431ff3a52f1ccb8a24ab9985b2a8f76730b2432a15150afc110d <-- hash

      // summary of tokens sold
      const _sale: T_OpenSeaSale = {
        id: _event.id,
        openSeaVersion: "Vunknown",
        saleType: _saleType,
        blockNumber: _event.transaction.block_number,
        blockTimestamp: _event.transaction.timestamp,
        seller: _event.transaction.to_account.address,
        buyer: _event.winner_account.address,
        paymentToken: _event.payment_token.address,
        price: _event.total_price,
        isPrivate: _event.is_private,
        summaryTokensSold: _summaryTokensSold,
        openSeaSaleLookupTables: _openSeaLookupTables,
      };
      return _sale;
    });
    // loop through all new opensea sales to check if any before minBlockNumber
    // if so, remove them, and also we can break out of loop because we are
    // far enough back in time!
    let _reachedMinBlockNumber = false;
    for (let i = 0; i < newOpenSeaSales.length; i++) {
      // only include if new sale's block is >= minBlock
      if (newOpenSeaSales[i].blockNumber >= minBlockNumber) {
        openSeaSales.push(newOpenSeaSales[i]);
      } else {
        // break (sales ordered recent to oldest)
        _reachedMinBlockNumber = true;
        break;
      }
    }
    // stop scrolling through OpenSea API
    if (data.next == null || _reachedMinBlockNumber) {
      // reached end of opensea's pagination OR min block number
      break;
    }
    // continue pagination through OpenSea API
    _next = data.next;
    // throttle due to OpenSea api rate limits
    await delay(200);
  }
  return openSeaSales;
}
