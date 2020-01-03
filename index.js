const token = '3SAPr11y13BiM7xk';
const rce = new RumpusCE(token);

const id = 'zchv6z';

let app = new Vue({
	el: '#app',
	data: {
		userInfo: {}
	}
});

function numberWithCommas(number) {
	var parts = number.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

async function getUserData(userId) {
	let userInfo = await rce.levelhead.aliases.search(userId, {}, { doNotUseKey: true });
	return await userInfo;
}

async function getUserStats(userId) {
	let userStats = await rce.levelhead.profiles.search({ userIds: userId }, { doNotUseKey: true });
	return await userStats;
}

async function getUserInfo(userId) {
	let userData, userStats;
	try {
		userData = await getUserData(userId);
		userStats = await getUserStats(userId);
	} catch (error) {
		console.error(`ERROR: ${error}`);
	}

	let userInfo = {
		id: userData[0].userId,
		alias: userData[0].alias,
		avatar: userData[0].avatarId,
		followers: userStats[0].stats.Subscribers,
		following: userStats[0].stats.NumFollowing,
		shipped: userStats[0].stats.Published,
		played: userStats[0].stats.LevelsPlayed,
		shoes: userStats[0].stats.Shoes,
		ribbons: userStats[0].stats.Crowns,
		training: userStats[0].stats.CampaignProg,
		playsGen: userStats[0].stats.Plays,
		playtimeGen: userStats[0].stats.PlayTime,
		builds: userStats[0].stats.DBComp,
		wins: userStats[0].stats.Wins,
		fails: userStats[0].stats.Fails,
		trials: userStats[0].stats.ChalWins,
		trophies: userStats[0].stats.TimeTrophies,
		tipped: userStats[0].stats.BucksTipped,
		earned: userStats[0].stats.TipsGotten
	};

	app.userInfo = userInfo;
}

getUserInfo(id);
