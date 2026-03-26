import { View, Text as RNText } from "react-native";
import { useTheme } from "@/contexts";

interface SpeechBubbleProps {
  text: string;
  direction?: "bottom" | "left";
}

export function SpeechBubble({
  text,
  direction = "bottom",
}: SpeechBubbleProps) {
  const { theme } = useTheme();
  const bgColor = theme.colors.primary + "18";

  if (direction === "left") {
    return (
      <View className="z-10">
        <View
          className="rounded-2xl px-4 py-2"
          style={{ backgroundColor: bgColor }}
        >
          <RNText
            className="font-body-regular text-body-xs"
            style={{ color: theme.colors.primary }}
          >
            {text}
          </RNText>
          <View
            style={{
              position: "absolute",
              top: 10,
              left: -10,
              width: 0,
              height: 0,
              borderTopWidth: 8,
              borderBottomWidth: 8,
              borderRightWidth: 10,
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
              borderRightColor: bgColor,
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      className="absolute z-10 items-center left-0 right-0"
      style={{ top: 50 }}
    >
      <View
        className="rounded-2xl px-4 py-2"
        style={{ backgroundColor: bgColor }}
      >
        <RNText
          className="font-body-regular text-body-lg text-center"
          style={{ color: theme.colors.primary }}
        >
          {text}
        </RNText>
        <View
          style={{
            position: "absolute",
            bottom: -10,
            left: "40%",
            width: 0,
            height: 0,
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderTopWidth: 10,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderTopColor: bgColor,
          }}
        />
      </View>
    </View>
  );
}
