<?php

namespace App\Models;

use App\Traits\HasImageTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeviceType extends ModelAuditable
{
    use HasFactory;

    use HasImageTrait;

    protected string $imageField = 'hash_filename';

    protected $fillable = [
        'name',
        'hash_filename',
    ];
}
