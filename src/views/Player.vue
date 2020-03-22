<template>
  <div id="player">
    <main style="display: flex;">
      <div>
        <img :src="playerData.alias.avatarUrl()" alt="Avatar" />
        <h1>{{ playerData.alias.alias }}@{{ playerData.alias.userId }}</h1>
        <table>
          <tr>
            <td>Followers:</td>
            <td>{{ format(playerData.profile.stats.Subscribers, 1) }}</td>
          </tr>
          <tr>
            <td>Following:</td>
            <td>{{ format(playerData.profile.stats.NumFollowing, 1) }}</td>
          </tr>
          <tr>
            <td>Levels Shipped:</td>
            <td>{{ format(playerData.profile.stats.Published, 1) }}</td>
          </tr>
          <tr>
            <td>Levels Played:</td>
            <td>{{ format(playerData.profile.stats.LevelsPlayed, 1) }}</td>
          </tr>
          <tr>
            <td>Shoes:</td>
            <td>{{ format(playerData.profile.stats.Shoes, 1) }}</td>
          </tr>
          <tr>
            <td>Ribbons:</td>
            <td>{{ format(playerData.profile.stats.Crowns, 1) }}</td>
          </tr>
          <tr>
            <td>Training Progress:</td>
            <td>{{ format(playerData.profile.stats.CampaignProg, 2) }}</td>
          </tr>
          <tr>
            <td>Plays Generated:</td>
            <td>{{ format(playerData.profile.stats.Plays, 1) }}</td>
          </tr>
          <tr>
            <td>Playtime Generated:</td>
            <td>{{ format(playerData.profile.stats.PlayTime, 3) }}</td>
          </tr>
          <tr>
            <td>Daily Builds Completed:</td>
            <td>{{ format(playerData.profile.stats.DBComp, 1) }}</td>
          </tr>
          <tr>
            <td>Wins:</td>
            <td>{{ format(playerData.profile.stats.Wins, 1) }}</td>
          </tr>
          <tr>
            <td>Fails:</td>
            <td>{{ format(playerData.profile.stats.Fails, 1) }}</td>
          </tr>
          <tr>
            <td>Tower Trials Completed:</td>
            <td>{{ format(playerData.profile.stats.ChalWins, 1) }}</td>
          </tr>
          <tr>
            <td>Trophies:</td>
            <td>{{ format(playerData.profile.stats.TimeTrophies, 1) }}</td>
          </tr>
          <tr>
            <td>Tipped:</td>
            <td>{{ format(playerData.profile.stats.BucksTipped, 1) }}</td>
          </tr>
          <tr>
            <td>Earned:</td>
            <td>{{ format(playerData.profile.stats.TipsGotten, 1) }}</td>
          </tr>
        </table>
      </div>

      <div>
        <table>
          <tr v-for="keyedLevel in playerData.levels" :key="keyedLevel.key">
            <td>{{ keyedLevel.level.title }}</td>
            <td>{{ keyedLevel.level.levelId }}</td>
            <td>{{ format(keyedLevel.level.createdAt, 4) }}</td>
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

import { format } from "../scripts/utils/formatting";
import { PlayerData } from "../types/player";
import { LevelheadLevel } from "../scripts/rumpus-ce-develop/types/levels";
import { LevelheadLevelKeyed } from "../types/level";

const token = "3SAPr11y13BiM7xk";
const rce = new RumpusCE(token);

@Component
export default class PlayerView extends Vue {
  playerData: PlayerData = {
    alias: {
      userId: "",
      alias: "",
      context: "",
      avatarId: "",
      avatarUrl() {
        return "";
      }
    },
    profile: {
      _id: "",
      userId: "",
      alias: {
        userId: "",
        alias: "",
        context: "",
        avatarId: "",
        avatarUrl() {
          return "";
        }
      },
      createdAt: "",
      updatedAt: "",
      stats: {
        Subscribers: 0,
        Published: 0,
        Plays: 0,
        PlayTime: 0,
        Crowns: 0,
        Shoes: 0,
        LevelsPlayed: 0,
        Wins: 0,
        Fails: 0,
        NumFollowing: 0,
        DBComp: 0,
        ChalWins: 0,
        TimeTrophies: 0,
        FaveGen: 0,
        LikeGen: 0,
        BucksTipped: 0,
        TipsGotten: 0,
        AchPoints: 0,
        CampaignProg: 0
      }
    },
    levels: []
  };

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
      this.getUserLevels(this.playerData.alias.userId, 64);
    }
  }

  async getUserAlias(userId: string) {
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

  async getUserLevels(userId: string, limit: number) {
    const levels: LevelheadLevel[] = [];

    let levelData = await rce.levelhead.levels.search(
      { userIds: userId, limit: limit, sort: "createdAt" },
      { doNotUseKey: true }
    );
    levels.push(...levelData);

    while (levelData.length === limit) {
      levelData = await levelData.nextPage();
      levels.push(...levelData);
    }

    const keyedLevels: LevelheadLevelKeyed[] = [];

    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      level.title = level.title.replace("Balloog", "Hardlight");
      keyedLevels.push({ level: level, key: i });
    }
    this.playerData.levels = keyedLevels;
  }

  format(data: string, formatCode: number) {
    return format(data, formatCode);
  }
}
</script>

<style></style>
