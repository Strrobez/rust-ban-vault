import { createDefaultTable, getConnection } from "./database";

import { fetchJSONData } from "./utils/file";

import { parseData } from "./utils/parser";

import consola from "consola";

(async () => {
	const connection = await getConnection();

	await createDefaultTable(connection);

	for (let batch = 0; batch <= 12; batch++) {
		const data = await fetchJSONData(batch);

		if (!data) {
			consola.error(`🚫  Error fetching data for batch: [${batch}]`);
			continue;
		}

		await process_batch(batch, data);
	}

	await connection.end();
})();

async function process_batch(
	num: number,
	data: Record<string, ITweet>,
	connection = getConnection()
) {
	consola.info(`📦  Processing batch ${num}...`);

	consola.success(`🕊️️  Processing ${Object.keys(data).length} Tweets...`);

	for (const [key, value] of Object.entries(data)) {
		let tweet = await parseData(key, value);

		if (!tweet) {
			consola.error(`🚫  Error parsing tweet: [${key}]`);
			continue;
		}

		// consola.success(
		// 	`🔽  Tweet parsed: [${tweet?.url}] | SID: [${tweet?.steam_id}]`
		// );

		const query: string = `
            INSERT IGNORE INTO gamebans (tweet_id, url, steam_id, date)
            VALUES ('${tweet.tweet_id}', '${tweet.url}', '${tweet.steam_id}', '${tweet.date}')
        `;

		try {
			(await connection).query(query);

			// consola.success(`📝 [MYSQL] Tweet inserted: [${tweet.url}]`);
		} catch (error) {
			consola.error("📝 [MYSQL] Error inserting tweet:", error);
			break;
		}
	}

	consola.success(`📦  Batch ${num} processed!`);
}

export interface ITweet {
	tweet: string;
	id: number;
	date: string;
	link: string;
	urls: string[];
}
