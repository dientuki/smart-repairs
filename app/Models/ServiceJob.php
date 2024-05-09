<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceJob extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price'];

    public function team() {
        return $this->belongsTo(Team::class);
    }        
}
