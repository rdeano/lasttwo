import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSession } from '../../../contextprovider/ctx';
import { Avatar, Card, Divider, IconButton, List } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface IData {
  id : number,
  drawresult : number,
  drawdate : string,
  dateFormatted : string
}

export default function Tab() {
  const [drawResult, setDrawResult] = useState<IData[]>([]);

  const retrieveDrawResult = async () => {
    const { data, error } = await supabase
    .from('draws')
    .select('*')
    .order('id', {ascending:false})

    if (error) {
      console.error('Error retrieving rows:', error);
    } else {
      console.log('Retrieved rows:', data);
      // Assuming 'date' is the field you want to format
      const formattedData = data.map((bet) => ({
        ...bet,
        dateFormatted: formatDate(bet.drawdate),
      }));
      setDrawResult(formattedData);
    }

  }

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
    retrieveDrawResult()
  },[])

  return (
    <View style={styles.container}>
      <ScrollView>
      {
        drawResult?.map((el, index) => (
          <>
            <View key={index}>
              <List.Item
                titleStyle={{
                  fontSize:50,
                  fontWeight:'bold'
                }}
                title={el.drawresult}
                description={`Draw Date:  ${el.dateFormatted}`}
                left={props => <List.Icon {...props} icon="calendar" />}
              >
              </List.Item>
              <Divider />
            </View>
          </>
        ))
      }

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});