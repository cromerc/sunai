import React, { useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';

import ChartComponent from './ChartComponent';

export default function DashboardComponent() {
    const toast = useRef(null);

    const onBasicUpload = () => {
            toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

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
                                    onUpload={onBasicUpload} />
                        </div>
                        <div>
                            <ChartComponent />
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
};
