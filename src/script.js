class DynamicChart {
    constructor(chartElementId, maxDataPoints = 10) {
        this.ctx = document.getElementById(chartElementId).getContext('2d');
        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Dynamic Data',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        this.counter = 0;
        this.maxDataPoints = maxDataPoints;
    }

    updateChart(newValue) {
        // Adicionar o valor ao gráfico
        this.chart.data.labels.push(this.counter++);
        this.chart.data.datasets[0].data.push(newValue);

        // Atualizar o gráfico
        this.chart.update();
    }

    stopUpdating() {
        clearInterval(this.updateInterval);
    }


}

class MQTTClient {
    constructor(wsbroker, wsport, username, password) {
        this.client = new Paho.MQTT.Client(wsbroker, wsport, "/ws", "js" + parseInt(Math.random() * 100, 10));
        this.username = username;
        this.password = password;

        this.client.onConnectionLost = this.onConnectionLost.bind(this);
        this.client.onMessageArrived = this.onMessageArrived.bind(this);
        this.client.onConnected = () => this.onConnected(); // Usar função de flecha

        this.maxvalue = 0;

        const options = {
            onSuccess: () => this.onConnected(), // Usar função de flecha
            onFailure: this.onFailure.bind(this),
            userName: this.username,
            password: this.password
        };
        
        this.chart = new DynamicChart('myChart');

        this.client.connect(options);
    }

    maxValue(newNumber) {
        if(newNumber > this.maxvalue) {
            this.maxvalue = newNumber
            document.getElementById('maxValue').textContent = this.maxvalue;
            console.log("maximo encontrado")
        }
    }

    onConnectionLost(responseObject) {
        console.error("CONNECTION LOST - " + responseObject.errorMessage);
    }

    onMessageArrived(message) {
        //console.log("RECEIVE ON " + message.destinationName + " PAYLOAD " + message.payloadString);
        this.printFirst(message.payloadString);
    }

    onConnected() {
        console.log("Conectado ao broker MQTT");
        this.client.subscribe("topic/esp32");
    }

    onFailure(message) {
        console.error("Falha na conexão: " + message.errorMessage);
    }

    printFirst(message) {
        this.maxValue(Number(message))
        console.log("Mensagem recebida: " + message);
        this.chart.updateChart(Number(message))
    }
}

const wsbroker = "10.5.0.5";
const wsport = 15675;
const username = "gustavo";
const password = "3141516";

const client = new MQTTClient(wsbroker, wsport, username, password);
