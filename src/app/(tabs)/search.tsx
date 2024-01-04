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
import { FontAwesome } from "@expo/vector-icons";
import TrackListItem from "../../components/TrackListItem";
import { tracks } from "../../../assets/data/tracks";

export default function SearchScreen() {
    const [search, setSearch] = useState("");

    return (
        <SafeAreaView>
            <View style={styles.header}>
                {/* Header */}
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
