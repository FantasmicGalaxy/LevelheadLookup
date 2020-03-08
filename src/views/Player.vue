<template>
  <div id="player">
    <main style="display: flex;">
      <div>
        <img :src="playerData.alias.avatarUrl" alt="Avatar" />
        <h1>{{ playerData.alias.alias }}@{{ playerData.alias.id }}</h1>
        <table>
          <tr>
            <td>Followers:</td>
            <td>{{ playerData.profile.followers }}</td>
          </tr>
          <tr>
            <td>Following:</td>
            <td>{{ playerData.profile.following }}</td>
          </tr>
          <tr>
            <td>Shipped:</td>
            <td>{{ playerData.profile.shipped }}</td>
          </tr>
          <tr>
            <td>Played:</td>
            <td>{{ playerData.profile.played }}</td>
          </tr>
          <tr>
            <td>Shoes:</td>
            <td>{{ playerData.profile.shoes }}</td>
          </tr>
          <tr>
            <td>Ribbons:</td>
            <td>{{ playerData.profile.ribbons }}</td>
          </tr>
          <tr>
            <td>Training:</td>
            <td>{{ playerData.profile.training }}</td>
          </tr>
          <tr>
            <td>Plays Generated:</td>
            <td>{{ playerData.profile.playsGen }}</td>
          </tr>
          <tr>
            <td>Playtime Generated:</td>
            <td>{{ playerData.profile.playtimeGen }}</td>
          </tr>
          <tr>
            <td>Daily Builds Completed:</td>
            <td>{{ playerData.profile.builds }}</td>
          </tr>
          <tr>
            <td>Wins:</td>
            <td>{{ playerData.profile.wins }}</td>
          </tr>
          <tr>
            <td>Fails:</td>
            <td>{{ playerData.profile.fails }}</td>
          </tr>
          <tr>
            <td>Tower Trials Completed:</td>
            <td>{{ playerData.profile.trials }}</td>
          </tr>
          <tr>
            <td>Trophies:</td>
            <td>{{ playerData.profile.trophies }}</td>
          </tr>
          <tr>
            <td>Tipped:</td>
            <td>{{ playerData.profile.tipped }}</td>
          </tr>
          <tr>
            <td>Earned:</td>
            <td>{{ playerData.profile.earned }}</td>
          </tr>
        </table>
      </div>

      <h1></h1>

      <div>
        <table>
          <tr v-for="level in playerData.levels" :key="level">
            <td>{{ level.title }}</td>
            <td>{{ level.levelId }}</td>
            <td>{{ level.createdAt }}</td>
          </tr>
        </table>
      </div>
    </main>
  </div>
</template>

<script>
import RumpusCE from "@bscotch/rumpus-ce/build/index";

const token = "3SAPr11y13BiM7xk";
const rce = new RumpusCE(token);

const playerData = {
  alias: {
    id: ""
  },
  profile: {},
  levels: []
};

const limit = 10;

async function getUserAlias(userId) {
  let aliasData = await rce.levelhead.aliases.search(
    userId,
    {},
    { doNotUseKey: true }
  );
  aliasData = aliasData[0];

  const alias = {
    id: await aliasData.userId,
    alias: aliasData.alias,
    avatarId: aliasData.avatarId,
    avatarUrl: aliasData.avatarUrl()
  };
  playerData.alias = alias;
}

async function getUserProfile(userId) {
  let profileData = await rce.levelhead.players.search(
    { userIds: userId },
    { doNotUseKey: true }
  );
  profileData = profileData[0];

  const profile = {
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
  playerData.profile = profile;
}

async function getUserLevels(userId) {
  let levels = [];
  let levelData = await rce.levelhead.levels.search(
    { userIds: userId, limit: limit, sort: "createdAt" },
    { doNotUseKey: true }
  );
  levels = [...levelData];
  while (levelData.length === limit) {
    levelData = await levelData.nextPage();
    levels.push(...levelData);
  }

  playerData.levels = levels;
}

export default {
  data() {
    return {
      playerData
    };
  },
  methods: {
    updateData() {
      if (this.playerData.alias.id.length >= 6) {
        getUserAlias(this.playerData.alias.id);
        getUserProfile(this.playerData.alias.id);
        getUserLevels(this.playerData.alias.id);
      }
    }
    // format(data, format) {
    //   switch (format) {
    //     case 0:
    //       return data;
    //     case 1:
    //       return utils.formatCommas(data);
    //     case 2:
    //       return utils.formatTime(data);
    //     case 3:
    //       return utils.formatPercent(data);
    //     case 4:
    //       return utils.formatDate(data);
    //     default:
    //       return data;
    //   }
    // }
  },
  mounted() {
    this.playerData.alias.id = this.$route.params.id;
    this.updateData();
  },
  watch: {
    "$route.params.id": function(id) {
      this.playerData.alias.id = this.$route.params.id;
      this.updateData();
    }
  }
};

//formats: {
//  none: 0,
//  comma: 1,
//  percent: 2,
//  time: 3,
//  date: 4
//}
</script>

<style></style>
