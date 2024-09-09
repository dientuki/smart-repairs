<?php

namespace App\Filament\Team\Pages\Tenancy;

use App\Models\Admin\Package;
use App\Models\Admin\Subscription;
use App\Models\Team;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\Tenancy\RegisterTenant;

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
        return 'Team name';
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->label('Team name')
                    ->maxLength(255)
                    ->required()
                    ->helperText('The name of the team')
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

        /*
        $package = Package::where('default', true)->first();
        Subscription::create([
            'team_id' => $team->id,
            'package_id' => $package->id,
            'trial_end_at' => now()->addDays(15),
            'start_at' => now(),
            'end_at' => now()->addMonth(),
            'is_active' => true,
        ]);
        */
        dd($team->members());
        $team->members()->attach(auth()->user());

        return $team;
    }
}
