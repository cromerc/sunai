import React, { useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

export default function DashboardComponent() {
    const toast = useRef(null);

    const onBasicUpload = () => {
        if (toast.current != null) {
            toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
        }
    }

    return (
        <div>
            <Toast ref={toast}></Toast>
            <FileUpload mode="basic" name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" accept="application/vnd.ms-excel" maxFileSize={1000000} onUpload={onBasicUpload} />
        </div>
    );
};
