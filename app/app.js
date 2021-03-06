import * as utils from './utils.js';

// formatting codes:
// 0: none,
// 1: formatCommas()
// 2: formatTime()
// 3: formatPercent()

const token = '3SAPr11y13BiM7xk';
const limit = 64;
// @ts-ignore
const rce = new RumpusCE(token);

// @ts-ignore
let app = new Vue({
	el: '#app',
	data: {
		userId: null,
		levels: [],
		info: {
			id: {
				label: 'ID',
				data: null,
				format: 0
			},
			alias: {
				label: 'Alias',
				data: null,
				format: 0
			},
			avatarId: {
				label: 'Avatar ID',
				data: null,
				format: 0
			},
			avatarUrl: {
				label: 'Avatar URL',
				data: null,
				format: 0
			},
			followers: {
				label: 'Followers',
				data: null,
				format: 1
			},
			following: {
				label: 'Following',
				data: null,
				format: 1
			},
			shipped: {
				label: 'Shipped',
				data: null,
				format: 1
			},
			played: {
				label: 'Levels Played',
				data: null,
				format: 1
			},
			shoes: {
				label: 'Shoes',
				data: null,
				format: 1
			},
			ribbons: {
				label: 'Ribbons',
				data: null,
				format: 1
			},
			training: {
				label: 'Training Progress',
				data: null,
				format: 3
			},
			playsGen: {
				label: 'Plays Generated',
				data: null,
				format: 1
			},
			playtimeGen: {
				label: 'Playtime Generated',
				data: null,
				format: 2
			},
			builds: {
				label: 'Daily Builds Completed',
				data: null,
				format: 1
			},
			wins: {
				label: 'Wins',
				data: null,
				format: 1
			},
			fails: {
				label: 'Fails',
				data: null,
				format: 1
			},
			trials: {
				label: 'Tower Trials Completed',
				data: null,
				format: 1
			},
			trophies: {
				label: 'Time Trophies',
				data: null,
				format: 1
			},
			tipped: {
				label: 'Exposure Bucks Tipped',
				data: null,
				format: 1
			},
			earned: {
				label: 'Exposure Bucks Earned',
				data: null,
				format: 1
			}
		}
	},
	methods: {
		updateInfo(event) {
			if (this.userId.length >= 6) {
				updateUserInfo(this.userId);
				updateUserLevels(this.userId);
			}
		},
		formatText(text, formatCode) {
			if (typeof text === 'string') {
				return text;
			}
			if (typeof text === 'number') {
				switch (formatCode) {
					case 0:
						return text;
					case 1:
						return utils.formatCommas(text);
					case 2:
						return utils.formatTime(text);
					case 3:
						return utils.formatPercent(text);
					default:
						return text;
				}
			}
		},
		getDate(time) {
			let date = new Date(time);
			return `${date.getMonth() + 1}/${date.getDay() + 1}/${date.getFullYear()}`;
		}
	}
});

// fetches and returns the data from Rumpus
async function getUserData(userId) {
	try {
		let aliasData = await rce.levelhead.aliases.search(userId, {}, { doNotUseKey: true });
		let playerData = await rce.levelhead.players.search({ userIds: userId }, { doNotUseKey: true });
		if (aliasData.length != 1 || playerData.length != 1) {
			throw new Error('Response from server had more/less than 1 response!');
		}

		let rawData = { ...aliasData[0], ...playerData[0] };
		return rawData;
	} catch (err) {
		console.error(`ERROR: ${err}`);
	}
}

async function updateUserInfo(userId) {
	try {
		let rawData = await getUserData(userId);

		let info = {
			id: rawData.userId,
			alias: rawData.alias,
			avatarId: rawData.avatarId,
			avatarUrl: rawData.avatarUrl(),
			followers: rawData.stats.Subscribers,
			following: rawData.stats.NumFollowing,
			shipped: rawData.stats.Published,
			played: rawData.stats.LevelsPlayed,
			shoes: rawData.stats.Shoes,
			ribbons: rawData.stats.Crowns,
			training: rawData.stats.CampaignProg,
			playsGen: rawData.stats.Plays,
			playtimeGen: rawData.stats.PlayTime,
			builds: rawData.stats.DBComp,
			wins: rawData.stats.Wins,
			fails: rawData.stats.Fails,
			trials: rawData.stats.ChalWins,
			trophies: rawData.stats.TimeTrophies,
			tipped: rawData.stats.BucksTipped,
			earned: rawData.stats.TipsGotten
		};

		for (const key in app.info) {
			if (app.info.hasOwnProperty(key) && info.hasOwnProperty(key)) {
				app.info[key].data = info[key];
			}
		}
	} catch (error) {
		console.error(`ERROR: ${error}`);
	}
}

async function updateUserLevels(userId) {
	let currentLevel = await rce.levelhead.levels.search(
		{ userIds: userId, limit: limit, sort: 'createdAt' },
		{ doNotUseKey: true }
	);
	let levels = [ ...currentLevel ];
	while (currentLevel.length === limit) {
		currentLevel = await currentLevel.nextPage();
		levels.push(...currentLevel);
	}
	app.levels = levels;
}

updateUserInfo('3719xx');
updateUserLevels('3719xx');
