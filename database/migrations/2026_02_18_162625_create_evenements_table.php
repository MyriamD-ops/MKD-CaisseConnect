<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Table pivot pour associer produits aux événements
        Schema::create('evenement_produit', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evenement_id')->constrained('evenements', 'id_evenement')->onDelete('cascade');
            $table->foreignId('produit_id')->constrained('produits', 'id_produit')->onDelete('cascade');
            $table->integer('stock_evenement')->default(0); // Stock dédié à cet événement
            $table->timestamps();
            
            $table->unique(['evenement_id', 'produit_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evenement_produit');
    }
};
