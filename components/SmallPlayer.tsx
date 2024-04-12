import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import Slider from "@react-native-community/slider";
import { Player } from "./icons/play";
import { Pause } from "./icons/pause";

import { DownloadItem, getDownloads } from "@/utils/downloads";

export const SmallPlayer = () => {
  const shouldPlay = false;
  const isLoading = false;
  const [index, setIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const isSeeking = useRef(false);
  const shouldPlayAtEndOfSeek = useRef(false);

  useEffect(() => {
    (async () => {
      const downloads = await getDownloads();
      setDownloads(downloads);
    })();
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });

    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    if (!sound) {
      const { sound: playingSound, status }: any =
        await Audio.Sound.createAsync(
          { uri: downloads[index].uri },
          { shouldPlay: true, isLooping: false },
          onPlaybackStatusUpdate
        );
      setSound(playingSound);
      setIsPlaying(true);
      setDuration(status.durationMillis);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
    }
  };

  const currentSeconds = position > 0 ? Math.floor(position / 1000) : 0;
  const totalSeconds = duration > 0 ? Math.floor(duration / 1000) : 0;

  const getSeekSliderPosition = () => {
    if (sound != null && position != null && duration != null) {
      return position / duration;
    }
    return 0;
  };

  const onValueChange = (value: any) => {
    if (sound != null && !isSeeking.current) {
      isSeeking.current = true;
      shouldPlayAtEndOfSeek.current = shouldPlay;
      sound.pauseAsync();
    }
  };

  const onSlidingComplete = async (value: any) => {
    if (sound != null) {
      isSeeking.current = false;
      const seekPosition = value * duration;
      if (shouldPlayAtEndOfSeek) {
        sound.playFromPositionAsync(seekPosition);
      } else {
        sound.setPositionAsync(seekPosition);
      }
    }
  };
  console.log(downloads);
  return (
    <View style={styles.container}>
      <FlatList
        data={downloads}
        renderItem={({ item: downloads }) => (
          <View>
            <View style={styles.itng}>
              <TouchableOpacity>
                <Text>{downloads.title}</Text>
                <Text>{downloads.uri}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text>Audio Example</Text>

      <Slider
        style={styles.playbackSlider}
        value={getSeekSliderPosition()}
        onValueChange={onValueChange}
        onSlidingComplete={onSlidingComplete}
        disabled={isLoading}
        
      />
      <View>
        <Text>
          {currentSeconds} / {totalSeconds}
        </Text>
        <Text></Text>
      </View>
      {!isPlaying ? (
        <TouchableOpacity onPress={playSound}>
          <Player />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={pauseSound}>
          <Pause />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  slider: {
    width: 200,
    marginTop: 20,
  },
  playbackSlider: {
    alignSelf: "stretch",
  },

  item: {
    fontSize: 15,
    width: 250,
  },
  itng: {
    display: "flex",
    flexDirection: "row",
    width: 390,
    justifyContent: "space-between",
  },
});
