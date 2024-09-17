<?php

namespace App\Models;

use App\Traits\HasTeamTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;

class ServiceJob extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = [
        'name',
        'price',
        'discount_type',
        'discount_value',
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
