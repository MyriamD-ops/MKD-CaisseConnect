<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('variantes', function (Blueprint $table) {
            $table->id('id_variante');
            $table->foreignId('id_produit')->constrained('produits', 'id_produit')->onDelete('cascade');
            $table->string('taille')->nullable();
            $table->string('couleur')->nullable();
            $table->string('matiere')->nullable();
            $table->integer('stock_quantite')->default(0);
            $table->decimal('ajustement_prix', 10, 2)->default(0);
            $table->string('sku')->nullable()->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('variantes');
    }
};
