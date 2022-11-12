import React, { useRef, useState, useEffect } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';
import axios from 'axios';

import ChartComponent from './ChartComponent';

export default function DashboardComponent() {
    const uploadUrl = "api/upload";
    const maxSumUrl = "api/maxsum";
    const deviceUrl = "api/device";
    const devicesUrl = "api/devices";

    const toast = useRef(null);

    const [sum, setSum] = useState("0");
    const [max, setMax] = useState("0");

    const [devices, setDevices] = useState([]);
    // eslint-disable-next-line no-array-constructor
    const [data, setData] = useState([{}]);

    const onUpload = () => {
        // @ts-ignore
        toast.current.show({ severity: 'info', summary: 'Éxito', detail: 'Archivo enviado!' });
        getMaxSum();
    };

    async function getMaxSum() {
        try {
            const response = await axios.get(maxSumUrl);
            if (response.status === 200) {
                var max = parseInt(response.data.max);
                var sum = parseInt(response.data.sum);
                setMax(max.toLocaleString("es-CL"));
                setSum(sum.toLocaleString("es-CL"));
            }
        }
        catch (error) {
            console.error(error);
        }
    };

        async function getDevices() {
            try {
                const response = await axios.get(devicesUrl);
                if (response.status === 200) {
                    setDevices(response.data);
                }
            }
            catch (error) {
                console.error(error);
            }
        };

    useEffect(() => {
        getMaxSum();
        getDevices();
    }, []);

    /*async function getDeviceData(device) {
        try {
            const response = await axios.get(deviceUrl + "/" + device);
            if (response.status === 200) {
                let times = [];
                let powers = [];

                response.data.forEach(element => {
                    times.push(element.FechaIm);
                    powers.push(element.ActivePowerIm);
                });

                const newData = {
                    device: device,
                    times: times,
                    powers: powers
                };
                
                setData(prevState => ({
                    ...prevState,
                    data: { ...prevState, newData}
                }));
            }
        }
        catch (error) {
            console.error(error);
        }
    };*/

    useEffect(() => {
        const deviceDataUpdate = async (device) => {
            try {
                const response = await axios.get(deviceUrl + "/" + device);
                if (response.status === 200) {
                    let times = [];
                    let powers = [];

                    response.data.forEach(element => {
                        times.push(new Date(element.FechaIm).toLocaleTimeString("es"));
                        powers.push(element.ActivePowerIm);
                    });

                    const newData = [{
                        device: device,
                        times: times,
                        powers: powers
                    }];

                    const newState = data.concat(data, newData);

                    setData(newState);
                }
            }
            catch (error) {
                console.error(error);
            }
        };

        devices.forEach(element => {
            deviceDataUpdate(element);
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [devices]);

    return (
        <div className="card py-4 px-8">
            <div className="flex card-container indigo-container">
                <div className="flex-1">
                    <Toast ref={toast}></Toast>
                    <Panel header="Dashboard">
                        <div className="flex justify-content-center">
                            <FileUpload mode="basic"
                                name="uploads[]"
                                url={uploadUrl}
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                maxFileSize={1000000}
                                onUpload={onUpload} />
                        </div>
                        <div className="grid">
                            <div className="flex justify-content-center col-6">
                                <Card title="Chart" style={{ textAlign: 'center' }} className='w-9'>
                                    <ChartComponent data={data} />
                                </Card>
                            </div>
                            <div className="flex justify-content-center col-6">
                                <div className="grid">
                                    <div className="flex justify-content-center col-12">
                                        <Card title="Sum" style={{ textAlign: 'center', width: '25rem', marginBottom: '2em' }}>{sum}</Card>
                                    </div>
                                    <div className="flex justify-content-center col-12">
                                        <Card title="Max" style={{ textAlign: 'center', width: '25rem', marginBottom: '2em' }}>{max}</Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
};
