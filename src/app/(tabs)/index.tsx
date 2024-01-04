import { View, StyleSheet, FlatList, Text, ActivityIndicator } from "react-native";
import { gql, useQuery } from "@apollo/client";
import TrackListItem from "../../components/TrackListItem";

const query = gql`
    query MyQuery($genres: String!) {
        recommendations(seed_genres: $genres) {
            tracks {
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

export default function HomeScreen() {
    const { data, loading, error } = useQuery(query, {
        variables: {
            // Change this to a genre of your choice!
            genres: "rock",
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
                <Text style={{ color: "white" }}>Failed to fetch recommendations</Text>
            </View>
        );
    }

    const tracks = data?.recommendations?.tracks || [];

    return (
        <FlatList
            data={tracks}
            renderItem={({ item }) => <TrackListItem track={item} />}
            showsVerticalScrollIndicator={false}
        />
    );
}
