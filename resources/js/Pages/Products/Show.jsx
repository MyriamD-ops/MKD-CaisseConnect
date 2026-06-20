import { Link } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import Header from '../../Components/Header';

export default function Show({ product }) {
    const downloadQR = () => {
        const svg = document.getElementById('qr-code-barcode');
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
            downloadLink.download = `qr-${product.nom.replace(/\s+/g, '-')}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    const stockBas = product.stock_actuel <= product.stock_minimum;

    return (
        <div className="min-h-screen bg-snow">
            <Header currentPage="products" />

            <main className="p-4 lg:p-6 max-w-5xl mx-auto">
                <Link
                    href="/products"
                    className="inline-flex items-center gap-1 text-slate hover:text-dark text-sm mb-6 transition-colors"
                >
                    ← Retour aux produits
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informations produit */}
                    <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-6">
                        <div className="flex items-start justify-between gap-3 mb-5">
                            <h2 className="text-2xl font-bold text-dark">{product.nom}</h2>
                            <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                                stockBas
                                    ? 'bg-ruby/10 text-ruby border-ruby/20'
                                    : 'bg-mint/10 text-mint border-mint/20'
                            }`}>
                                {stockBas ? '⚠ Bas' : '✓ OK'}
                            </span>
                        </div>

                        {product.description && (
                            <p className="text-slate text-sm mb-5 leading-relaxed">{product.description}</p>
                        )}

                        <div className="space-y-0 divide-y divide-slate/10">
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm text-slate">Prix</span>
                                <span className="text-lg font-bold text-ember">{product.prix_base}€</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm text-slate">Catégorie</span>
                                <span className="text-sm font-medium text-dark">{product.categorie}</span>
                            </div>
                            {product.matiere && (
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-slate">Matériau</span>
                                    <span className="text-sm font-medium text-dark">{product.matiere}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm text-slate">Stock actuel</span>
                                <span className={`text-sm font-semibold ${stockBas ? 'text-ruby' : 'text-dark'}`}>
                                    {product.stock_actuel} unités
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm text-slate">Stock minimum</span>
                                <span className="text-sm font-medium text-dark">{product.stock_minimum} unités</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm text-slate">Code barre</span>
                                <span className="text-xs font-mono text-slate">{product.code_barres}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                href={`/products/${product.id_produit}/edit`}
                                className="w-full h-11 flex items-center justify-center bg-slate/10 hover:bg-slate/20 text-slate hover:text-dark border border-slate/20 rounded-xl text-sm font-medium transition-colors"
                            >
                                ✏️ Modifier
                            </Link>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white rounded-2xl border border-slate/20 shadow-sm p-6 flex flex-col items-center">
                        <h3 className="text-lg font-semibold text-dark mb-5 text-center">QR Code du produit</h3>

                        <div className="p-6 bg-snow rounded-xl mb-4">
                            <QRCodeSVG
                                id="qr-code-barcode"
                                value={product.code_barres}
                                size={200}
                                level="H"
                                marginSize={4}
                            />
                        </div>

                        <div className="w-full px-4 py-2.5 bg-snow border border-slate/20 rounded-xl mb-4">
                            <p className="text-xs text-slate text-center font-mono">{product.code_barres}</p>
                        </div>

                        <p className="text-sm text-slate text-center mb-5 leading-relaxed">
                            Scannez ce code lors d'une vente pour ajouter le produit automatiquement au panier
                        </p>

                        <button
                            onClick={downloadQR}
                            className="w-full h-11 bg-mint/10 hover:bg-mint/20 text-mint border border-mint/20 rounded-xl text-sm font-medium transition-colors mb-3"
                        >
                            📥 Télécharger le QR Code
                        </button>

                        <div className="w-full p-3 bg-ember/5 border border-ember/20 rounded-xl">
                            <p className="text-xs text-ember text-center font-medium">
                                💡 Imprimez ce QR code pour vos étiquettes produit
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
