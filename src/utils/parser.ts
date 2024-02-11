import consola from "consola";

// @ts-ignore
import urlunshort from "url-unshort";
import { ITweet } from "../app";

const uu = urlunshort({ nesting: 5 });
uu.add(["zpr.io"]);

type TParsedData = {
	tweet_id: string;
	url: string;
	steam_id: string;
	date: string;
};

async function parseData(
	tweet_id: string,
	tweet: ITweet
): Promise<TParsedData | undefined> {
	if (Array.isArray(tweet.urls) && tweet.urls.length < 1) {
		consola.error("🚫 No URLs found in tweet to parse SteamID");
		return;
	}

	let url = tweet.urls[0];

	let steam_id: string = await uu.expand(url);
	if (isSteamVanityURL(url)) {
		steam_id = await resolveSteamVanityURL(url?.split("/")[4]);
	} else steam_id = url?.split("/")[4];

	return {
		tweet_id,
		url: tweet.link,
		steam_id,
		date: tweet.date,
	};
}

const isSteamVanityURL = (url: string): boolean => {
	return url.includes("steamcommunity.com/id");
};

interface SteamVanityURLResponse {
	response: {
		steamid: string;
		success: number;
	};
}

const resolveSteamVanityURL = async (vanityURL: string): Promise<string> => {
	const response: Response = await fetch(
		`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=482261F037D7FC6B63EE36677506636D&vanityurl=${vanityURL}`
	);

	const data = (await response.json()) as SteamVanityURLResponse;
	return data.response.steamid;
};

export { parseData, TParsedData };
