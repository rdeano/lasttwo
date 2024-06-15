import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import Logo from '../components/Logo';
import Button from '../components/Button';

import { Text as TextRN} from 'react-native-paper'
import { Link, Stack, router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useSession } from '../contextprovider/ctx';


export default function Auth() {
  const { signIn } = useSession();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const _onLoginPressed = async () => {

    if (!email) {
      Alert.alert("Please enter email");
      return;
    }

    if (!password) {
      Alert.alert("Please enter password");
      return;
    }

    setLoading(true);
    const { error,data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    setLoading(false)
    if (error) {
      Alert.alert(error.message)
    }else {
      signIn(data.user.id);
      // Navigate after signing in. You may want to tweak this to ensure sign-in is
      // successful before navigating.
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
       <Stack.Screen
        options={{
          headerShown:false
        }}
      />

      <Logo />
      <TextInput
        disabled={loading}
        mode='outlined'
        style={styles.email}
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />

      <TextInput
        disabled={loading}
        mode='outlined'
        style={styles.password}
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />

      <Button mode="contained" onPress={_onLoginPressed} style={styles.login} disabled={loading}>
        Login
      </Button>

      <TextRN variant="titleSmall">Dont have an account? <Link style={styles.link} href="/signup">Sign Up</Link></TextRN>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  email : {
    width: '80%'
  },
  password : {
    width: '80%',
    marginTop:20
  },
  login : {
    marginTop:20,
    width:'80%'
  },
  link : {
    color:'blue'
  }
});
