import React, { useEffect, useRef } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

export default function DicomViewer({ blobUrl }) {
    const viewerRef = useRef(null);

    useEffect(() => {
        const element = viewerRef.current;
        if (!element || !blobUrl) return;

        cornerstone.enable(element);

        const loadDicom = async () => {
            try {
                const response = await fetch(blobUrl);
                const blob = await response.blob();
                const file = new File([blob], "image.dcm");
                const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

                const image = await cornerstone.loadImage(imageId);
                cornerstone.displayImage(element, image);

                cornerstone.fitToWindow(element);
            } catch (err) {
                console.error("Błąd ładowania DICOM:", err);
            }
        };

        loadDicom();

        return () => {
            cornerstone.disable(element);
        };
    }, [blobUrl]);

    return (
        <div className="flex flex-col items-center w-full h-full bg-black rounded-lg overflow-hidden">

            <div
                ref={viewerRef}
                style={{ width: '512px', height: '512px' }}
                className="dicom-canvas"
            />
            <p className="text-white text-xs mt-2">Dicom Viewer (Cornerstone.js)</p>
        </div>
    );
}