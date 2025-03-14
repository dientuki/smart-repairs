<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Billing;
use App\Filament\Team\Pages\Auth\TeamEditProfile;
use App\Filament\Team\Pages\Auth\TeamLogin;
use App\Filament\Team\Pages\Tenancy\EditTeamProfile;
use App\Filament\Team\Pages\Tenancy\RegisterTeam;
use App\Models\Team;
use App\Providers\SubscriptionsProvider;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\MenuItem;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Illuminate\Support\Facades\Config;

class TeamPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        $domain = Config::get('app.domain', 'localhost');
        $id = 'team';

        return $panel
            ->default()
            ->id($id)
            ->path($id)
            ->login(TeamLogin::class)
            ->registration()
            ->passwordReset()
            ->profile(TeamEditProfile::class)
            ->domain($id . '.' . $domain)
            ->colors([
                'danger' => Color::Red,
                'gray' => Color::Stone,
                'info' => Color::Indigo,
                'primary' => Color::Sky,
                'success' => Color::Emerald,
                'warning' => Color::Yellow,
            ])
            ->discoverResources(in: app_path('Filament/Team/Resources'), for: 'App\\Filament\\Team\\Resources')
            ->discoverPages(in: app_path('Filament/Team/Pages'), for: 'App\\Filament\\Team\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Team/Widgets'), for: 'App\\Filament\\Team\\Widgets')
            ->widgets([
                Widgets\AccountWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->tenant(Team::class)
            ->tenantRegistration(RegisterTeam::class)
            ->tenantProfile(EditTeamProfile::class)
            ->tenantMenuItems([
                'register' => MenuItem::make()->hidden(),
                'billing' => MenuItem::make()->visible(),
                //take a look https://filamentphp.com/docs/3.x/panels/tenancy#conditionally-hiding-tenant-menu-items
            ])
            ->tenantBillingProvider(new SubscriptionsProvider())
            ->requiresTenantSubscription();
    }
}
