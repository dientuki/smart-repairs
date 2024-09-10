<?php

namespace App\Traits;

use App\Models\Team;
use Filament\Facades\Filament;

trait RegistersNavigationTrait
{
    public static function getResourceName(): string
    {
        $className = basename(str_replace('\\', '/', static::class));
        $nameWithoutResource = str_replace('Resource', '', $className);

        return strtolower($nameWithoutResource);
    }

    /**
     * Checks if the current resource should be registered in the navigation.
     *
     * @return bool
     */
    public static function shouldRegisterNavigation(): bool
    {
        return Team::hasAccessToResource(Filament::getTenant(), static::getResourceName());
    }

    public static function canAccess(): bool
    {
        return Team::hasAccessToResource(Filament::getTenant(), static::getResourceName());
    }
}
