<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients_pro', function (Blueprint $table) {
            $table->id('id_client');
            $table->string('raison_sociale');
            $table->string('siret', 14);
            $table->string('numero_tva')->nullable(); // FR + 11 chiffres
            $table->string('adresse');
            $table->string('code_postal', 10);
            $table->string('ville');
            $table->string('email')->nullable();
            $table->string('telephone')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients_pro');
    }
};
