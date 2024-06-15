import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Logo from '../components/Logo';
import { TextInput } from 'react-native-paper';
import Button from '../components/Button';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { makeRedirectUri } from 'expo-auth-session';
import { useSession } from '../contextprovider/ctx';
import { router } from 'expo-router'


export default function Signup() {
  const redirectTo = makeRedirectUri();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  const { signIn } = useSession();

  const _onLoginPressed = async () => {



    if (!email || !password || !cpassword) {
      Alert.alert("Please fill in all fields");
      return;
    }
    if (password !== cpassword) {
      Alert.alert("Password and Confirm password does not match");
      return;
    }
    console.log(redirectTo,'redirectTo')
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options:{
        emailRedirectTo : redirectTo
      }
    })

    if (error) Alert.alert(error.message)
      setLoading(false)
    if (!session) {
      Alert.alert('Please check your inbox for email verification!')
      return;
    }else {
      signIn();
      // Navigate after signing in. You may want to tweak this to ensure sign-in is
      // successful before navigating.
      router.replace('/');
    }

    
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Sign up",
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

      <TextInput
        disabled={loading}
        mode='outlined'
        style={styles.password}
        label="Confirm Password"
        value={cpassword}
        onChangeText={text => setCPassword(text)}
        secureTextEntry
      />


      <Button mode="contained" onPress={_onLoginPressed} style={styles.login} disabled={loading}>
        Create Account
      </Button>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
