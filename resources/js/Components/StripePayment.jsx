import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Charger Stripe avec la clé publique (injectée via Vite)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE);

/**
 * Formulaire de paiement interne (dans le contexte Elements).
 */
function CheckoutForm({ amount, onSuccess, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message);
            setProcessing(false);
            return;
        }

        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (confirmError) {
            setError(confirmError.message);
            setProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <PaymentElement options={{
                    layout: 'accordion',
                }} />
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="flex-1 py-3 text-sm font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 shadow-lg shadow-emerald-700/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Traitement…
                        </span>
                    ) : (
                        `Payer ${amount.toFixed(2)} €`
                    )}
                </button>
            </div>
        </form>
    );
}

/**
 * Composant principal : récupère le clientSecret puis affiche le formulaire.
 *
 * Props:
 *   amount     - Montant en euros (ex: 6.20)
 *   onSuccess  - Callback appelé avec le PaymentIntent réussi
 *   onCancel   - Callback pour fermer/annuler le paiement
 */
export default function StripePayment({ amount, onSuccess, onCancel }) {
    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initPayment = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post('/stripe/create-payment-intent', { amount });
            setClientSecret(data.clientSecret);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création du paiement');
        } finally {
            setLoading(false);
        }
    };

    // Si pas encore de clientSecret, afficher le bouton d'initialisation
    if (!clientSecret) {
        return (
            <div className="text-center">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}
                <button
                    onClick={initPayment}
                    disabled={loading}
                    className="w-full py-3 text-sm font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 shadow-lg shadow-emerald-700/30 transition-all disabled:opacity-50"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Préparation du paiement…
                        </span>
                    ) : (
                        `Payer ${amount.toFixed(2)} € par carte`
                    )}
                </button>
                {onCancel && (
                    <button onClick={onCancel} className="mt-2 text-sm text-slate-500 hover:text-slate-700">
                        Annuler
                    </button>
                )}
            </div>
        );
    }

    // Afficher le Payment Element
    return (
        <Elements stripe={stripePromise} options={{
            clientSecret,
            appearance: {
                theme: 'stripe',
                variables: {
                    colorPrimary: '#047857',
                    borderRadius: '8px',
                },
            },
        }}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
    );
}
