<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\DeviceTypeCheck;

final readonly class DeviceTypeCheckQueries
{
    /** @param  array{}  $args */
    public function getDeviceChecksByTeam(null $root, array $args): mixed
    {
        return DeviceTypeCheck::where('team_id', auth()->user()->teams->first()->id)->get();
    }
}
