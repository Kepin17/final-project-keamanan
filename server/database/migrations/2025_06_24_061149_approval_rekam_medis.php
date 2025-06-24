<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ApprovalRekamMedis extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('approval_rekam_medis', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->foreignId('rekam_medis_id')->constrained('rekam_medis')->onDelete('cascade');
                $table->foreignId('dokter_id')->constrained('staff')->onDelete('cascade');
                $table->enum('status', ['approved', 'rejected']);
                $table->text('catatan')->nullable();
                $table->dateTime('tanggal');
                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('approval_rekam_medis');
    }
}
