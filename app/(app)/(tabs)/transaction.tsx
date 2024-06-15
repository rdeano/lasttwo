import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { useSession } from '../../../contextprovider/ctx';
import { Divider } from 'react-native-paper';

interface IData {
  id : number,
  amount : number,
  authid : string,
  drawdate : string,
  lasttwo : number,
  dateFormatted : string
}

export default function Tab() {
  const { session } = useSession();
  const [ bets,setBets] = useState<IData[]>([]);

  const retrieveByUUID = async (uuid : string) => {
    const { data, error } = await supabase
      .from('bet')
      .select('*')
      .order('id', {ascending:false})
      .eq('authid', uuid);

    if (error) {
      console.error('Error retrieving rows:', error);
    } else {
      console.log('Retrieved rows:', data);
      // Assuming 'date' is the field you want to format
      const formattedData = data.map((bet) => ({
        ...bet,
        dateFormatted: formatDate(bet.drawdate),
      }));
      console.log(formattedData,'formatted')
      setBets(formattedData);
    }
  };

  // Function to format date to dd/mm/YYYY
  const formatDate = (dateString : string) => {
    if (!dateString) return ''; // Handle case where dateString is null or undefined

    const dateObj = new Date(dateString);
    const day = dateObj.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Get month (zero-based) and pad with leading zero if needed
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  };
  
  useEffect(() => {
    // console.log(bets,'bets')
  },[bets])

  useEffect(() => {
    retrieveByUUID(session as string);
  },[])

  return (
    <View style={styles.container}>
      {
        bets?.map((el, index) => (
          <>
            <View style={styles.listContainer} key={index}>
              <Text style={styles.lastTwo}>{el.lasttwo}</Text>
              <Text style={styles.date}>Date : {el.dateFormatted}</Text>
              <Text style={styles.amount}>Amount : {el.amount}</Text>
              <Divider />
            </View>
          </>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  lastTwo: {
    fontSize:30,
    fontWeight:'bold',
    marginBottom:5
  },
  date : {
    fontSize:15,
    marginBottom:5
  },
  amount : {
    fontSize:12,
    marginBottom:5
  },
  listContainer : {
    marginLeft:10,
    marginTop:5
  }
});