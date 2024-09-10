<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Budget extends ModelWithTeam
{
    protected $fillable = ['order_id', 'user_id', 'total'];

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
