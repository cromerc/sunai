import React, { useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';

import ChartComponent from './ChartComponent';

class Coords {
    x = [];
    y = [];

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
};

export default function DashboardComponent() {
    const toast = useRef(null);

    const [sum, setSum] = useState(0);
    const [max, setMax] = useState(0);

    const [data1, setData1] = useState(new Coords());
    const [data2, setData2] = useState(new Coords());

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Éxito', detail: 'File Uploaded' });
    };

    const chartData = () => {

    };

    return (
        <div className="card py-4 px-8">
            <div className="flex card-container indigo-container">
                <div className="flex-1">
                    <Toast ref={toast}></Toast>
                    <Panel header="Dashboard">
                        <div className="flex justify-content-center">
                            <FileUpload mode="basic"
                                    name="uploads[]"
                                    url="api/excel"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    maxFileSize={1000000}
                                    onUpload={onUpload} />
                        </div>
                        <div className="grid">
                            <div className="flex justify-content-center col-6">
                                <Card title="Chart" style={{ textAlign: 'center' }} className='w-9'>
                                    <ChartComponent data1={data1} data2={data2} />
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
