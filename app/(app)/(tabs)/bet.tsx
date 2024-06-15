import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Text } from 'react-native-paper'
import { supabase } from '../../../lib/supabase';
import { useSession } from '../../../contextprovider/ctx';
import { router } from 'expo-router';

export default function Tab() {
  const [loading, setLoading] = useState(false);
  const { session } = useSession();
  const [betNumber, setBetNumber] = useState("");
  const [amount, setAmount] = useState("");
  

  const placeBet = async () => {
    const parsedNumber = parseFloat(betNumber);
    const parsedAmount = parseFloat(amount);
    // Check if the parsed number is a valid number and not NaN
    const isValidNumber = !isNaN(parsedNumber) && betNumber.trim() !== "";
    const isValidAmount = !isNaN(parsedAmount) && amount.trim() !== "";


    if (betNumber.length != 2 || !isValidNumber) {
      Alert.alert("Invalid Last Two Digit")
      return;
    }
    if (!isValidAmount) {
      Alert.alert("Invalid Amount")
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('bet')
      .insert([
        {
          authid: session,  // Replace with the actual authid value
          lasttwo: betNumber,  // Replace with the actual lasttwo value (must be between 0 and 99)
          amount: amount,  // Replace with the actual amount value
          drawdate: new Date().toISOString()  // Optional, the default is current date and time
        }
      ]);

    if (error) {
      setLoading(false);
      console.error('Error inserting row:', error);
    } else {
      setLoading(false);
      Alert.alert("Bet has been placed");
      router.replace('(tabs)/transaction');
      console.log('Row inserted:', data);
    }
  }

  useEffect(() => {
    console.log('pull the draw date here')
  },[])
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        label="Last Two Digit"
        value={betNumber}
        onChangeText={text => setBetNumber(text)}
      />

      <TextInput
        style={styles.input}
        label="Amount"
        value={amount}
        onChangeText={text => setAmount(text)}
      />

      <Button 
        disabled={loading}
        style={styles.button}
        icon="send" 
        mode="contained" 
        onPress={placeBet}>

        Place Bet
      </Button>

      <Text style={styles.infoLabel} variant="headlineMedium">Draw Date</Text>
      <Text variant="bodyLarge">6/14/2024</Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginTop:20,
    width:'90%'
  },
  button : {
    marginTop:20,
    width:'90%'
  },
  infoLabel : {
    marginTop:20
  }
});