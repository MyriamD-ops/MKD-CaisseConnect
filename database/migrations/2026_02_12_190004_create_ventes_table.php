<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventes', function (Blueprint $table) {
            $table->id('id_vente');
            $table->string('numero_vente')->unique();
            $table->foreignId('id_utilisateur')->constrained('users', 'id')->onDelete('cascade');
            $table->foreignId('id_evenement')->nullable()->constrained('evenements', 'id_evenement')->onDelete('set null');
            $table->decimal('montant_total', 10, 2);
            $table->string('moyen_paiement')->default('Espèces');
            $table->string('statut')->default('Terminée');
            $table->timestamp('date_vente')->nullable();
            $table->boolean('synchronisee')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventes');
    }
};
