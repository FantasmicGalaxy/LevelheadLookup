import { Alias } from "../scripts/rumpus-ce-develop/types/aliases";
import { LevelheadPlayer } from "../scripts/rumpus-ce-develop/types/players";
import { LevelheadLevelKeyed } from "./level";

export interface PlayerData {
  alias: Alias;
  profile: LevelheadPlayer;
  levels: LevelheadLevelKeyed[];
}
