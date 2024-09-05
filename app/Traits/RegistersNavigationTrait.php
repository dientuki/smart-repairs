<?php

namespace App\Traits;

use App\Models\Team;
use Filament\Facades\Filament;

trait RegistersNavigationTrait
{
    /**
     * Checks if the current resource should be registered in the navigation.
     *
     * @return bool
     */
    public static function shouldRegisterNavigation(): bool
    {
        $resource = str_replace(' ', '', strtolower(static::getModelLabel()));
        return Team::hasAccessToResource(Filament::getTenant(), $resource);
    }
}
