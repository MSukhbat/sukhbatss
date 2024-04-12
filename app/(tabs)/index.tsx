import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TextInput,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { addDownload } from "@/utils/downloads";
const getFormattedDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds}`;
};

const getFormattedFileSize = (size: number) => {
  const mbs = size / (1024 * 1024);
  return `${mbs.toFixed(2)} MB`;
};
export default function TabOneScreen() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [video, setVideo] = useState<any>(null);
  const [name, setName] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);

  const getYouTubeVideoId = (url: string) => {
    const split =
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(split);
    return match && match[1] ? match[1] : null;
  };

  useEffect(() => {
    const extractedId = getYouTubeVideoId(name);
    setVideoId(extractedId);
  }, [name]);

  const postData = async () => {
    try {
      const response = await axios.post(
        "https://youtube-mp3-downloader-phi.vercel.app/api/youtube",
        { id: videoId }
      );
      setVideo(response.data?.response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleDownload = async () => {
    const { link, title } = video;
    const path = FileSystem.documentDirectory + `/${encodeURI(title)}.mp3`;
    const downloadResumable = FileSystem.createDownloadResumable(
      link,
      path,
      {},
      (downloadProgress) => {
        const progress = Number(
          (downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite) *
            100
        ).toFixed(1);
        setProgress(Number(progress));
      }
    );
    if (downloadResumable.savable()) {
      setIsDownloading(true);
      const downloadedFile = await downloadResumable
        .downloadAsync()
        .finally(() => {
          setIsDownloading(false);
          setIsDownloaded(true);
        });
      if (downloadedFile) {
        const uri = downloadedFile.uri;
        await addDownload({ title, uri });
      }
    }
  };
  console.log(video);
  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter YouTube URL"
      />

      <Button title="Download Video as MP3" onPress={postData} />
      {videoId && <Text> ID: {videoId},</Text>}
      {video && (
        <>
          <View style={{ marginTop: 20 }}>
            <Text>Title: {video.title}</Text>
            <Text>Duration: {getFormattedDuration(video.duration)}</Text>
            <Text>Size: {getFormattedFileSize(video.filesize)}</Text>
            {isDownloaded && <Text>Downloaded</Text>}
            {isDownloading && <Text>Downloading {progress}%</Text>}
            {!isDownloaded && !isDownloading && (
              <Button title="Download" onPress={handleDownload} />
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
