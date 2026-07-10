<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class StripeController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('stripe.secret'));
    }

    /**
     * Créer un PaymentIntent pour le montant d'une vente.
     * Appelé en AJAX depuis le formulaire de vente.
     */
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.50',
        ]);

        // Stripe attend le montant en centimes
        $amountCents = (int) round($request->amount * 100);

        $paymentIntent = PaymentIntent::create([
            'amount'   => $amountCents,
            'currency' => config('stripe.currency', 'eur'),
            'automatic_payment_methods' => ['enabled' => true],
            'metadata' => [
                'source' => 'mkd-caisseconnect',
            ],
        ]);

        return response()->json([
            'clientSecret' => $paymentIntent->client_secret,
        ]);
    }

    /**
     * Webhook Stripe — traite les événements de paiement.
     * L'URL doit être enregistrée dans le dashboard Stripe.
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
        } catch (\UnexpectedValueException $e) {
            return response('Invalid payload', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response('Invalid signature', 400);
        }

        switch ($event->type) {
            case 'payment_intent.succeeded':
                $paymentIntent = $event->data->object;
                // TODO: marquer la vente comme payée dans la base
                // $venteId = $paymentIntent->metadata->vente_id ?? null;
                logger()->info('Paiement Stripe réussi', [
                    'payment_intent' => $paymentIntent->id,
                    'amount'         => $paymentIntent->amount / 100,
                ]);
                break;

            case 'payment_intent.payment_failed':
                $paymentIntent = $event->data->object;
                logger()->warning('Paiement Stripe échoué', [
                    'payment_intent' => $paymentIntent->id,
                    'error'          => $paymentIntent->last_payment_error?->message,
                ]);
                break;
        }

        return response('OK', 200);
    }
}
