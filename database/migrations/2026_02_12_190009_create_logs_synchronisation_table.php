<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logs_synchronisation', function (Blueprint $table) {
            $table->id('id_log');
            $table->enum('type_sync', ['produits', 'ventes', 'stocks', 'complet'])->default('complet');
            $table->enum('statut', ['succes', 'echec', 'partiel'])->default('succes');
            $table->integer('nombre_enregistrements')->default(0);
            $table->text('message_erreur')->nullable();
            $table->timestamp('date_sync');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logs_synchronisation');
    }
};
