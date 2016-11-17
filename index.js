
var mqtt = require('mqtt')

const SensorType = function() {};
const sensorTypes = [
  'POSITIVE_NUMBER',
  'PERCENT',
  'ON_OFF',
  'OPEN_CLOSE',
];
for (const key of sensorTypes) {
  SensorType[key] = new SensorType();
}
Object.freeze(SensorType);


function propName(prop, value){
   for(var i in prop) {
       if (prop[i] == value){
            return i;
       }
   }
   return false;
}




const Value = function(value) {
  this.value = value;
  this.toString = () => (this.value);
};
const values = [
  'ON',
  'OFF',
  'OPEN',
  'CLOSE'
];
for (const key of values) {
  Value[key] = new Value(key);
}
Object.freeze(Value);


function randomId() {
  return Math.floor(Math.random() * 1000000);
}

const RandomMQTTSensor = function (id, type, broker, freq) {
  this.id = typeof id === 'undefined' ? randomId() : id;
  this.broker = typeof broker === 'undefined' ? 'mqtt://mosca' : broker;
  if (typeof type === 'undefined') {
    this.type = SensorType.TEMPERATURE;
  } else if (!(type instanceof SensorType)) {
    throw new Error('Sensor\'s type should be a SensorType');
  } else {
    this.type = type;
  }
  switch (this.type) {
    case SensorType.POSITIVE_NUMBER: this.value =  Math.floor(Math.random()*100); break;
    case SensorType.PERCENT: this.value = Math.random(); break;
    case SensorType.ON_OFF: this.value = Math.random()>.05 ? Value.ON : Value.OFF; break;
    case SensorType.OPEN_CLOSE: this.value = Math.random()>.05 ? Value.OPEN : Value.CLOSE; break;
    default: this.value=0;
  }
  this.freq = typeof freq === 'undefined' ? 1 : Number(freq);
  this.handler = () => {}
}
RandomMQTTSensor.prototype.handler = function (topic, message) {
  // message is Buffer
  console.log(message.toString())

}

RandomMQTTSensor.prototype.send = function() {

  switch (this.type) {
    case SensorType.POSITIVE_NUMBER: this.value = this.value - 1 + Math.floor(Math.random()*3); break;
    case SensorType.PERCENT: this.value = Math.min(1, Math.max(0, this.value - 0.1 + Math.random()*0.2)); break;
    case SensorType.ON_OFF: if( Math.random()>.9)  this.value = this.value === Value.ON ? Value.OFF : Value.ON; break;
    case SensorType.OPEN_CLOSE: if( Math.random()>.9)  this.value = this.value === Value.OPEN ? Value.CLOSE : Value.OPEN; break;
    default: this.value=0;
  }
  console.log("send", this.value.toString())
  const s = `{"value":"${this.value.toString()}", "type":"${propName(SensorType, this.type)}"}`
  console.log('value/'+this.id,  s);
  this.client.publish('value/'+this.id, s);
}
RandomMQTTSensor.prototype.start = function() {
  this.client = mqtt.connect(this.broker);
  this.client.on('connect', () => {
    this.client.subscribe('action/'+this.id)
    this.client.publish('presence', this.id)
    this.timeout = setInterval(RandomMQTTSensor.prototype.send.bind(this), 1000/this.freq )
  })
  this.client.on('message', RandomMQTTSensor.prototype.handler.bind(this));

}
RandomMQTTSensor.prototype.stop =  function () {
  clearTimeout(this.timeout);
  this.client.unsuscribe('action/'+this.id);
  this.client.end();
}
exports.RandomMQTTSensor = RandomMQTTSensor;
exports.SensorType = SensorType;
exports.Value = Value;
