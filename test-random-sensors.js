let sensor = require('.');

// test
const broker = 'mqtt://localhost'
let sensors = [
  {
    name: 'temperatureChambre',
    type: sensor.SensorType.TEMPERATURE,
    freq:1,
  },
  {
    name:  'temperatureSalleA111',
    type: sensor.SensorType.TEMPERATURE,
    freq:.5
  },
  {
    name:  'MonAttention',
    type: sensor.SensorType.PERCENT,
    freq:.5
  },
  {
    name:  'MesYeux',
    type: sensor.SensorType.ON_OFF,
    freq:.5
  }

];



sensors = sensors.map(s=>(new sensor.RandomMQTTSensor(s.name, s.type, broker, s.freq)));
sensors.forEach(s => s.start());
