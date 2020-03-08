import * as utils from './utils.js';

// formatting codes:
// 0: none,
// 1: formatCommas()
// 2: formatPercent()
// 3: formatTime()
// 4: formatDate()

const token = '3SAPr11y13BiM7xk';
const limit = 10;
// @ts-ignore
const rce = new RumpusCE(token);

// @ts-ignore
let app = new Vue({
	el: '#app',
	data: {
		playerData: {
			alias: {
				id: '3719xx'
			},
			profile: {},
			levels: []
		},
		formats: {
			none: 0,
			comma: 1,
			percent: 2,
			time: 3,
			date: 4
		}
	},
	methods: {
		updateData(event) {
			if (this.playerData.alias.id.length >= 6) {
				getUserAlias(this.playerData.alias.id);
				getUserProfile(this.playerData.alias.id);
				getUserLevels(this.playerData.alias.id);
			}
		},
		format(data, format) {
			switch (format) {
				case 0:
					return data;
				case 1:
					return utils.formatCommas(data);
				case 2:
					return utils.formatTime(data);
				case 3:
					return utils.formatPercent(data);
				case 4:
					return utils.formatDate(data);
				default:
					return data;
			}
		}
	}
});

async function getUserAlias(userId) {
	let aliasData = await rce.levelhead.aliases.search(userId, {}, { doNotUseKey: true });
	aliasData = aliasData[0];

	let alias = {
		id: await aliasData.userId,
		alias: aliasData.alias,
		avatarId: aliasData.avatarId,
		avatarUrl: aliasData.avatarUrl()
	};
	app.playerData.alias = alias;
}

async function getUserProfile(userId) {
	let profileData = await rce.levelhead.players.search({ userIds: userId }, { doNotUseKey: true });
	profileData = profileData[0];

	let profile = {
		followers: profileData.stats.Subscribers,
		following: profileData.stats.NumFollowing,
		shipped: profileData.stats.Published,
		played: profileData.stats.LevelsPlayed,
		shoes: profileData.stats.Shoes,
		ribbons: profileData.stats.Crowns,
		training: profileData.stats.CampaignProg,
		playsGen: profileData.stats.Plays,
		playtimeGen: profileData.stats.PlayTime,
		builds: profileData.stats.DBComp,
		wins: profileData.stats.Wins,
		fails: profileData.stats.Fails,
		trials: profileData.stats.ChalWins,
		trophies: profileData.stats.TimeTrophies,
		tipped: profileData.stats.BucksTipped,
		earned: profileData.stats.TipsGotten
	};
	app.playerData.profile = profile;
}

async function getUserLevels(userId) {
	let levels = [];
	let levelData = await rce.levelhead.levels.search(
		{ userIds: userId, limit: limit, sort: 'createdAt' },
		{ doNotUseKey: true }
	);
	levels = [ ...levelData ];
	while (levelData.length === limit) {
		levelData = await levelData.nextPage();
		levels.push(...levelData);
	}

	app.playerData.levels = levels;
}
