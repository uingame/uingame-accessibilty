import React from 'react';
import PropTypes from 'prop-types'
import { Text, StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
import Button from './components/Button'
import {sendDistressSms, DEFAULT_MESSAGE} from './services/sms'
import { TextInput } from 'react-native-gesture-handler';

export default class MainScreen extends React.Component {
  static propTypes = {
    openSettings: PropTypes.func.isRequired,
    location: PropTypes.string,
    settings: PropTypes.object
  }

  state = {
    message: ''
  }

  sendSms = async (...numbers) => {
    try {
      const result = await sendDistressSms(
        numbers,
        this.props.settings.name,
        this.props.settings.address,
        this.props.location,
        this.state.message
      )
      if (!result) {
        Alert.alert('הודעה לא נשלחה')
      }
    } catch (error) {
      Alert.alert('שגיאה בשליחת הודעה')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.settings.isDeaf && (
          <React.Fragment>
            <View>
              <TextInput
                style={styles.input}
                placeholder={DEFAULT_MESSAGE}
                value={this.state.message}
                onChangeText={(text) => this.setState({message: text})}
              />
            </View>
            <View style={styles.rtlView}>
              <Button
                styles={styles.button}
                title='כיבוי אש'
                onPress={() => this.sendSms('102')}
              />
              <Button
                styles={styles.button}
                title='מד״א'
                onPress={() => this.sendSms('101')}
              />
              <Button
                styles={styles.button}
                title='משטרה'
                onPress={() => this.sendSms('100')}
              />
            </View>
            { (this.props.settings.contactPhone || this.props.settings.contactPhone2) && (
              <View>
                <Button
                  styles={styles.button}
                  title='איש קשר'
                  onPress={() => this.sendSms(this.props.settings.contactPhone, this.props.settings.contactPhone2)}
                />
              </View>
            )}
          </React.Fragment>
        )}
        <View style={styles.rtlView}>
          <Text>
            מיקום נוכחי:
          </Text>
          {this.props.location ? <Text style={{flex: 1}}>{this.props.location}</Text> : <ActivityIndicator />}
        </View>
        <Button
          title='עדכון פרטים'
          onPress={() => {
            this.props.openSettings();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    direction: 'rtl',
    margin: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-evenly'
  },
  rtlView: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
  },
  input: {
    height: 40
  }
});
