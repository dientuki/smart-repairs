<?php

namespace App\Filament\Team\Pages\Auth;

use Filament\Pages\Auth\Login;
use DanHarrin\LivewireRateLimiting\Exceptions\TooManyRequestsException;
use Filament\Facades\Filament;
use Filament\Http\Responses\Auth\Contracts\LoginResponse;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Validation\ValidationException;

class TeamLogin extends Login
{
  /**
   * @var view-string
   */
    protected static string $view = 'filament.team.pages.auth.login';


    public function authenticate(): ?LoginResponse
    {
        try {
            $this->rateLimit(5);
        } catch (TooManyRequestsException $exception) {
            $this->getRateLimitedNotification($exception)?->send();

            return null;
        }

        $data = $this->form->getState();

        if (! Filament::auth()->attempt($this->getCredentialsFromFormData($data), $data['remember'] ?? false)) {
            $this->throwFailureValidationException();
        }

        $user = Filament::auth()->user();

        if (
            ($user instanceof FilamentUser) &&
            (! $user->canAccessPanel(Filament::getCurrentPanel()))
        ) {
            Filament::auth()->logout();

            $this->throwFailureValidationException();
        }

        if (!$user->hasActiveTenant) {
            Filament::auth()->logout();
            $this->throwFailureTenantException();
        }

        session()->regenerate();

        return app(LoginResponse::class);
    }

    protected function throwFailureTenantException(): never
    {
        throw ValidationException::withMessages([
        'tenant' => __('subscription.inactive'),
        ]);
    }
}
