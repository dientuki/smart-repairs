<?php

namespace App\Models;

use App\Traits\HasTeamTrait;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Budget extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = [
        'order_id',
        'user_id',
        'subtotal',
        'discount',
        'status',
        'valid_until',
        'team_id'
    ];

    public function total(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => $attributes['subtotal'] - $attributes['discount'],
        );
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the budget.
     */
    public function items(): HasMany
    {
        return $this->hasMany(BudgetItem::class);
    }
}
