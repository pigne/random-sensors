let sensor = require('.');

// test

let broker = 'mqtt://localhost'

if(typeof process.env.BROKER_ADDRESS !== "undefined"){
  broker = process.env.BROKER_ADDRESS;
}
let sensors = [
  {
    name: 'Temperature Bureau N° '+Math.floor(Math.random()*100, 0),
    type: sensor.SensorType.TEMPERATURE,
    freq:1,
  },
  {
    name:  'Temperature Salle A111',
    type: sensor.SensorType.TEMPERATURE,
    freq:1.5
  },
  {
    name:  'Charge Batterie Téléphone',
    type: sensor.SensorType.PERCENT,
    freq:1
  },
  {
    name:  'Taux d\'humidité serre tropicale' ,
    type: sensor.SensorType.PERCENT,
    freq:0.3
  },
  {
    name:  "Temperature Couloir",
    type: sensor.SensorType.TEMPERATURE,
    freq:0.5
  },
  {
    name:  'Porte du Garage',
    type: sensor.SensorType.OPEN_CLOSE,
    freq:0.5
  }

];



sensors = sensors.map(s=>(new sensor.RandomMQTTSensor({name : s.name, type: s.type, broker, freq: s.freq})));
sensors.forEach(s => s.start());
