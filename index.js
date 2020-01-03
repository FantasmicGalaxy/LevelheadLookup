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
	let parts = number.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

function secondsToTime(seconds) {
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
		followers: numberWithCommas(userStats[0].stats.Subscribers),
		following: numberWithCommas(userStats[0].stats.NumFollowing),
		shipped: numberWithCommas(userStats[0].stats.Published),
		played: numberWithCommas(userStats[0].stats.LevelsPlayed),
		shoes: numberWithCommas(userStats[0].stats.Shoes),
		ribbons: numberWithCommas(userStats[0].stats.Crowns),
		training: numberWithCommas(userStats[0].stats.CampaignProg),
		playsGen: numberWithCommas(userStats[0].stats.Plays),
		playtimeGen: secondsToTime(userStats[0].stats.PlayTime),
		builds: numberWithCommas(userStats[0].stats.DBComp),
		wins: numberWithCommas(userStats[0].stats.Wins),
		fails: numberWithCommas(userStats[0].stats.Fails),
		trials: numberWithCommas(userStats[0].stats.ChalWins),
		trophies: numberWithCommas(userStats[0].stats.TimeTrophies),
		tipped: numberWithCommas(userStats[0].stats.BucksTipped),
		earned: numberWithCommas(userStats[0].stats.TipsGotten)
	};

	app.userInfo = userInfo;
}

getUserInfo(id);
