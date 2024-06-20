<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\DeviceUnit;

final readonly class DeviceUnitQueries
{
    public static function getDeviceUnits()
    {
        return DeviceUnit::where('team_id', auth()->user()->teams->first()->id)->get();
    }
}
