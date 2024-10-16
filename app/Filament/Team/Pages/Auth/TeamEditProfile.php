<?php

namespace App\Filament\Team\Pages\Auth;

use Filament\Forms\Components\FileUpload;
use Filament\Pages\Auth\EditProfile;
use Filament\Forms\Components\Component;

class TeamEditProfile extends EditProfile
{
    protected function getAvatarFormComponent(): Component
    {
        return FileUpload::make('hash_filename')
                ->directory('avatar')
                ->hiddenLabel()
                ->avatar()
                ->extraAttributes(['class' => 'mx-auto']);
    }

    /**
     * @return array<int | string, string | Form>
     */
    protected function getForms(): array
    {
        return [
            'form' => $this->form(
                $this->makeForm()
                    ->schema([
                        $this->getAvatarFormComponent(),
                        $this->getNameFormComponent(),
                        $this->getEmailFormComponent(),
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
