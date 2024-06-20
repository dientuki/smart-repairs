<?php

namespace App\Auditing\Resolvers;

use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Contracts\Resolver;

class TeamIdResolver implements Resolver
{
    public static function resolve(Auditable $auditable = null)
    {
        if (method_exists($auditable, 'team')) {
            return $auditable->team_id;
        }

        return null;
    }
}
