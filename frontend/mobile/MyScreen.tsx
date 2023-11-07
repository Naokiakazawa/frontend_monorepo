import React from 'react';
import {View, Text, Card, Button} from 'react-native-ui-lib';

export default function MyScreen() {
  return (
    <View flex padding-page>
      <Text heading marginB-s4>
        My Screen
      </Text>
      <Card height={80} center padding-card marginB-s4>
        <Text body>This is an example card </Text>
      </Card>

      <Button
        label="Button"
        size={Button.sizes.medium}
        body
        bg-primaryColor
        square
      />
    </View>
  );
}
