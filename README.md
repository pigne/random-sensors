# Random Sensors

Small library that generates random messages on an MQTT brocker. 

## Messages topics and payload

Sensors publish on 2 topics : 

- `"presence"`  with payload `[id]` where "[id]" is the id of the sensor. 
- `"value/[id]"` with "[id]" the id of the sensor and a payload with format : 

```JSON
{
  "value": "[value]",
  "type": "[type]"
}
```

where "[value]" is the string value of the sensor and "[type]" the string representation of the type of value within: 

-  'POSITIVE_NUMBER',
-  'PERCENT',
-  'ON_OFF',
-  'OPEN_CLOSE'.

## run it


Run a default example with:

```
npm install
node test-random-sensors.js
```

