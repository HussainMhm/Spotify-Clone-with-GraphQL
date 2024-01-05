import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerContext } from "../providers/PlayerProvider";
import { useEffect, useState } from "react";
import { AVPlaybackSource, AVPlaybackStatus, Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { gql, useMutation, useQuery } from "@apollo/client";

const insertFavoriteMutation = gql`
    mutation MyMutation($userid: String!, $trackid: String!) {
        insertFavorites(trackid: $trackid, userid: $userid) {
            id
            trackid
            userid
        }
    }
`;

const removeFavoriteMutation = gql`
    mutation MyMutation($trackId: String!, $userId: String!) {
        deleteFavorites(trackid: $trackId, userid: $userId) {
            id
        }
    }
`;

const isFavoriteQuery = gql`
    query MyQuery($trackId: String!, $userId: String!) {
        favoritesByTrackidAndUserid(trackid: $trackId, userid: $userId) {
            id
            trackid
            userid
        }
    }
`;

const Player = () => {
    const [sound, setSound] = useState<Sound>();
    const [isPlaying, setIsPlaying] = useState(false);
    const { track } = usePlayerContext();

    const [insertFavorite] = useMutation(insertFavoriteMutation);
    const [removeFavorite] = useMutation(removeFavoriteMutation);

    const { data: favoritedData, refetch } = useQuery(isFavoriteQuery, {
        variables: {
            trackId: track?.id || "",
            userId: "Hussain",
        },
    });
    const isLiked = favoritedData?.favoritesByTrackidAndUserid?.length > 0;

    // Play track when it changes
    useEffect(() => {
        playTrack();
    }, [track]);

    // Unload sound when component unmounts
    useEffect(() => {
        return sound
            ? () => {
                  console.log("Unloading Sound");
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    // Play track
    const playTrack = async () => {
        if (sound) {
            await sound?.unloadAsync();
        }

        if (!track?.preview_url) {
            return;
        }
        console.log("Playing track: ", track?.name);
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: track?.preview_url });

        setSound(newSound);
        newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        await newSound?.playAsync();
    };

    // Update isPlaying state
    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        // console.log(status);
        if (!status.isLoaded) {
            return;
        }

        setIsPlaying(status.isPlaying);
    };

    // Pause track
    const onPlayPause = async () => {
        if (!sound) {
            return;
        }

        if (isPlaying) {
            await sound?.pauseAsync();
        } else {
            await sound?.playAsync();
        }
    };

    // Like track
    const onLike = async () => {
        if (!track) return;

        if (isLiked) {
            await removeFavorite({ variables: { userId: "Hussain", trackId: track.id } });
        } else {
            await insertFavorite({ variables: { userid: "Hussain", trackid: track.id } });
        }
        refetch();
    };

    // Render nothing if no track
    if (!track) {
        return null;
    }

    // Get image
    const image = track.album.images?.[0];

    return (
        <View style={styles.container}>
            <View style={styles.player}>
                {image && <Image source={{ uri: image.url }} style={styles.image} />}

                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{track.name}</Text>
                    <Text style={styles.subtitle}>{track.artists[0]?.name}</Text>
                </View>

                <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={20}
                    color={"white"}
                    style={{ marginHorizontal: 10 }}
                    onPress={onLike}
                />
                <Ionicons
                    onPress={onPlayPause}
                    name={isPlaying ? "pause" : "play"}
                    disabled={!track?.preview_url}
                    size={22}
                    color={track?.preview_url ? "white" : "gray"}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: -75,
        width: "100%",
        height: 75,
        padding: 10,
    },
    player: {
        backgroundColor: "#286660",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        padding: 3,
        paddingRight: 15,
    },
    title: {
        color: "white",
    },
    subtitle: {
        color: "lightgray",
        fontSize: 12,
    },
    image: {
        height: "100%",
        aspectRatio: 1,
        marginRight: 10,
        borderRadius: 5,
    },
});

export default Player;
