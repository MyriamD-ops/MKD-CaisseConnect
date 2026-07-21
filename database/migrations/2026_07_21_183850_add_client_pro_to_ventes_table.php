<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventes', function (Blueprint $table) {
            $table->unsignedBigInteger('id_client_pro')->nullable()->after('id_utilisateur');
            $table->string('type_client')->default('B2C')->after('id_client_pro'); // B2C ou B2B

            $table->foreign('id_client_pro')->references('id_client')->on('clients_pro')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('ventes', function (Blueprint $table) {
            $table->dropForeign(['id_client_pro']);
            $table->dropColumn(['id_client_pro', 'type_client']);
        });
    }
};
