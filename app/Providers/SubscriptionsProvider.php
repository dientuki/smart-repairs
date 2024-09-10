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
            //dd(  filament()->getTenant() );
           // dd(filament()->getTenant()->id);
           /*
            return redirect()->route(
                'filament.'.filament()->getCurrentPanel()->getId().'.tenant.billing',
                ['tenant'=> filament()->getTenant()->id]);
                */
          // go to billing page
            //dd(filament()->getCurrentPanel()->getId());
            //return redirect()->route('filament.pages.billing');
            return redirect()->route('/');
        };
    }

    public function getSubscribedMiddleware(): string
    {
        return VerifyIsSubscribed::class;
    }
}
