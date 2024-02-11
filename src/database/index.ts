import IConfig from "../config";
const config: IConfig = require("../../config.json");

import { createConnection } from "mysql2/promise";

import consola from "consola";

async function getConnection() {
	return await createConnection({ ...config.mysql });
}

async function createDefaultTable(connection: any): Promise<void> {
	const query: string = `
			CREATE TABLE IF NOT EXISTS gamebans (
				tweet_id VARCHAR(255) PRIMARY KEY,
				url VARCHAR(255),
				steam_id VARCHAR(17),
				date DATE
			)
		`;

	try {
		await connection.query(query);

		consola.success("📝 [MYSQL] Default table was found or created");
	} catch (error) {
		consola.error("📝 [MYSQL] Error creating default tables:", error);
	} finally {
		connection.end();
	}
}

export { getConnection, createDefaultTable };
