<?php

namespace App\Filament\Team\Pages;

use Filament\Forms\Form;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Pages\Page;
use App\Models\Legal;
use Filament\Actions\Action;
use Filament\Facades\Filament;
use Filament\Forms\Components\RichEditor;
use Filament\Notifications\Notification;
use Filament\Support\Exceptions\Halt;

class LegalEdit extends Page implements HasForms
{
    use InteractsWithForms;

    public Legal $legal;
    public ?array $data = [];

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static string $view = 'filament.team.pages.legal-edit';

    public function mount(): void
    {
        // Buscar el registro legal o crear uno nuevo si no existe
        $this->legal = Legal::firstOrNew(
            ['team_id' => Filament::getTenant()->id], // Condición para encontrar el registro
            ['content' => __('pages.legal_default')] // Valores por defecto si se crea uno nuevo
        );


        if (!$this->legal->exists) {
            $this->legal->save();
        }

        $this->form->fill($this->legal->attributesToArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                RichEditor::make('content')
                    ->required(),
            ])
            ->statePath('data');
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label(__('filament-panels::resources/pages/edit-record.form.actions.save.label'))
                ->submit('save'),
        ];
    }

    public function save(): void
    {
        try {
            $data = $this->form->getState();

            $this->legal->update($data);
        } catch (Halt $exception) {
            return;
        }

        Notification::make()
            ->success()
            ->title(__('filament-panels::resources/pages/edit-record.notifications.saved.title'))
            ->send();
    }
}
