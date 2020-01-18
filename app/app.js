import * as utils from './utils.js';

const token = '3SAPr11y13BiM7xk';
const rce = new RumpusCE(token);

let app = new Vue({
	el: '#app',
	data: {
		userId: null,
		info: {
			id: {
				label: 'ID',
				data: null
			},
			alias: {
				label: 'Alias',
				data: null
			},
			avatarId: {
				label: 'Avatar ID',
				data: null
			},
			avatarUrl: {
				label: 'Avatar URL',
				data: null
			},
			followers: {
				label: 'Followers',
				data: null
			},
			following: {
				label: 'Following',
				data: null
			},
			shipped: {
				label: 'Shipped',
				data: null
			},
			played: {
				label: 'Levels Played',
				data: null
			},
			shoes: {
				label: 'Shoes',
				data: null
			},
			ribbons: {
				label: 'Ribbons',
				data: null
			},
			training: {
				label: 'Training Progress',
				data: null
			},
			playsGen: {
				label: 'Plays Generated',
				data: null
			},
			playtimeGen: {
				label: 'Playtime Generated',
				data: null
			},
			builds: {
				label: 'Daily Builds Completed',
				data: null
			},
			wins: {
				label: 'Wins',
				data: null
			},
			fails: {
				label: 'Fails',
				data: null
			},
			trials: {
				label: 'Tower Trials Completed',
				data: null
			},
			trophies: {
				label: 'Time Trophies',
				data: null
			},
			tipped: {
				label: 'Exposure Bucks Tipped',
				data: null
			},
			earned: {
				label: 'Exposure Bucks Earned',
				data: null
			}
		}
	},
	methods: {
		updateInfo: function(event) {
			updateUserInfo(this.userId);
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
