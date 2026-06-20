<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alertes_stock', function (Blueprint $table) {
            $table->id('id_alerte');
            $table->foreignId('id_produit')->constrained('produits', 'id_produit')->onDelete('cascade');
            $table->foreignId('id_variante')->nullable()->constrained('variantes', 'id_variante')->onDelete('set null');
            $table->integer('stock_actuel');
            $table->integer('seuil');
            $table->enum('statut', ['active', 'resolue'])->default('active');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alertes_stock');
    }
};
