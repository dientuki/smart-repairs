<?php

namespace App\Models\Admin;

use App\Models\Team;
use App\Traits\IdAttributeUppercaseTrait;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasUlids;
    use IdAttributeUppercaseTrait;

    protected $fillable = [
        'team_id',
        'package_id',
        'trial_end_at',
        'start_at',
        'end_at',
        'is_active',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
