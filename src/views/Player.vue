<template>
  <div id="player">
    <main style="display: flex;">
      <div>
        <img :src="playerData.alias.avatarUrl()" alt="Avatar" />
        <h1>{{ playerData.alias.alias }}@{{ playerData.alias.userId }}</h1>
        <table>
          <tr>
            <td>Followers:</td>
            <td>{{ playerData.profile.stats.Subscribers }}</td>
          </tr>
          <tr>
            <td>Following:</td>
            <td>{{ playerData.profile.stats.NumFollowing }}</td>
          </tr>
          <tr>
            <td>Levels Shipped:</td>
            <td>{{ playerData.profile.stats.Published }}</td>
          </tr>
          <tr>
            <td>Levels Played:</td>
            <td>{{ playerData.profile.stats.LevelsPlayed }}</td>
          </tr>
          <tr>
            <td>Shoes:</td>
            <td>{{ playerData.profile.stats.Shoes }}</td>
          </tr>
          <tr>
            <td>Ribbons:</td>
            <td>{{ playerData.profile.stats.Crowns }}</td>
          </tr>
          <tr>
            <td>Training:</td>
            <td>{{ playerData.profile.stats.CampaignProg }}</td>
          </tr>
          <tr>
            <td>Plays Generated:</td>
            <td>{{ playerData.profile.stats.Plays }}</td>
          </tr>
          <tr>
            <td>Playtime Generated:</td>
            <td>{{ playerData.profile.stats.PlayTime }}</td>
          </tr>
          <tr>
            <td>Daily Builds Completed:</td>
            <td>{{ playerData.profile.stats.DBComp }}</td>
          </tr>
          <tr>
            <td>Wins:</td>
            <td>{{ playerData.profile.stats.Wins }}</td>
          </tr>
          <tr>
            <td>Fails:</td>
            <td>{{ playerData.profile.stats.Fails }}</td>
          </tr>
          <tr>
            <td>Tower Trials Completed:</td>
            <td>{{ playerData.profile.stats.ChalWins }}</td>
          </tr>
          <tr>
            <td>Trophies:</td>
            <td>{{ playerData.profile.stats.TimeTrophies }}</td>
          </tr>
          <tr>
            <td>Tipped:</td>
            <td>{{ playerData.profile.stats.BucksTipped }}</td>
          </tr>
          <tr>
            <td>Earned:</td>
            <td>{{ playerData.profile.stats.TipsGotten }}</td>
          </tr>
        </table>
      </div>

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

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import RumpusCE from "../scripts/rumpus-ce-develop/index";
import { Alias } from "../scripts/rumpus-ce-develop/types/aliases";
import { LevelheadPlayer } from "../scripts/rumpus-ce-develop/types/players";
import { LevelheadLevel } from "../scripts/rumpus-ce-develop/types/levels";

const token = "3SAPr11y13BiM7xk";
const rce = new RumpusCE(token);

// class PlayerInfo {
//   constructor(alias: Alias, profile: LevelheadPlayer, levels: LevelheadLevel) {

//   }
// }

interface PlayerData {
  alias: Alias;
  profile: LevelheadPlayer;
  levels: LevelheadLevel[];
}

const limit = 10;

@Component
export default class PlayerView extends Vue {
  playerData: PlayerData = { alias: {}, profile: {}, levels: {} };

  mounted() {
    this.playerData.alias.userId = this.$route.params.id;
    this.updateData();
  }

  @Watch("$route.params.id")
  updatePlayer() {
    this.playerData.alias.userId = this.$route.params.id;
    this.updateData();
  }

  updateData() {
    if (this.playerData.alias.userId.length >= 6) {
      this.getUserAlias(this.playerData.alias.userId);
      this.getUserProfile(this.playerData.alias.userId);
      this.getUserLevels(this.playerData.alias.userId);
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

  async getUserAlias(userId: string) {
    // const search: AliasSearch = { userIds: '3719xx' };

    const aliasData = await rce.levelhead.aliases.search(
      userId,
      { userIds: userId },
      { doNotUseKey: true }
    );

    this.playerData.alias = aliasData[0];
  }

  async getUserProfile(userId: string) {
    const profileData = await rce.levelhead.players.search(
      { userIds: userId },
      { doNotUseKey: true }
    );

    this.playerData.profile = profileData[0];
  }

  async getUserLevels(userId: string) {
    // let levels = [];
    // let levelData = await rce.levelhead.levels.search(
    //   { userIds: userId, limit: limit, sort: "createdAt" },
    //   { doNotUseKey: true }
    // );
    // levels = [...levelData];
    // while (levelData.length === limit) {
    //   levelData = await levelData.nextPage();
    //   levels.push(...levelData);
    // }

    // this.playerData.levels = levels;

    const levelData = await rce.levelhead.levels.search(
      { userIds: userId, limit: limit, sort: "createdAt" },
      { doNotUseKey: true }
    );
    this.playerData.levels = levelData;
  }
}

//formats: {
//  none: 0,
//  comma: 1,
//  percent: 2,
//  time: 3,
//  date: 4
//}
</script>

<style></style>
