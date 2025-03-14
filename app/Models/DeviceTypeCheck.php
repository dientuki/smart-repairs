<?php

namespace App\Models;

use App\Traits\HasTeamTrait;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceTypeCheck extends ModelAuditable
{
    use HasTeamTrait;

    protected $fillable = ['device_type_id', 'team_id', 'damages', 'features'];

    protected function casts(): array
    {
        return [
            'damages' => 'array',
            'features' => 'array',
        ];
    }

    public function deviceType(): BelongsTo
    {
        return $this->belongsTo(DeviceType::class);
    }
}
