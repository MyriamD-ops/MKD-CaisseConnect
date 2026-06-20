<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produits', function (Blueprint $table) {
            $table->id('id_produit');
            $table->string('nom');
            $table->text('description')->nullable();
            $table->string('categorie')->nullable();
            $table->string('matiere')->nullable();
            $table->decimal('prix_base', 10, 2);
            $table->integer('stock_actuel')->default(0);
            $table->integer('stock_minimum')->default(0);
            $table->string('code_barres')->nullable()->unique();
            $table->string('qr_code')->nullable()->unique();
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
