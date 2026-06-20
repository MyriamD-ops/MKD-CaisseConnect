<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('evenements', function (Blueprint $table) {
            if (!Schema::hasColumn('evenements', 'code_unique')) {
                $table->string('code_unique', 20)->unique()->after('id_evenement');
            }
            if (!Schema::hasColumn('evenements', 'statut')) {
                $table->enum('statut', ['planifie', 'en_cours', 'termine'])->default('planifie')->after('description');
            }
        });
    }

    public function down(): void
    {
        Schema::table('evenements', function (Blueprint $table) {
            $table->dropColumn(['code_unique', 'statut']);
        });
    }
};
