<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetItem extends ModelWithTeam
{
    protected $fillable = [
        'budget_id',
        'part_id',
        'service_job_id',
        'quantity',
        'unit_price',
        'include_in_sum',
    ];

    /**
     * Get the budget that owns the budget item.
     */
    public function budget(): BelongsTo
    {
        return $this->belongsTo(Budget::class);
    }

    /**
     * Get the part associated with the budget item.
     */
    public function part(): BelongsTo
    {
        return $this->belongsTo(Part::class);
    }

    /**
     * Get the service job associated with the budget item.
     */
    public function serviceJob(): BelongsTo
    {
        return $this->belongsTo(ServiceJob::class);
    }
}
