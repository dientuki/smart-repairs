<?php

namespace App\Models;

use App\Traits\HasTeamTrait;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Budget extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = [
        'order_id',
        'user_id',
        'total',
        'subtotal',
        'discount',
        'status',
        'valid_until',
        'team_id'
    ];

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
