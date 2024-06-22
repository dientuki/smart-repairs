<?php

namespace App\Models;

use App\Models\Team;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModelWithTeam extends ModelAuditable
{
    /**
     * Method to define the relationship with the Team model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
