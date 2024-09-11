<?php

namespace App\Filament\Team\Pages\Auth;

use Filament\Forms\Components\FileUpload;
use Filament\Pages\Auth\EditProfile;

class TeamEditProfile extends EditProfile
{
    /**
     * @return array<int | string, string | Form>
     */
    protected function getForms(): array
    {
        return [
            'form' => $this->form(
                $this->makeForm()
                    ->schema([
                        $this->getNameFormComponent(),
                        $this->getEmailFormComponent(),
                        FileUpload::make('avatar_url')
                          ->directory('avatar')
                          ->avatar(),
                        $this->getPasswordFormComponent(),
                        $this->getPasswordConfirmationFormComponent(),
                    ])
                    ->operation('edit')
                    ->model($this->getUser())
                    ->statePath('data')
                    ->inlineLabel(! static::isSimple()),
            ),
        ];
    }

}