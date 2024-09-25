<?php

namespace App\Models;

use App\Traits\HasTeamTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Discount extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = [
        'name',
        'price',
        'is_active',
        'team_id'
    ];

    public function budgetItems()
    {
        return $this->morphMany(BudgetItem::class, 'itemable');
    }

    public function label(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->name
        );
    }
}
