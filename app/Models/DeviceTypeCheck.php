<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceTypeCheck extends ModelWithTeam
{
    protected $fillable = ['device_type_id', 'team_id', 'damages', 'features'];

    protected function casts():array {
        return [
            'damages' => 'array',
            'features' => 'array',
        ];
    }

    public static function getDeviceChecks(null $root, array $args) {
        return self::where('device_type_id', $args['device_type_id'])
            ->where('team_id', auth()->user()->teams->first()->id)
            ->get();
    }

    public function device_type():BelongsTo {
        return $this->belongsTo(DeviceType::class);
    }
}
