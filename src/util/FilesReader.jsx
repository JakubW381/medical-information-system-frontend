// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import axios from "axios";

export function cleanBase64(b64) {
    return b64.includes(",") ? b64.split(",")[1] : b64;
}

// base64 to byte array
export function base64ToByteArray(base64) {
    const clean = cleanBase64(base64);
    const binary = atob(clean)
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

export function detectFileType(base64) {
    const bytes = base64ToByteArray(base64)

    if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
        return "image/jpeg"
    }

    if (bytes[0] === 0x89 && bytes[1] === 0x50) {
        return "image/png"
    }

    if (bytes[0] === 0x25 && bytes[1] === 0x50) {
        return "application/pdf"
    }

    const dicm = new TextDecoder().decode(bytes.slice(128, 132));
    if (dicm === "DICM") {
        return "application/dicom";
    }

    return "unknown";
}

//Blob store huge amounts of binary data
export function base64ToBlob(base64, mimeType) {
    const bytes = base64ToByteArray(base64)
    return new Blob([bytes], {type: mimeType})
}

export async function fetchDocumentBase64(id) {
    try {
        const res = await axios.get(`http://localhost:8080/doc/patient/document/${id}`, {
            responseType: "text"
        });
        const rawBase64 = res.data;
        console.log("RAW:", rawBase64);
        console.log("RAW RESPONSE:", res.data);

        const mime = detectFileType(clean);

        return {base64: clean, mimeType: mime};
    } catch (error) {
        console.log(error)
    }


}

