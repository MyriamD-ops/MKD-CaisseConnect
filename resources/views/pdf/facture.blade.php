<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', sans-serif; font-size: 12px; color: #1e293b; padding: 40px; }
        
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .brand-name { font-size: 22px; font-weight: 900; color: #047857; }
        .brand-tagline { font-size: 10px; color: #64748b; margin-top: 2px; }
        
        .facture-title { font-size: 28px; font-weight: 900; color: #0f172a; text-align: right; }
        .facture-numero { font-size: 14px; color: #047857; text-align: right; margin-top: 4px; }
        .facture-format { font-size: 9px; color: #94a3b8; text-align: right; margin-top: 2px; padding: 3px 8px; background: #f1f5f9; display: inline-block; border-radius: 4px; float: right; }
        
        .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .partie { width: 48%; }
        .partie-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 8px; }
        .partie-name { font-size: 14px; font-weight: 700; color: #0f172a; }
        .partie-info { font-size: 11px; color: #475569; line-height: 1.6; }
        
        .dates { margin-bottom: 30px; padding: 12px 16px; background: #f8fafc; border-radius: 8px; }
        .dates table { width: 100%; }
        .dates td { padding: 4px 0; font-size: 11px; }
        .dates .label { color: #64748b; font-weight: 600; }
        .dates .value { text-align: right; font-weight: 700; }
        
        table.lignes { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        table.lignes thead { background: #047857; color: white; }
        table.lignes th { padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        table.lignes th:last-child, table.lignes td:last-child { text-align: right; }
        table.lignes td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
        table.lignes tbody tr:nth-child(even) { background: #f8fafc; }
        
        .totaux { float: right; width: 280px; margin-bottom: 40px; }
        .totaux table { width: 100%; }
        .totaux td { padding: 6px 0; }
        .totaux .label { color: #64748b; }
        .totaux .value { text-align: right; font-weight: 600; }
        .totaux .total-row td { border-top: 2px solid #047857; padding-top: 10px; font-size: 16px; font-weight: 900; color: #047857; }
        
        .mentions { clear: both; padding-top: 30px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; line-height: 1.6; }
        
        .statut-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .statut-emise { background: #dbeafe; color: #1d4ed8; }
        .statut-transmise { background: #fef3c7; color: #b45309; }
        .statut-acceptee { background: #d1fae5; color: #065f46; }
        
        .footer { position: fixed; bottom: 30px; left: 40px; right: 40px; text-align: center; font-size: 9px; color: #cbd5e1; border-top: 1px solid #f1f5f9; padding-top: 10px; }
    </style>
</head>
<body>

    <!-- En-tête -->
    <table style="width:100%;margin-bottom:40px;">
        <tr>
            <td style="width:50%;vertical-align:top;">
                <div class="brand-name">{{ $business['name'] ?? 'MKD CaisseConnect' }}</div>
                @if(!empty($business['tagline']))
                    <div class="brand-tagline">{{ $business['tagline'] }}</div>
                @endif
            </td>
            <td style="width:50%;vertical-align:top;text-align:right;">
                <div class="facture-title">FACTURE</div>
                <div class="facture-numero">{{ $facture->numero_facture }}</div>
                <div style="margin-top:6px;">
                    <span class="facture-format">Format {{ $facture->format }}</span>
                </div>
            </td>
        </tr>
    </table>

    <!-- Parties -->
    <table style="width:100%;margin-bottom:30px;">
        <tr>
            <td style="width:48%;vertical-align:top;">
                <div class="partie-label">Émetteur</div>
                <div class="partie-name">{{ $business['name'] ?? 'MKD CaisseConnect' }}</div>
                <div class="partie-info">
                    SIRET : 000 000 000 00000 (démo)<br>
                    N° TVA : FR00000000000 (démo)
                </div>
            </td>
            <td style="width:4%;"></td>
            <td style="width:48%;vertical-align:top;">
                <div class="partie-label">Client</div>
                <div class="partie-name">{{ $facture->client->raison_sociale }}</div>
                <div class="partie-info">
                    SIRET : {{ $facture->client->siret_format }}<br>
                    @if($facture->client->numero_tva)
                        N° TVA : {{ $facture->client->numero_tva }}<br>
                    @endif
                    {{ $facture->client->adresse }}<br>
                    {{ $facture->client->code_postal }} {{ $facture->client->ville }}
                </div>
            </td>
        </tr>
    </table>

    <!-- Dates et statut -->
    <div class="dates">
        <table>
            <tr>
                <td class="label">Date d'émission</td>
                <td class="value">{{ $facture->date_emission->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td class="label">Date d'échéance</td>
                <td class="value">{{ $facture->date_echeance->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td class="label">Statut</td>
                <td class="value">
                    <span class="statut-badge statut-{{ strtolower(str_replace(' ', '-', $facture->statut)) }}">
                        {{ $facture->statut }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="label">Vente associée</td>
                <td class="value">{{ $facture->vente->numero_vente }}</td>
            </tr>
        </table>
    </div>

    <!-- Lignes de la facture -->
    <table class="lignes">
        <thead>
            <tr>
                <th>Désignation</th>
                <th>Qté</th>
                <th>P.U. HT</th>
                <th>Montant HT</th>
            </tr>
        </thead>
        <tbody>
            @foreach($facture->vente->lignes as $ligne)
                @php
                    $puTTC = (float) $ligne->prix_unitaire;
                    $puHT = round($puTTC / 1.20, 2);
                    $montantHT = round($puHT * $ligne->quantite, 2);
                @endphp
                <tr>
                    <td>{{ $ligne->produit->nom ?? 'Produit supprimé' }}</td>
                    <td>{{ $ligne->quantite }}</td>
                    <td>{{ number_format($puHT, 2, ',', ' ') }} €</td>
                    <td>{{ number_format($montantHT, 2, ',', ' ') }} €</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totaux -->
    <div class="totaux">
        <table>
            <tr>
                <td class="label">Total HT</td>
                <td class="value">{{ number_format((float)$facture->montant_ht, 2, ',', ' ') }} €</td>
            </tr>
            <tr>
                <td class="label">TVA (20%)</td>
                <td class="value">{{ number_format((float)$facture->montant_tva, 2, ',', ' ') }} €</td>
            </tr>
            <tr class="total-row">
                <td>Total TTC</td>
                <td class="value">{{ number_format((float)$facture->montant_ttc, 2, ',', ' ') }} €</td>
            </tr>
        </table>
    </div>

    <!-- Mentions légales -->
    <div class="mentions">
        <strong>Mentions légales :</strong> En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée (Art. L.441-10 du Code de commerce). 
        Indemnité forfaitaire de recouvrement : 40 € (Art. D.441-5 du Code de commerce).<br>
        Pas d'escompte pour paiement anticipé. TVA non applicable si auto-entrepreneur (Art. 293 B du CGI).<br><br>
        <em>Ce document est une facture électronique au format {{ $facture->format }}, conforme à la réforme de la facturation électronique 2026.</em>
    </div>

    <!-- Pied de page -->
    <div class="footer">
        {{ $business['name'] ?? 'MKD CaisseConnect' }} — Facture générée automatiquement — {{ $facture->numero_facture }}
    </div>

</body>
</html>
