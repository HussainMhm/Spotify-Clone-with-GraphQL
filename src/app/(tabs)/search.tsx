import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TextInput,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { gql, useQuery } from "@apollo/client";
import { FontAwesome } from "@expo/vector-icons";
import TrackListItem from "../../components/TrackListItem";

const query = gql`
    query MyQuery($q: String!) {
        search(q: $q) {
            tracks {
                items {
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
    }
`;

export default function SearchScreen() {
    const [search, setSearch] = useState("");

    const { data, loading, error } = useQuery(query, {
        variables: { q: search },
    });

    const tracks = data?.search?.tracks?.items || [];

    return (
        <SafeAreaView>
            {/* Header */}
            <View style={styles.header}>
                <FontAwesome name="search" size={16} color="gray" />
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="What do you want to listen to?"
                    style={styles.input}
                />
                <Text
                    onPress={() => {
                        Keyboard.dismiss();
                        setSearch("");
                    }}
                    style={{ color: "white" }}
                >
                    Cancel
                </Text>
            </View>

            {/* Loading Indicator */}
            {loading && <ActivityIndicator size="large" color="#1DB954" />}

            {/* Error */}
            {search && error && <Text style={{ color: "white" }}>Failed to fetch tracks</Text>}

            {/* Search Results */}
            <FlatList
                data={tracks}
                renderItem={({ item }) => <TrackListItem track={item} />}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#000",
    },
    input: {
        flex: 1,
        backgroundColor: "#121314",
        padding: 8,
        marginHorizontal: 10,
        borderRadius: 5,
        color: "white",
    },
});
