<?php
namespace App\Filament\Pages\Tenancy;

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

        $team->members()->attach(auth()->user());

        return $team;
    }
}

