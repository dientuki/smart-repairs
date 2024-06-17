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

    public static function checkToSelect():array {
        //@todo: improve https://www.answeroverflow.com/m/1136334340888989927#solution-1136340488786559106

        return DeviceType::whereNotIn('id', function ($query) {
            $query->select('device_type_id')
                ->from('device_type_checks')
                ->where('team_id', auth()->user()->teams->first()->id);
        })->pluck('name', 'id')->toArray();
    }

    public function device_type():BelongsTo {
        return $this->belongsTo(DeviceType::class);
    }
}
