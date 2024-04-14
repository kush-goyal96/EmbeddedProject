import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTemperatureHalf, faFire, faVolumeLow, faDroplet } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';


function Home() {

    const [currHumidity, setcurrHumidity] = useState(null);
    const [currTemp, setCurrTemp] = useState(null);
    const [currNoise, setCurrNoise] = useState(null);
    const [humidityData, setHumidityData] = useState([]);
    const [temperatureData, settemperatureData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tempRes, humRes, noiseRes, tempHistoryRes, humHistoryRes] = await Promise.all([
                    axios.get("http://13.126.162.134:3200/temperature/current?room=1"),
                    axios.get("http://13.126.162.134:3200/humidity/current?room=1"),
                    axios.get("http://13.126.162.134:3200/noise/current?room=1"),
                    axios.get("http://13.126.162.134:3200/temperature/history?room=1"),
                    axios.get("http://13.126.162.134:3200/humidity/history?room=1"),
                ]);
                setCurrTemp(tempRes.data.temperature);
                setcurrHumidity(humRes.data.humidity);
                setCurrNoise(noiseRes.data.noise);
                settemperatureData(tempHistoryRes.data);
                setHumidityData(humHistoryRes.data);
            } catch (error) {
                console.error("API error: ", error);
            }
        };

        // Fetch data initially
        fetchData();

        // Fetch data every second
        const interval = setInterval(fetchData, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [currTemp, currHumidity, currNoise, humidityData, temperatureData]);


    const data = humidityData.map((item, index) => {
        const temperatureItem = temperatureData[index];
        console.log(temperatureItem);
        const formattedTime = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
            timestamp: formattedTime,
            Humidity: item.humidity,
            Temperature: temperatureItem.temperature,
        };
    });
    
     

  return (
    <main className='main-container'>
        <div className='main-title'>
            <h2>Room Monitoring Dashboard</h2>
        </div>

        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Temperature</h3>
                    <FontAwesomeIcon icon={faTemperatureHalf} className='card_icon' />
                </div>
                <h1>{currTemp}°C</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Humidity</h3>
                    <FontAwesomeIcon icon={faDroplet} className='card_icon' />
                </div>
                <h1>{currHumidity}%</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Noise Level</h3>
                    <FontAwesomeIcon icon={faVolumeLow} className='card_icon' />
                </div>
                <h1>{currNoise}dB</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Flame Alert</h3>
                    <FontAwesomeIcon icon={faFire} className='card_icon' />
                </div>
                <h1>Safe</h1>
            </div>
        </div>

        <div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Temperature" fill="#8884d8" />
                <Bar dataKey="Humidity" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Humidity" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>

        </div>
    </main>
  )
}

export default Home