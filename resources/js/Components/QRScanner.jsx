import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const READER_ID = 'qr-reader';

const cameraLabel = (camera, index) => {
    const label = (camera.label || '').toLowerCase();
    if (/back|arrière|arriere|rear|environment/.test(label)) return 'Caméra arrière';
    if (/front|avant|user|selfie/.test(label)) return 'Caméra avant';
    return `Caméra ${index + 1}`;
};

const pickDefaultCameraId = (list) => {
    const back = list.find(c => /back|arrière|arriere|rear|environment/i.test(c.label || ''));
    return (back || list[list.length - 1] || list[0])?.id;
};

export default function QRScanner({ onScan, onClose }) {
    const html5QrcodeRef = useRef(null);
    const [cameras, setCameras] = useState([]);
    const [activeCameraId, setActiveCameraId] = useState(null);
    const [starting, setStarting] = useState(true);
    const [error, setError] = useState(null);

    const startCamera = async (cameraId) => {
        const instance = html5QrcodeRef.current;
        if (!instance || !cameraId) return;
        try {
            setStarting(true);
            setError(null);
            if (instance.isScanning) {
                await instance.stop().catch(() => {});
            }
            await instance.start(
                cameraId,
                { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
                (decodedText) => onScan(decodedText),
                () => {}
            );
            setActiveCameraId(cameraId);
        } catch (err) {
            console.error('Erreur démarrage caméra:', err);
            setError("Impossible d'accéder à cette caméra");
        } finally {
            setStarting(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        const html5Qrcode = new Html5Qrcode(READER_ID);
        html5QrcodeRef.current = html5Qrcode;

        Html5Qrcode.getCameras()
            .then((list) => {
                if (cancelled) return;
                setCameras(list);
                const defaultId = pickDefaultCameraId(list);
                if (defaultId) {
                    startCamera(defaultId);
                } else {
                    setError('Aucune caméra détectée');
                    setStarting(false);
                }
            })
            .catch((err) => {
                console.error('Erreur accès caméra:', err);
                if (!cancelled) {
                    setError("Impossible d'accéder à la caméra — vérifiez les autorisations du navigateur");
                    setStarting(false);
                }
            });

        return () => {
            cancelled = true;
            const instance = html5QrcodeRef.current;
            if (instance && instance.isScanning) {
                instance.stop().then(() => instance.clear()).catch(() => {});
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const switchToNextCamera = () => {
        if (cameras.length < 2) return;
        const currentIndex = cameras.findIndex(c => c.id === activeCameraId);
        const next = cameras[(currentIndex + 1) % cameras.length];
        startCamera(next.id);
    };

    const handleClose = () => {
        const instance = html5QrcodeRef.current;
        if (instance && instance.isScanning) {
            instance.stop().then(() => instance.clear()).catch(() => {});
        }
        onClose();
    };

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
                    onClick={handleClose}
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

                <div id={READER_ID}></div>

                {starting && (
                    <p style={{ marginTop: '12px', fontSize: '13px', color: '#6C757D', textAlign: 'center' }}>
                        Activation de la caméra...
                    </p>
                )}

                {error && (
                    <p style={{ marginTop: '12px', fontSize: '13px', color: '#DC3545', textAlign: 'center', fontWeight: 500 }}>
                        {error}
                    </p>
                )}

                {/* Bouton unique — cas le plus fréquent sur mobile : avant/arrière */}
                {cameras.length === 2 && (
                    <button
                        onClick={switchToNextCamera}
                        style={{
                            marginTop: '16px',
                            width: '100%',
                            height: '48px',
                            background: '#ECFDF5',
                            color: '#059669',
                            border: '1px solid #A7F3D0',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Changer de caméra
                    </button>
                )}

                {/* Liste de boutons — cas de plus de 2 caméras (rare, ex: webcams externes) */}
                {cameras.length > 2 && (
                    <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {cameras.map((camera, index) => (
                            <button
                                key={camera.id}
                                onClick={() => startCamera(camera.id)}
                                style={{
                                    flex: '1 1 auto',
                                    minWidth: '140px',
                                    height: '48px',
                                    padding: '0 12px',
                                    background: activeCameraId === camera.id ? '#059669' : '#FFFFFF',
                                    color: activeCameraId === camera.id ? '#FFFFFF' : '#495057',
                                    border: `1px solid ${activeCameraId === camera.id ? '#059669' : '#DEE2E6'}`,
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {cameraLabel(camera, index)}
                            </button>
                        ))}
                    </div>
                )}

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
