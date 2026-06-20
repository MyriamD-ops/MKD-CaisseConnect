<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mouvements_stock', function (Blueprint $table) {
            $table->id('id_mouvement');
            $table->foreignId('id_produit')->constrained('produits', 'id_produit')->onDelete('cascade');
            $table->foreignId('id_variante')->nullable()->constrained('variantes', 'id_variante')->onDelete('set null');
            $table->enum('type_mouvement', ['entree', 'sortie', 'ajustement', 'inventaire'])->default('ajustement');
            $table->integer('variation_quantite');
            $table->integer('stock_avant');
            $table->integer('stock_apres');
            $table->string('reference')->nullable();
            $table->foreignId('id_utilisateur')->constrained('users', 'id')->onDelete('cascade');
            $table->timestamp('date_mouvement');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mouvements_stock');
    }
};
