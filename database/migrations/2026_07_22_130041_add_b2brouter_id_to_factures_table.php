<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('factures', function (Blueprint $table) {
            $table->string('b2brouter_id')->nullable()->after('stripe_payment_intent');
            $table->string('b2brouter_status')->nullable()->after('b2brouter_id');
        });
    }

    public function down(): void
    {
        Schema::table('factures', function (Blueprint $table) {
            $table->dropColumn(['b2brouter_id', 'b2brouter_status']);
        });
    }
};
