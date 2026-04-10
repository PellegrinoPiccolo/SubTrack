import React from 'react'
import { Image, View } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { ImageForCategory } from '../constants/ImageForCategory'

// ---------------------------------------------------------------------------
// Error boundary — catches invalid icon names that cause a render error and
// replaces them with a safe fallback icon.
// ---------------------------------------------------------------------------
interface BoundaryState { hasError: boolean }

class IconErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  BoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Renders the actual library icon. Isolated so the error boundary wraps only
// this piece and the rest of the container stays intact.
// ---------------------------------------------------------------------------
interface RawIconProps {
  iconName: string;
  iconLibrary?: string | null;
  iconSize: number;
}

const RawIcon = ({ iconName, iconLibrary, iconSize }: RawIconProps) => {
  if (iconLibrary === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={iconName as any} size={iconSize} color="white" />;
  }
  return <Ionicons name={iconName as any} size={iconSize} color="white" />;
};

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
interface SubIconProps {
  iconName?: string | null;
  iconLibrary?: string | null;
  iconColor?: string | null;
  /** Fallback category image used when no custom icon is set */
  category?: string;
  containerSize?: number;
  iconSize?: number;
  borderRadius?: number;
  /** Background tint used for the category-image fallback */
  fallbackBg?: string;
  /** Adds a coloured shadow under the icon box */
  shadow?: boolean;
}

const SubIcon = ({
  iconName,
  iconLibrary,
  iconColor,
  category,
  containerSize = 54,
  iconSize,
  borderRadius,
  fallbackBg = '#88888820',
  shadow = false,
}: SubIconProps) => {
  const actualIconSize = iconSize ?? Math.round(containerSize * 0.55);
  const actualRadius = borderRadius ?? Math.round(containerSize * 0.25);

  if (iconName && iconColor) {
    const fallbackIcon = (
      <Ionicons name="help-circle-outline" size={actualIconSize} color="white" />
    );

    return (
      <View
        style={{
          width: containerSize,
          height: containerSize,
          borderRadius: actualRadius,
          backgroundColor: iconColor,
          justifyContent: 'center',
          alignItems: 'center',
          ...(shadow && {
            shadowColor: iconColor,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.45,
            shadowRadius: 10,
            elevation: 8,
          }),
        }}
      >
        <IconErrorBoundary fallback={fallbackIcon}>
          <RawIcon
            iconName={iconName}
            iconLibrary={iconLibrary}
            iconSize={actualIconSize}
          />
        </IconErrorBoundary>
      </View>
    );
  }

  // No custom icon — show the category image
  const imageSize = Math.round(containerSize * 0.63);
  return (
    <View
      style={{
        width: containerSize,
        height: containerSize,
        borderRadius: actualRadius,
        backgroundColor: fallbackBg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={ImageForCategory[category ?? 'Other']}
        style={{ width: imageSize, height: imageSize }}
      />
    </View>
  );
};

export default SubIcon;
