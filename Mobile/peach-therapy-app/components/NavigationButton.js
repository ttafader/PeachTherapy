import react from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function NavButton({ navigation, pageName, destination }) {
    return (
        <View style={{

        }}>
            <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center", width: 100, height: 50, margin: 5, backgroundColor: "#c9c9c9", padding: 10, borderRadius: 25 }}
                onPress={() => navigation.navigate(destination)}>
                <Text style={{ fontWeight: "600" }}>{pageName}</Text>
            </TouchableOpacity>
        </View >
    )
}
