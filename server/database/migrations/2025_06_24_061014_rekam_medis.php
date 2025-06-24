<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RekamMedis extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rekam_medis', function (Blueprint $table) {
                    $table->bigIncrements('id');
                    $table->foreignId('pasien_id')->constrained('pasien')->onDelete('cascade');
                    $table->foreignId('dibuat_oleh')->constrained('staff')->onDelete('cascade');
                    $table->longText('data'); // bisa JSON atau TEXT
                    $table->enum('status', ['draft', 'menunggu_approval', 'disetujui', 'ditolak']);
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
        Schema::dropIfExists('rekam_medis');
    }
}
