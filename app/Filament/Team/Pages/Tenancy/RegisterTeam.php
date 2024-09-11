<?php

namespace App\Filament\Team\Pages\Tenancy;

use App\Models\Admin\Package;
use App\Models\Admin\Subscription;
use App\Models\Team;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\Tenancy\RegisterTenant;
use Filament\Actions\Action;

class RegisterTeam extends RegisterTenant
{
    /**
     * Retrieves the label for the team.
     *
     * @return string The label for the team.
     */
    public static function getLabel(): string
    {
        // Implement the logic for getting the label here
        return __('pages.team_creation');
    }

    public function getRegisterFormAction(): Action
    {
        return Action::make('register')
            ->label(__('pages.create'))
            ->submit('register');
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->label(__('pages.team'))
                    ->maxLength(255)
                    ->required()
                    ->hint(__('pages.team_hint'))
                    ->helperText(__('pages.team_helper'))
                    ->autofocus(),
            ]);
    }

    /**
     * Handles the registration process.
     *
     * @param array $data The data for the registration.
     * @return Team The newly created team.
     */
    protected function handleRegistration(array $data): Team
    {
        $team = Team::create($data);

        $package = Package::where('default', true)->first();
        Subscription::create([
            'team_id' => $team->id,
            'package_id' => $package->id,
            'trial_end_at' => now()->addDays(15),
            'start_at' => now(),
            'end_at' => now()->addMonth(),
            'is_active' => true,
        ]);

        $team->members()->attach(auth()->user());

        return $team;
    }
}
