<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Package extends Model
{
    use HasUlids;

    protected $fillable = ['name'];

    public function resources(): BelongsToMany
    {
        return $this->belongsToMany(Resource::class, 'package_resources', 'package_id', 'resource_id');
    }
}
