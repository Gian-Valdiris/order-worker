'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

import './scan.scss';

const Scanner = () => {

	return <>
		<h2>
			Not implemented!
		</h2>
	</>

	const router = useRouter();
	const videoRef = useRef<HTMLVideoElement>(null);
	const controlsRef = useRef<any>(null);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		const codeReader = new BrowserQRCodeReader();

		const startScanner = async () => {
			try {
				const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
				
				const backCamera = videoInputDevices.find(device => 
					device.label.toLowerCase().includes('back') || 
					device.label.toLowerCase().includes('rear')
				);

				const deviceId = backCamera?.deviceId || videoInputDevices[0]?.deviceId;

				if (videoRef.current && deviceId) {
					// decodeFromVideoDevice retorna un objeto controls
					const controls = await codeReader.decodeFromVideoDevice(
						deviceId,
						videoRef.current,
						(result, error) => {
							if (result) {
								const url = result.getText()?.toLowerCase();
								
								if (url && url.includes(window.location.hostname)) {
									// Usar controls.stop() para detener el scanner
									controls.stop();
									router.replace(url.substring(url.indexOf('/', url.indexOf('://') + 3)));
								}
							}
							
							if (error && !(error.name === 'NotFoundException')) {
								console.error('QR Scanner Error:', error);
							}
						}
					);

					// Guardar controls para cleanup
					controlsRef.current = controls;
				}
			} catch (err) {
				console.error('Error starting scanner:', err);
				setError('No se pudo acceder a la cámara');
			}
		};

		startScanner();

		// Cleanup
		return () => {
			if (controlsRef.current) {
				controlsRef.current.stop();
			}
		};
	}, [router]);

	return (
		<div className='scanner'>
			<h4 className='brandLogo'>Order Worder</h4>
			<div className='scannerPreview'>
				<video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
				{error && <p className='scannerError'>{error}</p>}
			</div>
			<p className='scannerDescription'>Please scan QR code on Your table</p>
		</div>
	);
};

export default Scanner;