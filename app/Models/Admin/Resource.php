<?php

namespace App\Models\Admin;

use App\Traits\IdAttributeUppercaseTrait;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Resource extends Model
{
    use HasUlids;
    use IdAttributeUppercaseTrait;

    protected $fillable = ['name'];

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class);
    }
}
