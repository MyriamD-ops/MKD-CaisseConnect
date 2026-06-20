import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRScanner({ onScan, onClose }) {
    const scannerRef = useRef(null);
    const [scanner, setScanner] = useState(null);

    useEffect(() => {
        if (!scannerRef.current) return;

        const qrScanner = new Html5QrcodeScanner(
            "qr-reader",
            { 
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
            false
        );

        qrScanner.render(
            (decodedText) => {
                // QR code scanné avec succès
                console.log('✅ QR scanné:', decodedText);
                qrScanner.clear();
                onScan(decodedText);
            },
            (error) => {
                // Erreur de scan (normal pendant le scan)
                // On ignore les erreurs de scan en cours
            }
        );

        setScanner(qrScanner);

        return () => {
            if (qrScanner) {
                qrScanner.clear().catch(err => console.log('Cleanup error:', err));
            }
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '500px',
                width: '100%',
                position: 'relative'
            }}>
                <button
                    onClick={() => {
                        if (scanner) {
                            scanner.clear().catch(err => console.log('Error:', err));
                        }
                        onClose();
                    }}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: '#F8F9FA',
                        border: '1px solid #DEE2E6',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#495057',
                        zIndex: 10000
                    }}
                >
                    ×
                </button>

                <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2C3E50',
                    marginBottom: '16px',
                    textAlign: 'center'
                }}>
                    📷 Scanner un QR Code
                </h3>

                <div id="qr-reader" ref={scannerRef}></div>

                <p style={{
                    marginTop: '16px',
                    fontSize: '13px',
                    color: '#6C757D',
                    textAlign: 'center'
                }}>
                    Placez le QR code du produit devant la caméra
                </p>
            </div>
        </div>
    );
}
