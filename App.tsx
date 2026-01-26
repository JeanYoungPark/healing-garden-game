import { StatusBar } from 'expo-status-bar';
import { GardenScreen } from './src/screens/GardenScreen';

export default function App() {
  return (
    <>
      <GardenScreen />
      <StatusBar style="auto" />
    </>
  );
}
