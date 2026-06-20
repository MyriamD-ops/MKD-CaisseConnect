import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import Header from '../../Components/Header';
import { TEMPLATES } from '../../flyers/templates';

// ─── Modal de sélection de template ──────────────────────────────────────────
function FlyerTemplateModal({ onGenerate, onClose }) {
    const [selected, setSelected] = useState('prestige');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold text-dark mb-5">Choisir un template</h3>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    {TEMPLATES.map((tpl) => (
                        <button
                            key={tpl.id}
                            onClick={() => setSelected(tpl.id)}
                            style={{ backgroundColor: tpl.previewBg, color: tpl.previewText }}
                            className={`h-24 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border-2 ${
                                selected === tpl.id
                                    ? 'border-ember scale-105 shadow-md'
                                    : 'border-transparent opacity-80 hover:opacity-100'
                            }`}
                        >
                            <span className="text-2xl leading-none">{tpl.preview}</span>
                            <span className="text-sm font-semibold">{tpl.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onGenerate(selected)}
                        className="flex-1 h-11 flex items-center justify-center bg-ember hover:brightness-90 text-white font-bold rounded-xl text-sm transition-all"
                    >
                        📸 Générer
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 h-11 flex items-center justify-center bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark border border-slate/20 rounded-xl text-sm font-medium transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function Show({ evenement }) {
    const { auth } = usePage().props;
    const [generating, setGenerating]       = useState(false);
    const [showModal, setShowModal]         = useState(false);
    const [flyerError, setFlyerError]       = useState('');

    const downloadQR = () => {
        const svg = document.getElementById('qr-code-event');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `qr-event-${evenement.code_unique}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    const generateFlyer = async (templateId) => {
        setShowModal(false);
        setGenerating(true);
        setFlyerError('');

        const template = TEMPLATES.find((t) => t.id === templateId);
        const html = template.generateHTML(evenement);

        const container = document.createElement('div');
        container.style.cssText =
            'position:fixed;left:-9999px;top:0;width:1080px;height:1080px;overflow:hidden;';
        container.innerHTML = html;
        document.body.appendChild(container);

        try {
            const canvas = await html2canvas(container, {
                scale: 1,
                width: 1080,
                height: 1080,
                useCORS: true,
                allowTaint: false,
                logging: false,
            });

            const slug = evenement.nom
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
            const link = document.createElement('a');
            link.download = `flyer-${slug}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Erreur génération flyer:', err);
            setFlyerError('Erreur lors de la génération du flyer.');
        } finally {
            document.body.removeChild(container);
            setGenerating(false);
        }
    };

    const eventUrl = window.location.origin + '/events/' + evenement.code_unique;

    return (
        <div className="min-h-screen bg-snow">
            <Header currentPage="events" />

            <main className="p-4 lg:p-6 max-w-5xl mx-auto">
                <Link
                    href="/events"
                    className="inline-flex items-center gap-1 text-slate hover:text-dark text-sm mb-6 transition-colors"
                >
                    ← Retour aux événements
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informations événement */}
                    <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-6">
                        <h2 className="text-2xl font-bold text-dark mb-5">{evenement.nom}</h2>

                        <div className="divide-y divide-slate/10">
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm text-slate">Lieu</span>
                                <span className="text-sm font-medium text-dark">{evenement.lieu || 'Non précisé'}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm text-slate">Dates</span>
                                <span className="text-sm font-medium text-dark">
                                    {new Date(evenement.date_debut).toLocaleDateString('fr-FR')} → {new Date(evenement.date_fin).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm text-slate">Produits</span>
                                <span className="text-sm font-medium text-dark">{evenement.produits?.length || 0} produit(s)</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm text-slate">Code d'accès</span>
                                <span className="text-sm font-mono font-semibold text-dark">{evenement.code_unique}</span>
                            </div>
                        </div>

                        {/* URL publique */}
                        <div className="mt-5 p-3 bg-snow border border-slate/20 rounded-xl">
                            <p className="text-xs font-semibold text-dark uppercase tracking-widest mb-1.5">URL d'accès public</p>
                            <p className="text-xs text-slate font-mono break-all">{eventUrl}</p>
                        </div>

                        <div className="mt-5 flex flex-col gap-3">
                            <Link
                                href={`/events/${evenement.id_evenement}/edit`}
                                className="w-full h-11 flex items-center justify-center bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark border border-slate/20 rounded-xl text-sm font-medium transition-colors"
                            >
                                ✏️ Modifier l'événement
                            </Link>

                            {auth?.user && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    disabled={generating}
                                    className="w-full h-11 flex items-center justify-center bg-ember hover:bg-ember/90 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    {generating ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Génération...
                                        </>
                                    ) : '📸 Flyer Instagram'}
                                </button>
                            )}

                            {flyerError && (
                                <p className="text-xs text-red-600 text-center">{flyerError}</p>
                            )}
                        </div>
                    </div>

                    {/* QR Code clients */}
                    <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-6 flex flex-col items-center">
                        <h3 className="text-lg font-semibold text-dark mb-5 text-center">QR Code pour vos clients</h3>

                        <div className="p-6 bg-snow rounded-xl mb-4">
                            <QRCodeSVG
                                id="qr-code-event"
                                value={eventUrl}
                                size={220}
                                level="H"
                                marginSize={4}
                            />
                        </div>

                        <p className="text-sm text-slate text-center mb-5 leading-relaxed">
                            Vos clients scannent ce code pour voir votre catalogue
                        </p>

                        <button
                            onClick={downloadQR}
                            className="w-full h-11 bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark border border-slate/20 rounded-xl text-sm font-medium transition-colors mb-3"
                        >
                            📥 Télécharger le QR Code
                        </button>

                        <div className="w-full p-3 bg-ember/5 border border-ember/20 rounded-xl">
                            <p className="text-xs text-ember text-center font-medium">
                                💡 Affichez ce QR code sur votre stand !
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {showModal && (
                <FlyerTemplateModal
                    onGenerate={generateFlyer}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
