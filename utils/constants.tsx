import { Dimensions } from "react-native";

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } =
  Dimensions.get("window");
export const BACKGROUND_COLOR = "#FFF8ED";
export const DISABLED_OPACITY = 0.5;
export const FONT_SIZE = 14;
export const LOADING_STRING = "... loading ...";
export const BUFFERING_STRING = "...buffering...";
export const RATE_SCALE = 3.0;
export const VIDEO_CONTAINER_HEIGHT =
  (DEVICE_HEIGHT * 2.0) / 5.0 - FONT_SIZE * 2;
export const ICON_THROUGH_EARPIECE = "speaker-phone";
export const ICON_THROUGH_SPEAKER = "speaker";
export const LOOPING_TYPE_ALL = 0;
export const LOOPING_TYPE_ONE = 1;
