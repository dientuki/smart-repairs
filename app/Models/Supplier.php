<?php

namespace App\Models;

use App\Traits\HasTeamTrait;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = ['name', 'address', 'phone', 'email', 'website', 'team_id'];

    public function contacts(): HasMany
    {
        return $this->hasMany(SupplierContact::class);
    }

    public function stocks(): BelongsToMany
    {
        return $this->belongsToMany(Stock::class, 'stock_supplier')->withPivot('price');
    }
}
