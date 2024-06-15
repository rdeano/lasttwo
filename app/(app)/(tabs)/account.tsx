import { Text,StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useSession } from "../../../contextprovider/ctx";

export default function Tab() {
  const { signOut} = useSession();

  const signout = () => {
    signOut();
  }

  return (
    <>
      <View style={styles.container}>
        <Button 
          style={styles.button}
          icon="logout" 
          mode="contained" 
          onPress={signout}>

          Sign out
        </Button>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button : {
    width: '80%'
  }
});