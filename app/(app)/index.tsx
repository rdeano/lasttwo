import { Text, View } from 'react-native';
import { useSession } from '../../contextprovider/ctx';
import { Redirect } from 'expo-router';


export default function Index() {
  
  return <Redirect href={"(tabs)/home"} />

}
