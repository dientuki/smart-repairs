<?php

namespace App\Filament\Team\Pages;

use App\Http\Middleware\VerifyIsSubscribed;
use Filament\Facades\Filament;
use Filament\Pages\Concerns\HasMaxWidth;
use Filament\Pages\Page;
use Filament\Panel;
use Filament\Panel\Concerns\HasTopbar;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Support\Facades\Route;

class Billing extends Page
{

    use HasTopbar;
    use HasMaxWidth;

    public $user;
    public $tenant;

    protected static string $layout = 'filament.team.layouts.billing';

    protected static string $view = 'filament.team.pages.billing';

    protected static string | array $withoutRouteMiddleware = VerifyIsSubscribed::class;

    public static function registerRoutes(Panel $panel): void
    {
        Route::name('tenant.')->group(fn () => static::routes($panel));
    }

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    public static function getRouteName(?string $panel = null): string
    {
        return ( $panel ? $panel->getId() : Filament::getCurrentPanel()->getId()) ? "filament." . ( $panel ? $panel->getId() : Filament::getCurrentPanel()->getId()) .  ".tenant.billing": 'filament.tenant.billing'; ;
    }

    public function getMaxWidth(): MaxWidth | string | null
    {
        return MaxWidth::FiveExtraLarge;
    }

    protected function getLayoutData(): array
    {
        return [
            'hasTopbar' => $this->hasTopbar(),
            'maxWidth' => $this->getMaxWidth(),
        ];
    }

    public function mount()
    {
        $this->user = Filament::auth()->getUser();
        $this->tenant = Filament::getTenant();

        //dd($this->user->getRoleInTeam('getRoleInTeam'));
    }
}
