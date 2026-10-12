import { TextInput, View } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider"; 
import { Icon } from "./Icon";

export function SearchBar({ value, onChangeText, placeholder }) {
    const { colors } = useAppTheme();
    return (
        <View className="min-h-[48px] flex-row items-center gap-2.5 rounded-xl bg-surface px-3.5">
            <Icon name="search" size={18} color={colors.ink.muted} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.ink.muted}
                autoCorrect={false}
                returnKeyType="search"
                clearButtonMode="while-editing"
                className="flex-1 text-[15px] text-ink"
            />
        </View>
    );
}
