import { View, StyleSheet, FlatList, Text, ActivityIndicator } from "react-native";
import { tracks } from "../../../assets/data/tracks";
import TrackListItem from "../../components/TrackListItem";
import { gql, useQuery } from "@apollo/client";

const query = gql`
    query getFavorites($userId: String!) {
        favoritesByUserid(userid: $userId) {
            id
            trackid
            userid
            track {
                id
                name
                preview_url
                artists {
                    id
                    name
                }
                album {
                    id
                    name
                    images {
                        url
                        width
                        height
                    }
                }
            }
        }
    }
`;

export default function FavoritesScreen() {
    const { data, loading, error } = useQuery(query, {
        variables: {
            userId: "Hussain",
        },
    });

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }

    if (error) {
        console.error(error);
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "white" }}>Failed to fetch favorites</Text>
            </View>
        );
    }

    const tracks = data?.favoritesByUserid?.map((fav: any) => fav.track) || [];

    return (
        <FlatList
            data={tracks}
            renderItem={({ item }) => <TrackListItem track={item} />}
            showsVerticalScrollIndicator={false}
        />
    );
}
