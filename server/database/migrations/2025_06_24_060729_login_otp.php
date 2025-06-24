<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class LoginOtp extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('login_otp', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('staff_id')->constrained('staff')->onDelete('cascade');
            $table->string('otp_code', 10);
            $table->dateTime('expired_at');
            $table->boolean('is_used')->default(false);
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
        Schema::dropIfExists('login_otp');
    }
}
