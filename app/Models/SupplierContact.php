<?php

namespace App\Models;

use Filament\Facades\Filament;
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
                $tenant = Filament::getTenant();
                $contact->team_id = $tenant->id;
            }
        });

        static::updating(function ($contact) {
            if (auth()->check()) {
                $tenant = Filament::getTenant();
                $contact->team_id = $tenant->id;
            }
        });
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
