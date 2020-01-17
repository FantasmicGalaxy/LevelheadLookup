const token = '3SAPr11y13BiM7xk';
const rce = new RumpusCE(token);

const id = 'bscotch404';

let app = new Vue({
	el: '#app',
	data: {
		info: {
			id: {},
			alias: {},
			avatarId: {},
			avatarUrl: {},
			followers: {},
			following: {},
			shipped: {},
			played: {},
			shoes: {},
			ribbons: {},
			training: {},
			playsGen: {},
			playtimeGen: {},
			builds: {},
			wins: {},
			fails: {},
			trials: {},
			trophies: {},
			tipped: {},
			earned: {}
		}
	}
});

function formatCommas(number) {
	let parts = number.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

function formatTime(seconds) {
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);
	let days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days}d ${hours % 24}h`;
	} else if (hours > 0) {
		return `${hours}h ${minutes % 60}m`;
	} else if (minutes > 0) {
		return `${minutes}m`;
	}
}

function formatPercent(number) {
	return `${number}%`;
}

// fetches and returns the data from Rumpus
async function getUserData(userId) {
	try {
		let aliasData = await rce.levelhead.aliases.search(userId, {}, { doNotUseKey: true });
		let playerData = await rce.levelhead.players.search({ userIds: userId }, { doNotUseKey: true });

		if (aliasData.length != 1 || playerData.length != 1) {
			throw new Error('Request from server had too many responses!');
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
			id: {
				label: 'ID',
				data: rawData.userId
			},
			alias: {
				label: 'Alias',
				data: rawData.alias
			},
			avatarId: {
				label: 'Avatar ID',
				data: rawData.avatarId
			},
			avatarUrl: {
				label: 'Avatar URL',
				data: `https://img.bscotch.net/fit-in/128x128/avatars/${rawData.avatarId}.png`
			},
			followers: {
				label: 'Followers',
				data: rawData.stats.Subscribers
			},
			following: {
				label: 'Following',
				data: rawData.stats.NumFollowing
			},
			shipped: {
				label: 'Shipped',
				data: rawData.stats.Published
			},
			played: {
				label: 'Levels Played',
				data: rawData.stats.LevelsPlayed
			},
			shoes: {
				label: 'Shoes',
				data: rawData.stats.Shoes
			},
			ribbons: {
				label: 'Ribbons',
				data: rawData.stats.Crowns
			},
			training: {
				label: 'Training Progress',
				data: rawData.stats.CampaignProg
			},
			playsGen: {
				label: 'Plays Generated',
				data: rawData.stats.Plays
			},
			playtimeGen: {
				label: 'Playtime Generated',
				data: rawData.stats.PlayTime
			},
			builds: {
				label: 'Daily Builds Completed',
				data: rawData.stats.DBComp
			},
			wins: {
				label: 'Wins',
				data: rawData.stats.Wins
			},
			fails: {
				label: 'Fails',
				data: rawData.stats.Fails
			},
			trials: {
				label: 'Tower Trials Completed',
				data: rawData.stats.ChalWins
			},
			trophies: {
				label: 'Time Trophies',
				data: rawData.stats.TimeTrophies
			},
			tipped: {
				label: 'Exposure Bucks Tipped',
				data: rawData.stats.BucksTipped
			},
			earned: {
				label: 'Exposure Bucks Earned',
				data: rawData.stats.TipsGotten
			}
		};

		app.info = info;
	} catch (error) {
		console.error(`ERROR: ${error}`);
	}
}

updateUserInfo(id);
