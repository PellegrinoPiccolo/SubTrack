export type IconLibrary = 'Ionicons' | 'MaterialCommunityIcons';

export interface PresetSubscription {
  id: string;
  name: string;
  category: 'Entertainment' | 'Productivity' | 'Education' | 'Fittnes&Health' | 'Work' | 'Home' | 'Other';
  iconName: string;
  iconLibrary: IconLibrary;
  iconColor: string;
}

export const ICON_COLORS = [
  '#E50914', '#FF4500', '#FF9900', '#F5A623',
  '#1DB954', '#58CC02', '#00C2A8', '#00A8E0',
  '#4285F4', '#0A66C2', '#5C00BD', '#7D2AE8',
  '#FC3C44', '#EF5466', '#4A154B', '#555555',
];

export const PRESET_SUBSCRIPTIONS: PresetSubscription[] = [
  // Video Streaming
  { id: 'netflix',          name: 'Netflix',            category: 'Entertainment', iconLibrary: 'MaterialCommunityIcons', iconName: 'netflix',           iconColor: '#E50914' },
  { id: 'disney-plus',      name: 'Disney+',            category: 'Entertainment', iconLibrary: 'Ionicons',              iconName: 'star',              iconColor: '#113CCF' },
  { id: 'prime-video',      name: 'Prime Video',        category: 'Entertainment', iconLibrary: 'Ionicons',              iconName: 'play-circle',       iconColor: '#00A8E0' },
  { id: 'apple-tv',         name: 'Apple TV+',          category: 'Entertainment', iconLibrary: 'MaterialCommunityIcons', iconName: 'apple',             iconColor: '#555555' },
  { id: 'youtube-premium',  name: 'YouTube Premium',    category: 'Entertainment', iconLibrary: 'MaterialCommunityIcons', iconName: 'youtube',           iconColor: '#FF0000' },
  { id: 'hulu',             name: 'Hulu',               category: 'Entertainment', iconLibrary: 'Ionicons',              iconName: 'play-forward-circle',iconColor: '#3DBB3D' },
  { id: 'max',              name: 'Max',                category: 'Entertainment', iconLibrary: 'Ionicons',              iconName: 'film',              iconColor: '#5C00BD' },
  { id: 'paramount-plus',   name: 'Paramount+',         category: 'Entertainment', iconLibrary: 'Ionicons',              iconName: 'sparkles',          iconColor: '#0057E7' },
  { id: 'crunchyroll',      name: 'Crunchyroll',        category: 'Entertainment', iconLibrary: 'Ionicons',              iconName: 'play-circle-outline',iconColor: '#F47521' },
  { id: 'dazn',             name: 'DAZN',               category: 'Entertainment', iconLibrary: 'Ionicons',              iconName: 'football',          iconColor: '#F5A623' },
  { id: 'twitch',           name: 'Twitch',             category: 'Entertainment', iconLibrary: 'MaterialCommunityIcons', iconName: 'twitch',            iconColor: '#9146FF' },
  // Music
  { id: 'spotify',          name: 'Spotify',            category: 'Entertainment', iconLibrary: 'MaterialCommunityIcons', iconName: 'spotify',           iconColor: '#1DB954' },
  { id: 'apple-music',      name: 'Apple Music',        category: 'Entertainment', iconLibrary: 'MaterialCommunityIcons', iconName: 'apple',             iconColor: '#FC3C44' },
  { id: 'youtube-music',    name: 'YouTube Music',      category: 'Entertainment', iconLibrary: 'MaterialCommunityIcons', iconName: 'youtube',           iconColor: '#FF0000' },
  { id: 'tidal',            name: 'Tidal',              category: 'Entertainment', iconLibrary: 'Ionicons',              iconName: 'water',             iconColor: '#222222' },
  { id: 'deezer',           name: 'Deezer',             category: 'Entertainment', iconLibrary: 'Ionicons',              iconName: 'radio',             iconColor: '#EF5466' },
  { id: 'amazon-music',     name: 'Amazon Music',       category: 'Entertainment', iconLibrary: 'Ionicons',              iconName: 'musical-notes',     iconColor: '#00A8E0' },
  // Productivity & Work
  { id: 'microsoft-365',    name: 'Microsoft 365',      category: 'Productivity',  iconLibrary: 'MaterialCommunityIcons', iconName: 'microsoft-office',  iconColor: '#D83B01' },
  { id: 'adobe-cc',         name: 'Adobe Creative Cloud',category: 'Productivity', iconLibrary: 'Ionicons',              iconName: 'color-palette',     iconColor: '#FF0000' },
  { id: 'notion',           name: 'Notion',             category: 'Productivity',  iconLibrary: 'Ionicons',              iconName: 'document-text',     iconColor: '#222222' },
  { id: 'slack',            name: 'Slack',              category: 'Work',          iconLibrary: 'MaterialCommunityIcons', iconName: 'slack',             iconColor: '#4A154B' },
  { id: 'canva-pro',        name: 'Canva Pro',          category: 'Productivity',  iconLibrary: 'Ionicons',              iconName: 'color-wand',        iconColor: '#7D2AE8' },
  { id: 'chatgpt-plus',     name: 'ChatGPT Plus',       category: 'Productivity',  iconLibrary: 'Ionicons',              iconName: 'sparkles-outline',  iconColor: '#00A67E' },
  // Cloud Storage
  { id: 'dropbox',          name: 'Dropbox',            category: 'Productivity',  iconLibrary: 'MaterialCommunityIcons', iconName: 'dropbox',           iconColor: '#0061FF' },
  { id: 'google-one',       name: 'Google One',         category: 'Productivity',  iconLibrary: 'MaterialCommunityIcons', iconName: 'google',            iconColor: '#4285F4' },
  { id: 'icloud',           name: 'iCloud+',            category: 'Productivity',  iconLibrary: 'MaterialCommunityIcons', iconName: 'apple',             iconColor: '#3399FF' },
  // Gaming
  { id: 'playstation-plus', name: 'PlayStation Plus',   category: 'Entertainment', iconLibrary: 'MaterialCommunityIcons', iconName: 'sony-playstation',  iconColor: '#003087' },
  { id: 'xbox-gamepass',    name: 'Xbox Game Pass',     category: 'Entertainment', iconLibrary: 'MaterialCommunityIcons', iconName: 'microsoft-xbox',    iconColor: '#107C10' },
  { id: 'nintendo-online',  name: 'Nintendo Online',    category: 'Entertainment', iconLibrary: 'MaterialCommunityIcons', iconName: 'nintendo-switch',   iconColor: '#E4000F' },
  { id: 'steam',            name: 'Steam',              category: 'Entertainment', iconLibrary: 'MaterialCommunityIcons', iconName: 'steam',             iconColor: '#1B2838' },
  // Fitness & Health
  { id: 'calm',             name: 'Calm',               category: 'Fittnes&Health', iconLibrary: 'Ionicons',             iconName: 'leaf',              iconColor: '#4A90D9' },
  { id: 'headspace',        name: 'Headspace',          category: 'Fittnes&Health', iconLibrary: 'Ionicons',             iconName: 'flower',            iconColor: '#FF9600' },
  // Education
  { id: 'duolingo',         name: 'Duolingo',           category: 'Education',     iconLibrary: 'Ionicons',              iconName: 'language',          iconColor: '#58CC02' },
  { id: 'kindle',           name: 'Kindle Unlimited',   category: 'Education',     iconLibrary: 'Ionicons',              iconName: 'book',              iconColor: '#FF9900' },
  // Security
  { id: 'nordvpn',          name: 'NordVPN',            category: 'Other',         iconLibrary: 'Ionicons',              iconName: 'shield',            iconColor: '#4687FF' },
  { id: 'expressvpn',       name: 'ExpressVPN',         category: 'Other',         iconLibrary: 'Ionicons',              iconName: 'shield-outline',    iconColor: '#DA3940' },
  // Professional
  { id: 'linkedin-premium', name: 'LinkedIn Premium',   category: 'Work',          iconLibrary: 'MaterialCommunityIcons', iconName: 'linkedin',          iconColor: '#0A66C2' },
];
