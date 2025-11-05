import { NavigatorScreenParams } from '@react-navigation/native';

// Type untuk Bottom Tab Navigator
export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Absensi: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

// Type untuk Home Stack Navigator
export type HomeStackParamList = {
  HomeMain: undefined;
  Details: {
    itemId: number;
    itemName: string;
  };
};

// Type untuk Settings Stack Navigator
export type SettingsStackParamList = {
  SettingsMain: undefined;
  Profile: undefined;
  EditProfile: undefined;
};