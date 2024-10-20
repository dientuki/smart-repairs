<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\HasImageTrait;
use App\Traits\HasTeamTrait;
use App\Traits\IdAttributeUppercaseTrait;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Filament\Models\Contracts\HasTenants;
use Filament\Panel;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable implements FilamentUser, HasTenants, Auditable, HasAvatar
{
    use HasFactory;
    use Notifiable;
    use \OwenIt\Auditing\Auditable;
    use HasUlids;
    use IdAttributeUppercaseTrait;
    use HasImageTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'hash_filename',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getFilamentAvatarUrl(): ?string
    {
        return $this->hash_filename ? Storage::url($this->hash_filename) : null ;
    }

    /**
     * Get the active tenants for the user. ONLY used in login and registration.
     *
     * @param  \Filament\Panel  $panel
     * @return \Illuminate\Support\Collection
     */
    public function getTenants(Panel $panel): Collection
    {
        return $this->teams->where('subscription.is_active', true);
    }

    /**
     * Retrieve the teams associated with the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_user', 'user_id', 'team_id');
    }

    public function canAccessTenant(Model $tenant): bool
    {
        return $this->teams->contains($tenant);
    }


    public function canAccessPanel(Panel $panel): bool
    {
        return true;
    }

    public function hasActiveTenant(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->teams->where('subscription.is_active', true)->isNotEmpty()
        );
    }

    /**
     * Obtiene el rol de un usuario en un equipo específico.
     *
     * @return string|null
     */
    public function getRole(): ?string
    {
        $team = $this->teams()->where('team_id', filament()->getTenant()->id)->first();

        return $team ? $team->pivot->rol : null;
    }
}
