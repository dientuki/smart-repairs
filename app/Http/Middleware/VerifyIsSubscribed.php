<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyIsSubscribed
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $user = $request->user();


        if (!filament()->getTenant()->subscription->is_active) {
            dd('no esta activa la suscripcion');
            //if user admin, go to billin
            //if user not admin, go to error page
        }

        /*

        if ($user && $user->activePlanSubscriptions()->isEmpty()) {
            if(filament()->getTenant()){
                return redirect()->route('filament.'.filament()->getCurrentPanel()->getId().'.tenant.billing', ['tenant'=> filament()->getTenant()->{filament()->getCurrentPanel()->getTenantSlugAttribute()}]);
            }
            else {
                return redirect()->route('filament.'.filament()->getCurrentPanel()->getId().'.tenant.billing');
            }
        }
            */


        return $next($request);
    }
}
