<template>
  <div id="player">
    <main style="display: flex;">
      <div>
        <img :src="levelData.avatarUrl()" alt="Avatar" />
        <h1>{{ levelData.title }} @{{ levelData.levelId }}</h1>
        <h2>
          By {{ levelData.alias.alias }}
          <router-link :to="`/player/${levelData.alias.userId}`">
            @{{ levelData.alias.userId }}
          </router-link>
        </h2>
        <table>
          <tr>
            <td>Attempts:</td>
            <td>{{ format(levelData.stats.Attempts, 1) }}</td>
          </tr>
          <tr>
            <td>Favorites:</td>
            <td>{{ format(levelData.stats.Favorites, 1) }}</td>
          </tr>
          <tr>
            <td>Likes:</td>
            <td>{{ format(levelData.stats.Likes, 1) }}</td>
          </tr>
          <tr>
            <td>PlayTime:</td>
            <td>{{ format(levelData.stats.PlayTime, 3) }}</td>
          </tr>
          <tr>
            <td>Players:</td>
            <td>{{ format(levelData.stats.Players, 1) }}</td>
          </tr>
          <tr>
            <td>ReplayValue:</td>
            <td>{{ format(levelData.stats.ReplayValue, 1) }}</td>
          </tr>
          <tr>
            <td>ClearRate:</td>
            <td>{{ format(levelData.stats.ClearRate, 2) }}</td>
          </tr>
          <tr>
            <td>Diamonds:</td>
            <td>{{ levelData.stats.Diamonds }}</td>
          </tr>
          <tr>
            <td>Successes:</td>
            <td>{{ format(levelData.stats.Successes, 1) }}</td>
          </tr>
          <tr>
            <td>TimePerWin:</td>
            <td>{{ format(levelData.stats.TimePerWin, 3) }}</td>
          </tr>
          <tr>
            <td>ExposureBucks:</td>
            <td>{{ format(levelData.stats.ExposureBucks, 1) }}</td>
          </tr>
          <tr>
            <td>FailureRate:</td>
            <td>{{ format(levelData.stats.FailureRate, 2) }}</td>
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
import { LevelheadLevel } from "../scripts/rumpus-ce-develop/types/levels";

const token = "3SAPr11y13BiM7xk";
const rce = new RumpusCE(token);

@Component
export default class PlayerView extends Vue {
  levelData: LevelheadLevel = {};

  mounted() {
    this.levelData.levelId = this.$route.params.id;
    this.updateData();
  }

  @Watch("$route.params.id")
  updatePlayer() {
    this.levelData.levelId = this.$route.params.id;
    this.updateData();
  }

  updateData() {
    if (this.levelData.levelId.length === 7) {
      this.getUserLevel(this.levelData.levelId);
    }
  }

  async getUserLevel(levelId: string) {
    const levelData = await rce.levelhead.levels.search(
      { levelIds: levelId, limit: 1, includeAliases: true, includeStats: true },
      { doNotUseKey: true }
    );

    this.levelData = levelData[0];
  }

  format(data: string, formatCode: number) {
    return format(data, formatCode);
  }
}
</script>

<style></style>
