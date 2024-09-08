<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Resource extends Model
{
    use HasUlids;

    protected $fillable = ['name'];

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class);
    }
}
