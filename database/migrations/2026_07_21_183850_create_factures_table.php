<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('factures', function (Blueprint $table) {
            $table->id('id_facture');
            $table->string('numero_facture')->unique(); // FAC-2026-0001
            $table->unsignedBigInteger('id_vente');
            $table->unsignedBigInteger('id_client');
            $table->decimal('montant_ht', 10, 2);
            $table->decimal('montant_tva', 10, 2);
            $table->decimal('montant_ttc', 10, 2);
            $table->date('date_emission');
            $table->date('date_echeance'); // +30 jours par défaut
            $table->string('statut')->default('Brouillon');
            // Statuts : Brouillon → Émise → Transmise PA → Acceptée / Rejetée
            $table->string('format')->default('Factur-X'); // Factur-X, UBL, CII
            $table->string('pdf_path')->nullable();
            $table->string('stripe_payment_intent')->nullable();
            $table->timestamp('transmitted_at')->nullable(); // date d'envoi PA
            $table->timestamps();

            $table->foreign('id_vente')->references('id_vente')->on('ventes')->onDelete('cascade');
            $table->foreign('id_client')->references('id_client')->on('clients_pro')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};
