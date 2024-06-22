<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplierContact extends ModelWithTeam
{
    protected $fillable = [
        'supplier_id',
        'team_id',
        'firstname',
        'lastname',
        'email',
        'phone',
    ];

    protected static function booted()
    {
        static::creating(function ($contact) {
            if (auth()->check()) {
                $contact->team_id = auth()->user()->teams->first()->id;
            }
        });

        static::updating(function ($contact) {
            if (auth()->check()) {
                $contact->team_id = auth()->user()->teams->first()->id;
            }
        });
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
