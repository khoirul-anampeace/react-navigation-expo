import { NavigatorScreenParams } from '@react-navigation/native';

// Type untuk Bottom Tab Navigator
export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Profile: undefined;
  Settings: undefined;
};

// Type untuk Home Stack Navigator
export type HomeStackParamList = {
  HomeMain: undefined;
  Details: {
    itemId: number;
    itemName: string;
  };
};