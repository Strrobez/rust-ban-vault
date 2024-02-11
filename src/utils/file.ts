import fs from "fs";

export async function fetchJSONData(batchNumber: number): Promise<any> {
	if (batchNumber < 0 || batchNumber > 12) {
		throw new Error("Batch number must be between 0 and 12.");
	}

	try {
		const filename = `./src/data/seventythousand_${batchNumber}.json`;

		if (!fs.existsSync(filename)) return;

		const data = fs.readFileSync(filename, "utf-8");
		const parsedData = JSON.parse(data);

		return parsedData;
	} catch (error) {
		console.error("Error fetching JSON data:", error);
		throw error;
	}
}
