<?php

namespace App\Providers;

use App\Http\Middleware\VerifyIsSubscribed;
use Filament\Billing\Providers\Contracts\Provider;
use Illuminate\Http\RedirectResponse;
use Closure;

class SubscriptionsProvider implements Provider
{
    public function getRouteAction(): string | Closure
    {
        return function (): RedirectResponse {
            dd(  filament()->getTenant() );
            return redirect()->route(
                'filament.'.filament()->getCurrentPanel()->getId().'.tenant.billing',
                ['tenant'=> filament()->getTenant()->id]);
        };
    }

    public function getSubscribedMiddleware(): string
    {
        return VerifyIsSubscribed::class;
    }
}
