<?php

namespace App\Models\Admin;

use App\Traits\IdAttributeUppercaseTrait;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    use HasUlids;
    use IdAttributeUppercaseTrait;

    protected $fillable = ['name'];

    public function resources(): BelongsToMany
    {
        return $this->belongsToMany(Resource::class, 'package_resources', 'package_id', 'resource_id');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}
