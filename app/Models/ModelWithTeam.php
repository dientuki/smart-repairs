<?php

namespace App\Models;

use App\Models\Team;

class ModelWithTeam extends ModelAuditable
{
    /**
     * Method to define the relationship with the Team model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
