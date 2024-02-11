export default interface IConfig {
	mysql: {
		host: string;
		user: string;
		password: string;
		database: string;
		debug?: boolean;
	};
}
