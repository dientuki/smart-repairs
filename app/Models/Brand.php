<?php

namespace App\Models;

use App\Traits\HasImageTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    use HasImageTrait;

    protected string $imageField = 'hash_filename';

    protected $fillable = [
        'name',
        'hash_filename',
    ];
}
