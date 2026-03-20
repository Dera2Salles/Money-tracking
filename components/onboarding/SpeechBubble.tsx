import { View, Text as RNText } from 'react-native';
import { useTheme } from '@/contexts';

interface SpeechBubbleProps {
  text: string;
  direction?: 'bottom' | 'left';
}

export function SpeechBubble({ text, direction = 'bottom' }: SpeechBubbleProps) {
  const { theme } = useTheme();
  const bgColor = theme.colors.primary + '18';

  return (
    <View className={direction === 'bottom' ? 'items-center mb-[-8px] z-10' : 'z-10'}>
      <View
        className="rounded-2xl px-5 py-3"
        style={{ backgroundColor: bgColor }}
      >
        <RNText
          className={
            direction === 'bottom'
              ? 'font-display text-display-md text-center'
              : 'font-body-regular text-body-sm'
          }
          style={{ color: theme.colors.primary }}
        >
          {text}
        </RNText>

        {direction === 'bottom' ? (
          <View
            style={{
              position: 'absolute',
              bottom: -10,
              left: '40%',
              width: 0,
              height: 0,
              borderLeftWidth: 10,
              borderRightWidth: 10,
              borderTopWidth: 10,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: bgColor,
            }}
          />
        ) : (
          <View
            style={{
              position: 'absolute',
              top: 10,
              left: -10,
              width: 0,
              height: 0,
              borderTopWidth: 8,
              borderBottomWidth: 8,
              borderRightWidth: 10,
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderRightColor: bgColor,
            }}
          />
        )}
      </View>
    </View>
  );
}
