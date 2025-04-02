import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import colors from '../../assets/colors/colors';
import { useNavigation } from '@react-navigation/native';

const DashboardAttendeeListsScreen = () => {
  const navigation = useNavigation(); 

  const navigate = () => {
    navigation.navigate('AttendeeList');
  };

  const attendees = [
    { id: '1', total: 100, checkedIn: 20 },
  ];

    // 2. Fonction pour afficher chaque élément de la liste
    const renderItem = ({ item }) => (
      <TouchableOpacity style={styles.item} onPress={navigate}>
        <Text style={styles.title}>Liste des participants</Text>
        <Text style={styles.name}>{item.total} Total | {item.checkedIn} Enregistrés</Text>
      </TouchableOpacity>
    );

  return (
    <View style={[globalStyle.backgroundWhite, styles.container]}>
      <FlatList
        data={attendees}
        keyExtractor={item => item.id}
        renderItem={renderItem}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: colors.greyCream,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight:'300',
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: colors.darkGrey,
    fontWeight: '900',
  },
});



export default DashboardAttendeeListsScreen;